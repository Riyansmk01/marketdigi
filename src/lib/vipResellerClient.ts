import crypto from 'crypto'

export class VipResellerClient {
  private apiUrl = 'https://vip-reseller.co.id/api'
  private apiId = process.env.VIP_RESELLER_API_ID || ''
  private apiKey = process.env.VIP_RESELLER_API_KEY || ''

  private getSignature() {
    return crypto.createHash('md5').update(this.apiId + this.apiKey).digest('hex')
  }

  /**
   * Cek Profil (Berguna untuk melihat saldo)
   */
  async getProfile() {
    const response = await fetch(`${this.apiUrl}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        key: this.apiKey,
        sign: this.getSignature()
      })
    })
    return response.json()
  }

  /**
   * Order Prepaid (Pulsa, Paket Data, PPOB)
   */
  async orderPrepaid(serviceCode: string, targetData: string) {
    const response = await fetch(`${this.apiUrl}/prepaid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        key: this.apiKey,
        sign: this.getSignature(),
        type: 'order',
        service: serviceCode,
        data_no: targetData
      })
    })
    return response.json()
  }

  /**
   * Order Game Feature (Top Up Game)
   */
  async orderGameFeature(serviceCode: string, targetData: string, targetZone?: string) {
    const payload: any = {
        key: this.apiKey,
        sign: this.getSignature(),
        type: 'order',
        service: serviceCode,
        data_no: targetData
    }
    if (targetZone) payload.data_zone = targetZone
    
    const response = await fetch(`${this.apiUrl}/game-feature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload)
    })
    return response.json()
  }

  /**
   * Order Social Media
   */
  async orderSocialMedia(serviceCode: string, targetData: string, quantity: number) {
    const response = await fetch(`${this.apiUrl}/social-media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        key: this.apiKey,
        sign: this.getSignature(),
        type: 'order',
        service: serviceCode,
        data: targetData,
        quantity: quantity.toString()
      })
    })
    return response.json()
  }
}

export const vipReseller = new VipResellerClient()
