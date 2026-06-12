import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== ''
}

// Single instance client to prevent "Multiple GoTrueClient instances" warnings
export const realClient = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null

// Initialize dynamic database on client side
const isServer = typeof window === 'undefined'
if (!isServer) {
  const current = localStorage.getItem('db_products')
  if (current) {
    let list = JSON.parse(current)
    // Absolute cleanup: filter out any fake products with IDs '1', '2', '3', '4'
    list = list.filter((p: any) => p.id !== '1' && p.id !== '2' && p.id !== '3' && p.id !== '4')
    localStorage.setItem('db_products', JSON.stringify(list))
  } else {
    localStorage.setItem('db_products', '[]')
  }
}

class QueryBuilder {
  table: string
  filters: Array<{ type: 'eq', col: string, val: any }> = []
  singleRow: boolean = false
  isInsert: boolean = false
  isUpdate: boolean = false
  isDelete: boolean = false
  payload: any = null

  selectColumns: string = '*'
  orderColumn: string | null = null
  orderOptions: { ascending?: boolean } | null = null
  limitCount: number | null = null

  constructor(table: string) {
    this.table = table
  }

  select(columns?: string) {
    this.selectColumns = columns || '*'
    return this
  }

  insert(payload: any) {
    this.isInsert = true
    this.payload = payload
    return this
  }

  update(payload: any) {
    this.isUpdate = true
    this.payload = payload
    return this
  }

  delete() {
    this.isDelete = true
    return this
  }

  eq(col: string, val: any) {
    this.filters.push({ type: 'eq', col, val })
    return this
  }

