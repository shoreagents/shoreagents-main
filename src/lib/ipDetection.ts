export interface LocationData {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
}

export interface CurrencyMapping {
  [countryCode: string]: string
}

// Map country codes to currency codes
const countryToCurrency: CurrencyMapping = {
  'US': 'USD',
  'AU': 'AUD',
  'CA': 'CAD',
  'GB': 'GBP',
  'NZ': 'NZD',
  'PH': 'PHP',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'BE': 'EUR',
  'AT': 'EUR',
  'IE': 'EUR',
  'FI': 'EUR',
  'PT': 'EUR',
  'GR': 'EUR',
  'CY': 'EUR',
  'MT': 'EUR',
  'SK': 'EUR',
  'SI': 'EUR',
  'EE': 'EUR',
  'LV': 'EUR',
  'LT': 'EUR',
  'LU': 'EUR'
}

export class IPDetectionService {
  private static instance: IPDetectionService
  private cachedLocation: LocationData | null = null
  private lastFetchTime: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  public static getInstance(): IPDetectionService {
    if (!IPDetectionService.instance) {
      IPDetectionService.instance = new IPDetectionService()
    }
    return IPDetectionService.instance
  }

  /**
   * Detect user's location using IP-API
   */
  public async detectLocation(): Promise<LocationData | null> {
    try {
      // Check if we have cached data that's still valid
      const now = Date.now()
      if (this.cachedLocation && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        console.log('📍 Using cached location data:', this.cachedLocation)
        return this.cachedLocation
      }

      console.log('🌍 Detecting user location...')
      
      const response = await fetch('http://ip-api.com/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const locationData: LocationData = await response.json()
      
      if (locationData.status === 'success') {
        this.cachedLocation = locationData
        this.lastFetchTime = now
        
        console.log('📍 Location detected successfully:', {
          country: locationData.country,
          city: locationData.city,
          countryCode: locationData.countryCode,
          timezone: locationData.timezone
        })
        
        return locationData
      } else {
        console.error('❌ IP-API returned error status:', locationData)
        return null
      }
    } catch (error) {
      console.error('❌ Failed to detect location:', error)
      return null
    }
  }

  /**
   * Get currency code based on country code
   */
  public getCurrencyFromCountry(countryCode: string): string {
    const currency = countryToCurrency[countryCode.toUpperCase()]
    return currency || 'USD' // Default to USD if country not found
  }

  /**
   * Detect user's currency based on their location
   */
  public async detectUserCurrency(): Promise<string> {
    try {
      const location = await this.detectLocation()
      
      if (location) {
        const currency = this.getCurrencyFromCountry(location.countryCode)
        console.log(`💰 Detected currency: ${currency} for country: ${location.country} (${location.countryCode})`)
        return currency
      }
      
      console.log('💰 Could not detect location, defaulting to USD')
      return 'USD'
    } catch (error) {
      console.error('❌ Failed to detect user currency:', error)
      return 'USD'
    }
  }

  /**
   * Get detailed location information
   */
  public async getLocationInfo(): Promise<{
    location: LocationData | null
    currency: string
    timezone: string
  }> {
    const location = await this.detectLocation()
    const currency = location ? this.getCurrencyFromCountry(location.countryCode) : 'USD'
    const timezone = location?.timezone || 'UTC'

    return {
      location,
      currency,
      timezone
    }
  }

  /**
   * Clear cached location data
   */
  public clearCache(): void {
    this.cachedLocation = null
    this.lastFetchTime = 0
    console.log('🗑️ Location cache cleared')
  }

  /**
   * Check if location data is cached and valid
   */
  public isLocationCached(): boolean {
    const now = Date.now()
    return !!(this.cachedLocation && (now - this.lastFetchTime) < this.CACHE_DURATION)
  }
}

// Export singleton instance
export const ipDetectionService = IPDetectionService.getInstance()

// Utility functions
export const detectUserLocation = () => ipDetectionService.detectLocation()
export const detectUserCurrency = () => ipDetectionService.detectUserCurrency()
export const getLocationInfo = () => ipDetectionService.getLocationInfo()
export const clearLocationCache = () => ipDetectionService.clearCache()
