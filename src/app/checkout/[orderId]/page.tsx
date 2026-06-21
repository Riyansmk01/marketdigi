'use client'

import React, { useState, useEffect, useRef, Suspense, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface OrderItem {
  id: string
  title: string
  price: number
  qty: number
  variant: string
  icon: string
}

interface Order {
  id: string
  invoiceNo: string
  items: OrderItem[]
  subtotal: number
  serviceFee: number
  total: number
  paymentMethod: string
  status: string
  createdAt: string
  qrisUrl?: string
  totalAmountPaid?: string
  expiredAt?: string
}

function CheckoutDetail({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter()
  const { orderId } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  
  // QRIS states
  const [qrisUrl, setQrisUrl] = useState('')
  const [totalAmountPaid, setTotalAmountPaid] = useState('')
  const [timeLeft, setTimeLeft] = useState(3600) // default 60 minutes (from API)
  const [paymentStatus, setPaymentStatus] = useState('PENDING') // PENDING, SUCCESS, EXPIRED
  const [qrisImage, setQrisImage] = useState('') // base64 image fallback

  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Find order in local storage
    const localOrders = localStorage.getItem('orders')
    if (localOrders) {
      const parsed: Order[] = JSON.parse(localOrders)
      const found = parsed.find(o => o.id === orderId)
      if (found) {
        setOrder(found)
        if (found.qrisUrl && found.totalAmountPaid) {
          setQrisUrl(found.qrisUrl)
          setTotalAmountPaid(found.totalAmountPaid)
          setLoading(false)
        } else {
          // If no QRIS url generated yet, call the create API
          createQrisTransaction(found)
        }
      } else {
        setErrorMsg('Pesanan tidak ditemukan')
        setLoading(false)
      }
    } else {
      setErrorMsg('Belum ada pesanan terdaftar')
      setLoading(false)
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [orderId])

  // Timer countdown
  useEffect(() => {
    if (loading || paymentStatus !== 'PENDING' || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [loading, paymentStatus, timeLeft])

  // Start polling payment status when QRIS details are ready
  useEffect(() => {
    if (qrisUrl && order && paymentStatus === 'PENDING') {
      pollingRef.current = setInterval(() => {
        checkPaymentStatus(order.invoiceNo)
      }, 3000) // Poll every 3 seconds
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [qrisUrl, order, paymentStatus])

  const createQrisTransaction = async (foundOrder: Order) => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: foundOrder.total,
          order_id: foundOrder.invoiceNo,
          keterangan: `Pembayaran Invoice ${foundOrder.invoiceNo} Marketdigi`
        })
      })

      const resData = await response.json()

      if (response.ok && resData.status && resData.data) {
        const qris = resData.data.qris_url || ''
        const amount = resData.data.total_amount
        const img = resData.data.qris_image || '' // base64 image
        setQrisUrl(qris)
        if (img) setQrisImage(img)
        setTotalAmountPaid(amount)

        // Compute timeLeft from expired_at timestamp
        if (resData.data.expired_at) {
          const expTs = new Date(resData.data.expired_at).getTime()
          const nowTs = Date.now()
          const diff = Math.max(0, Math.floor((expTs - nowTs) / 1000))
          setTimeLeft(diff)
        }
        
        // Save back to localStorage
        const localOrders = localStorage.getItem('orders')
        if (localOrders) {
          const parsed: Order[] = JSON.parse(localOrders)
          const updated = parsed.map(o => {
            if (o.id === foundOrder.id) {
              return { ...o, qrisUrl: qris, totalAmountPaid: amount }
            }
            return o
          })
          localStorage.setItem('orders', JSON.stringify(updated))
        }
      } else {
        setErrorMsg(resData.message || 'Gagal terhubung ke server Merchant QRIS')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Gagal melakukan permintaan integrasi klikqris')
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (invoiceNo: string) => {
    try {
      const response = await fetch(`/api/payment/status?order_id=${invoiceNo}`)
      const resData = await response.json()

      if (response.ok && resData.status && resData.data) {
        const status = resData.data.status // PENDING, SUCCESS, EXPIRED, PAID
        if (status === 'SUCCESS' || status === 'PAID') {
          handlePaymentSuccess()
        } else if (status === 'EXPIRED') {
          setPaymentStatus('EXPIRED')
          if (pollingRef.current) clearInterval(pollingRef.current)
        }
      }
    } catch (err) {
      console.error('Error polling status:', err)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentStatus('SUCCESS')
    if (pollingRef.current) clearInterval(pollingRef.current)

    // Update localStorage order status to 'Berhasil'
    const localOrders = localStorage.getItem('orders')
    if (localOrders && order) {
      const parsed: Order[] = JSON.parse(localOrders)
      const updated = parsed.map(o => {
        if (o.id === order.id) {
          return { ...o, status: 'Berhasil' }
        }
        return o
      })
      localStorage.setItem('orders', JSON.stringify(updated))
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 2rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Menghubungkan ke Gateway QRIS Dinamis...</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Mohon tunggu sebentar, sistem sedang mempersiapkan kode bayar unik Anda.</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>❌</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '1rem' }}>Gagal Memuat Pembayaran</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{errorMsg}</p>
        <Link href="/cart">
          <Button variant="primary" className="btn-3d">Kembali ke Keranjang</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {paymentStatus === 'SUCCESS' ? (
        <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '500px', width: '100%', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '5rem', color: 'var(--success)', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>🎉</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--success)', marginBottom: '1rem' }}>Pembayaran Berhasil!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.7' }}>
            Sistem escrow <strong>Trade Guard</strong> mendeteksi dana pembayaran Anda sebesar <strong>Rp {Number(totalAmountPaid).toLocaleString('id-ID')}</strong> telah terverifikasi secara real-time. Lisensi digital telah dikirimkan ke riwayat transaksi Anda.
          </p>
          
          <Link href="/riwayat-pesanan?success=true">
            <Button variant="primary" size="lg" className="btn-3d" style={{ width: '100%' }}>Buka Lisensi / Pesanan Saya</Button>
          </Link>
        </div>
      ) : paymentStatus === 'EXPIRED' || timeLeft <= 0 ? (
        <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '500px', width: '100%', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>⏰</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--danger)', marginBottom: '1rem' }}>Pembayaran Kedaluwarsa</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Batas waktu 5 menit untuk menyelesaikan pembayaran QRIS Anda telah habis.</p>
          
          <Link href="/cart">
            <Button variant="primary" size="lg" className="btn-3d" style={{ width: '100%' }}>Buat Transaksi Baru</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-[950px] items-start">
          
          {/* Left Side: QRIS Code Image */}
          <div className="glass-panel card-3d w-full md:w-[55%]" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Scan QRIS Dinamis</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Dukungan Semua Aplikasi E-Wallet & Bank</span>

            {/* Live QR Image Box */}
            <div style={{ margin: '2rem auto', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'inline-block', boxShadow: 'var(--shadow-md)', border: '1px solid var(--glass-border)' }}>
              <img
                src={qrisImage || qrisUrl}
                alt="Kode QRIS Dinamis Klikqris"
                style={{ width: '250px', height: '250px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Batas Waktu Pembayaran:</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--danger)', fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Right Side: Invoice details & amount */}
          <div className="w-full md:w-[45%] flex flex-col gap-8">
            <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Detail Pembayaran</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>No. Invoice</span>
                  <span style={{ fontWeight: 'bold' }}>{order?.invoiceNo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Pembelian</span>
                  <span style={{ fontWeight: '600' }}>Rp {order?.total.toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Metode Bayar</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>📱 QRIS DINAMIS</span>
                </div>
              </div>

              {/* Unique Code highlight warning */}
              <div style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid var(--warning)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Nominal Wajib Transfer (Termasuk Kode Unik):</label>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  Rp {Number(totalAmountPaid).toLocaleString('id-ID')}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                  Sistem kami menggunakan kode unik (dua digit terakhir nominal) untuk memverifikasi pembayaran Anda secara otomatis. <strong>Mohon scan QR di samping untuk mentransfer nominal presisi ini.</strong>
                </p>
              </div>

              {/* Manual check status button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button onClick={() => checkPaymentStatus(order?.invoiceNo || '')} variant="primary" style={{ width: '100%' }} className="btn-3d">
                  🔄 Cek Status Pembayaran
                </Button>
              </div>
            </div>

            {/* Trade Guard Security Strip */}
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', background: 'rgba(99,102,241,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                <strong>Trade Guard Escrow Protection:</strong> Dana Anda aman ditahan sistem. Penjual baru akan dibayar setelah Anda menerima & memverifikasi produk.
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.5rem' }}>Memuat Detail Pembayaran...</div>}>
      <CheckoutDetail params={params} />
    </Suspense>
  )
}