  single() {
    this.singleRow = true
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderColumn = column
    this.orderOptions = options || null
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  // Handle standard promise resolve/reject for await
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const result = await this.execute()
      if (onfulfilled) return onfulfilled(result)
      return result
    } catch (err) {
      if (onrejected) return onrejected(err)
      throw err
    }
  }

  async execute() {
    if (realClient) {
      try {
        let query: any = realClient.from(this.table)
        
        if (this.isInsert) {
          let insertPayload = this.payload
          if (this.table === 'products') {
            insertPayload = await this.mapProductToDB(realClient, this.payload)
          }
          query = query.insert(insertPayload)
        } else if (this.isUpdate) {
          let updatePayload = this.payload
          if (this.table === 'products') {
            updatePayload = await this.mapProductToDB(realClient, this.payload)
          }
          query = query.update(updatePayload)
        } else if (this.isDelete) {
          query = query.delete()
        } else {
          // If selecting products and default selectColumns is used, automatically join stores and categories
          if (this.table === 'products' && this.selectColumns === '*') {
            query = query.select('*, stores:store_id(*), categories:category_id(*)')
          } else {
            query = query.select(this.selectColumns)
          }
        }

        for (const filter of this.filters) {
          if (filter.type === 'eq') {
            let colName = filter.col
            query = query.eq(colName, filter.val)
          }
        }

        if (this.orderColumn) {
          query = query.order(this.orderColumn, this.orderOptions || undefined)
        }

        if (this.limitCount !== null) {
          query = query.limit(this.limitCount)
        }

        if (this.singleRow) {
          query = query.single()
        }

        const res = await query
        if (res.error && (res.error.code === 'PGRST205' || res.error.message?.includes('does not exist'))) {
          console.warn(`Table "${this.table}" not found in Supabase (code PGRST205). Using localStorage proxy fallback.`)
          return this.executeMock()
        }

        // Map output data if successful
        if (res.data && this.table === 'products') {
          if (Array.isArray(res.data)) {
            res.data = res.data.map((item: any) => this.mapProductFromDB(item))
          } else {
            res.data = this.mapProductFromDB(res.data)
          }
        }

        return res
      } catch (err: any) {
        if (err.code === 'PGRST205' || err.message?.includes('does not exist')) {
          console.warn(`Table "${this.table}" exception caught. Using localStorage proxy fallback.`)
          return this.executeMock()
        }
        return { data: null, error: err }
      }
    } else {
      return this.executeMock()
    }
  }

  // Helper to map DB record to UI product format
  mapProductFromDB(item: any) {
    if (!item) return null
    return {
      id: item.id,
      title: item.name,
      price: Number(item.price),
      displayPrice: `Rp ${Number(item.price).toLocaleString('id-ID')}`,
      badge: item.stock_qty <= 0 ? 'Habis' : (item.price < 50000 ? 'Promo' : 'Ready'),
      fulfillmentType: item.fulfillment_type || 'Akun Digital',
      slug: item.slug,
      description: item.description,
      stockQty: item.stock_qty,
      stockStatus: item.stock_status,
      seller: {
        id: item.stores?.id || 's_current',
        name: item.stores?.name || 'Toko Digital',
        slug: item.stores?.slug || 'mydigital',
        ratingAvg: 5.0,
        reviewCount: 120
      },
      categoryName: item.categories?.name || 'Software & OS'
    }
  }

  // Helper to map UI product payload to DB record
  async mapProductToDB(realClient: any, payload: any) {
    if (!payload) return null

    // Determine store_id dynamically based on current user
    let storeId: string | null = null
    try {
      const { data: { user } } = await realClient.auth.getUser()
      if (user) {
        // Fetch seller profile id
        const { data: sellerData } = await realClient
          .from('seller_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (sellerData) {
          // Fetch store id
          const { data: storeData } = await realClient
            .from('stores')
            .select('id')
            .eq('seller_id', sellerData.id)
            .single()

          if (storeData) {
            storeId = storeData.id
          }
        }
      }
    } catch (e) {
      console.error('Error finding store_id for product insert:', e)
    }

    // Fallback if no store_id could be retrieved: fetch first store from DB
    if (!storeId) {
      try {
        const { data: stores } = await realClient.from('stores').select('id').limit(1)
        if (stores && stores.length > 0) {
          storeId = stores[0].id
        }
      } catch (e) {
        console.error('Error fetching fallback store_id:', e)
      }
    }

    // Determine category_id dynamically based on categoryName
    let categoryId: string | null = null
    const categoryName = payload.categoryName || 'Software & OS'
    try {
      const { data: catData } = await realClient
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .single()

      if (catData) {
        categoryId = catData.id
      } else {
        // Create category if it doesn't exist
        const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const { data: newCat } = await realClient
          .from('categories')
          .insert({ name: categoryName, slug })
          .select('id')
          .single()
        if (newCat) {
          categoryId = newCat.id
        }
      }
    } catch (e) {
      console.error('Error finding/creating category_id:', e)
    }

    // Fallback if no category_id: fetch first category
    if (!categoryId) {
      try {
        const { data: cats } = await realClient.from('categories').select('id').limit(1)
        if (cats && cats.length > 0) {
          categoryId = cats[0].id
        }
      } catch (e) {
        console.error('Error fetching fallback category_id:', e)
      }
    }

    return {
      store_id: storeId,
      category_id: categoryId,
      name: payload.title || 'Produk Digital',
      slug: payload.slug || (payload.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: payload.description || 'Layanan produk digital premium legal dan aman.',
      price: Number(payload.price || 0),
      stock_qty: payload.stockQty !== undefined ? Number(payload.stockQty) : 99,
      stock_status: payload.stockStatus || 'Ready',
      fulfillment_type: payload.fulfillmentType || 'Akun Digital',
      is_published: true
    }
  }

  executeMock() {
    if (isServer) {
      return { data: this.singleRow ? null : [], error: null }
    }

    const key = `db_${this.table}`
    const raw = localStorage.getItem(key)
    let list = raw ? JSON.parse(raw) : []

    if (this.isInsert) {
      const item = { ...this.payload }
      if (!item.id) {
        item.id = 'p_' + Math.random().toString(36).substr(2, 9)
      }
      if (this.table === 'products') {
        if (!item.slug) {
          item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }
        if (!item.displayPrice) {
          item.displayPrice = `Rp ${Number(item.price).toLocaleString('id-ID')}`
        }
        if (!item.seller) {
          item.seller = {
            id: 's_current',
            name: localStorage.getItem('storeName') || 'My Digital Store',
            slug: localStorage.getItem('storeSlug') || 'mydigital',
            ratingAvg: 5.0,
            reviewCount: 1
          }
        }
      }
      list.push(item)
      localStorage.setItem(key, JSON.stringify(list))
      return { data: item, error: null }
    }

    if (this.isUpdate) {
      list = list.map((item: any) => {
        let match = true
        for (const f of this.filters) {
          if (f.type === 'eq' && item[f.col] !== f.val) {
            match = false
          }
        }
        if (match) {
          return { ...item, ...this.payload }
        }
        return item
      })
      localStorage.setItem(key, JSON.stringify(list))
      return { data: list, error: null }
    }

    if (this.isDelete) {
      list = list.filter((item: any) => {
        let match = true
        for (const f of this.filters) {
          if (f.type === 'eq' && item[f.col] !== f.val) {
            match = false
          }
        }
        return !match
      })
      localStorage.setItem(key, JSON.stringify(list))
      return { data: list, error: null }
    }

    // Select
    let filtered = [...list]
    for (const f of this.filters) {
      if (f.type === 'eq') {
        filtered = filtered.filter((item: any) => item[f.col] === f.val)
      }
    }

    if (this.orderColumn) {
      const col = this.orderColumn
      const asc = this.orderOptions?.ascending !== false
      filtered.sort((a: any, b: any) => {
        let valA = a[col]
        let valB = b[col]
        if (valA === undefined || valA === null) return 1
        if (valB === undefined || valB === null) return -1
        if (typeof valA === 'string') {
          return asc ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return asc ? (valA - valB) : (valB - valA)
      })
    }

    if (this.limitCount !== null) {
      filtered = filtered.slice(0, this.limitCount)
    }

    if (this.singleRow) {
      return { data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } }
    }

    return { data: filtered, error: null }
  }
}

export const supabase: any = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'from') {
      return (table: string) => new QueryBuilder(table)
    }
    if (realClient && prop in realClient) {
      const val = (realClient as any)[prop]
      if (typeof val === 'function') {
        return val.bind(realClient)
      }
      return val
    }
    // Fallback if real client is not configured
    if (prop === 'auth') {
      return {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: async () => ({ data: {}, error: null }),
        signInWithOtp: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null })
      }
    }
    return undefined
  }
})
