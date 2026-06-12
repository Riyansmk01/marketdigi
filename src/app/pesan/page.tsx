'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

interface Message {
  id: string
  sender: 'user' | 'contact'
  text: string
  timestamp: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  status: string
  messages: Message[]
  autoReply: string
}

function ChatForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeContactId, setActiveContactId] = useState<string>('')
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load chat messages and contacts from database
  async function loadChats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCurrentUser(user)

      // Query chats where user is sender or receiver
      const { data: dbChats } = await supabase
        .from('chats')
        .select('*, sender:sender_id(email), receiver:receiver_id(email)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

      let mappedContactsMap: { [key: string]: Contact } = {}

      // Add Trade Guard bot by default
      mappedContactsMap['TradeGuard'] = {
        id: 'TradeGuard',
        name: '🛡️ Trade Guard Bot',
        avatar: 'TG',
        status: 'Bot Aktif',
        autoReply: 'Halo! Saya adalah asisten Trade Guard. Seluruh dana transaksi Anda ditahan secara aman di sistem Escrow (Rekening Bersama) kami.',
        messages: [
          { id: 'tg_welcome', sender: 'contact', text: 'Sistem Trade Guard mengamankan dana transaksi Anda. Status pesanan: Terlindungi.', timestamp: '00:00' }
        ]
      }

      if (dbChats) {
        dbChats.forEach((chat: any) => {
          const isMeSender = chat.sender_id === user.id
          const contactId = isMeSender ? chat.receiver_id : chat.sender_id
          const contactEmail = isMeSender ? chat.receiver?.email : chat.sender?.email
          const contactName = contactEmail ? contactEmail.split('@')[0] : 'Pengguna'

          if (!mappedContactsMap[contactId]) {
            mappedContactsMap[contactId] = {
              id: contactId,
              name: contactName,
              avatar: contactName.substring(0, 2).toUpperCase(),
              status: 'Online',
              autoReply: '',
              messages: []
            }
          }

          const time = new Date(chat.created_at)
          const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0')

          mappedContactsMap[contactId].messages.push({
            id: chat.id,
            sender: isMeSender ? 'user' : 'contact',
            text: chat.message,
            timestamp: timeStr
          })
        })
      }

      // Handle direct chat redirect from product details page
      const targetToko = searchParams.get('toko')
      if (targetToko) {
        // Find seller's store and user ID
        const { data: stores } = await supabase
          .from('stores')
          .select('*, seller_profiles:seller_id(*)')
          .or(`name.eq.${targetToko},slug.eq.${targetToko}`)

        if (stores && stores.length > 0) {
          const store = stores[0]
          const sellerUserId = store.seller_profiles?.user_id

          if (sellerUserId && sellerUserId !== user.id) {
            if (!mappedContactsMap[sellerUserId]) {
              const sellerName = store.name
              mappedContactsMap[sellerUserId] = {
                id: sellerUserId,
                name: sellerName,
                avatar: sellerName.substring(0, 2).toUpperCase(),
                status: 'Online',
                autoReply: `Halo kak! Terima kasih telah menghubungi ${sellerName}. Ada yang bisa kami bantu?`,
                messages: []
              }
            }
            if (!activeContactId) {
              setActiveContactId(sellerUserId)
            }
          }
        }
      }

      const contactsList = Object.values(mappedContactsMap)
      setContacts(contactsList)

      if (contactsList.length > 0 && !activeContactId) {
        setActiveContactId(contactsList[0].id)
      }
    } catch (err) {
      console.error('Error loading chats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChats()
    // Poll for new messages every 5 seconds for real-time feel
    const interval = setInterval(loadChats, 5000)
    return () => clearInterval(interval)
  }, [searchParams, activeContactId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [contacts, activeContactId])

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0]

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeContactId || !currentUser) return

    const messageText = inputText
    setInputText('')

    try {
      if (activeContactId === 'TradeGuard') {
        // Trade Guard bot reply
        setContacts(prev => prev.map(c => {
          if (c.id === 'TradeGuard') {
            return {
              ...c,
              messages: [
                ...c.messages,
                { id: 'user_' + Date.now(), sender: 'user', text: messageText, timestamp: 'Now' },
                { id: 'tg_' + Date.now(), sender: 'contact', text: c.autoReply, timestamp: 'Now' }
              ]
            }
          }
          return c
        }))
        return
      }

      // Save message to Supabase chats table
      const { error } = await supabase
        .from('chats')
        .insert({
          sender_id: currentUser.id,
          receiver_id: activeContactId,
          message: messageText
        })

      if (error) throw error

      // Trigger system notification for the receiver
      await supabase.from('notifications').insert({
        user_id: activeContactId,
        title: '💬 Pesan Baru',
        message: `Pesan baru dari ${currentUser.email?.split('@')[0]}: "${messageText.substring(0, 30)}..."`,
        is_read: false
      })

      // Reload chats immediately
      loadChats()
    } catch (err: any) {
      toast.error('Gagal mengirim pesan: ' + err.message)
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Pesan Masuk</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Diskusikan produk dengan penjual atau hubungi support sistem Trade Guard.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)' }}>
        
        {/* Left Side: Contact List */}
        <aside style={{ borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--glass-border)' }}>
            <input 
              type="text" 
              placeholder="Cari percakapan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '999px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} 
            />
          </div>

          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Memuat percakapan...</div>
            ) : contacts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada obrolan aktif.</div>
            ) : (
              (() => {
                const filteredContacts = contacts.filter(contact => 
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contact.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                if (filteredContacts.length === 0) {
                  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Obrolan tidak ditemukan.</div>
                }
                return filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      background: activeContactId === contact.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      borderBottom: '1px solid var(--glass-border)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: contact.id === 'TradeGuard' ? 'linear-gradient(135deg, #4f46e5, #4338ca)' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                      {contact.avatar}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{contact.name}</h4>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                        {contact.messages[contact.messages.length - 1]?.text || 'Mulai percakapan...'}
                      </p>
                    </div>
                  </div>
                ))
              })()
            )}
          </div>
        </aside>

        {/* Right Side: Chat Window */}
        <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activeContact ? (
            <>
              {/* Header */}
              <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-primary)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: activeContact.id === 'TradeGuard' ? 'linear-gradient(135deg, #4f46e5, #4338ca)' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {activeContact.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{activeContact.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>● {activeContact.status}</span>
                </div>
              </div>

              {/* Messages Container */}
              <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'radial-gradient(circle at 10% 90%, rgba(99,102,241,0.02) 0%, rgba(0,0,0,0) 60%)' }}>
                {activeContact.messages.map((msg, index) => (
                  <div 
                    key={msg.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      <div style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: msg.sender === 'user' ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                        background: msg.sender === 'user' ? 'var(--accent-color)' : 'var(--bg-primary)',
                        color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                        boxShadow: 'var(--shadow-sm)',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendMessage} style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', background: 'var(--bg-primary)' }}>
                <input 
                  type="text" 
                  placeholder="Tulis pesan..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.5rem',
                    borderRadius: '999px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
                <Button type="submit" variant="primary" className="btn-3d" style={{ borderRadius: '999px', padding: '0.85rem 1.5rem' }}>
                  Kirim
                </Button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Pilih percakapan untuk memulai chat.
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.5rem' }}>Memuat Halaman...</div>}>
      <ChatForm />
    </Suspense>
  )
}
