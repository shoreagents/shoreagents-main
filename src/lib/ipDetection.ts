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
      
      // Try primary IP detection service
      try {
        const response = await fetch('https://ip-api.com/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) // 10 second timeout
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
          throw new Error('IP-API returned error status')
        }
      } catch (primaryError) {
        console.warn('❌ Primary IP detection failed, trying fallback...', primaryError)
        
        // Fallback to ipinfo.io
        try {
          const fallbackResponse = await fetch('https://ipinfo.io/json', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(10000) // 10 second timeout
          })

          if (!fallbackResponse.ok) {
            throw new Error(`Fallback HTTP error! status: ${fallbackResponse.status}`)
          }

          const fallbackData = await fallbackResponse.json()
          
          // Convert ipinfo.io format to our LocationData format
          const locationData: LocationData = {
            status: 'success',
            country: fallbackData.country || 'Unknown',
            countryCode: fallbackData.country || 'US',
            region: fallbackData.region || '',
            regionName: fallbackData.region || '',
            city: fallbackData.city || '',
            zip: fallbackData.postal || '',
            lat: parseFloat(fallbackData.loc?.split(',')[0] || '0'),
            lon: parseFloat(fallbackData.loc?.split(',')[1] || '0'),
            timezone: fallbackData.timezone || 'UTC',
            isp: fallbackData.org || '',
            org: fallbackData.org || '',
            as: '',
            query: fallbackData.ip || ''
          }
          
          this.cachedLocation = locationData
          this.lastFetchTime = now
          
          console.log('📍 Location detected successfully (fallback):', {
            country: locationData.country,
            city: locationData.city,
            countryCode: locationData.countryCode,
            timezone: locationData.timezone
          })
          
          return locationData
        } catch (fallbackError) {
          console.error('❌ Both IP detection services failed:', fallbackError)
          
          // Final fallback: try to detect from browser timezone
          try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            console.log('🕐 Using browser timezone as fallback:', timezone)
            
            // Simple timezone to country mapping for common cases
            const timezoneToCountry: { [key: string]: string } = {
              'America/New_York': 'US',
              'America/Los_Angeles': 'US',
              'America/Chicago': 'US',
              'America/Denver': 'US',
              'Europe/London': 'GB',
              'Europe/Paris': 'FR',
              'Europe/Berlin': 'DE',
              'Europe/Rome': 'IT',
              'Europe/Madrid': 'ES',
              'Europe/Amsterdam': 'NL',
              'Europe/Brussels': 'BE',
              'Europe/Vienna': 'AT',
              'Europe/Dublin': 'IE',
              'Europe/Helsinki': 'FI',
              'Europe/Lisbon': 'PT',
              'Europe/Athens': 'GR',
              'Europe/Nicosia': 'CY',
              'Europe/Valletta': 'MT',
              'Europe/Bratislava': 'SK',
              'Europe/Ljubljana': 'SI',
              'Europe/Tallinn': 'EE',
              'Europe/Riga': 'LV',
              'Europe/Vilnius': 'LT',
              'Europe/Luxembourg': 'LU',
              'Australia/Sydney': 'AU',
              'Australia/Melbourne': 'AU',
              'Australia/Brisbane': 'AU',
              'Australia/Perth': 'AU',
              'Australia/Adelaide': 'AU',
              'Australia/Darwin': 'AU',
              'Australia/Hobart': 'AU',
              'Pacific/Auckland': 'NZ',
              'Asia/Manila': 'PH'
            }
            
            const detectedCountry = timezoneToCountry[timezone] || 'US'
            const locationData: LocationData = {
              status: 'success',
              country: detectedCountry === 'US' ? 'United States' : 'Unknown',
              countryCode: detectedCountry,
              region: '',
              regionName: '',
              city: '',
              zip: '',
              lat: 0,
              lon: 0,
              timezone: timezone,
              isp: '',
              org: '',
              as: '',
              query: ''
            }
            
            this.cachedLocation = locationData
            this.lastFetchTime = now
            
            console.log('📍 Location detected via timezone fallback:', {
              country: locationData.country,
              countryCode: locationData.countryCode,
              timezone: locationData.timezone
            })
            
            return locationData
          } catch (timezoneError) {
            console.error('❌ All detection methods failed:', timezoneError)
            throw fallbackError
          }
        }
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
