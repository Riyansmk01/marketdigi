import { NextResponse } from 'next/server'
import { vipReseller } from '@/lib/vipResellerClient'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'game' // 'game' or 'prepaid'
    const filterType = searchParams.get('filter_type') || undefined
    const filterValue = searchParams.get('filter_value') || undefined

    let data;
    if (type === 'prepaid') {
      data = await vipReseller.getPrepaidServices(filterType, filterValue)
    } else {
      data = await vipReseller.getGameFeatureServices(filterType, filterValue)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching VIP services:', error)
    return NextResponse.json({ result: false, message: error.message }, { status: 500 })
  }
}
