"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { currencyApi } from './api'
import { ipDetectionService, getLocationInfo, LocationData } from './ipDetection'

export interface Currency {
  symbol: string
  code: string
  exchangeRate: number // Rate relative to USD
}

interface CurrencyContextType {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  convertPrice: (usdPrice: number) => number
  formatPrice: (price: number) => string
  isLoadingRates: boolean
  lastUpdated: string | null
  refreshRates: () => Promise<void>
  currencies: Currency[]
  userLocation: LocationData | null
  isDetectingLocation: boolean
  detectUserLocation: () => Promise<void>
  isAutoDetected: boolean
  setIsAutoDetected: (detected: boolean) => void
  hasUserSelectedCurrency: boolean
  setHasUserSelectedCurrency: (selected: boolean) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Static fallback rates (PHP to other currencies)
const fallbackRates = {
  USD: 0.018,   // 1 PHP = $0.018
  AUD: 0.027,   // 1 PHP = A$0.027
  CAD: 0.024,   // 1 PHP = C$0.024
  GBP: 0.014,   // 1 PHP = £0.014
  NZD: 0.029,   // 1 PHP = NZ$0.029
  EUR: 0.016,   // 1 PHP = €0.016
  PHP: 1.0      // 1 PHP = 1 PHP
}

const currencies: Currency[] = [
  { symbol: '$', code: 'USD', exchangeRate: 1.0 },
  { symbol: 'A$', code: 'AUD', exchangeRate: 1.52 },
  { symbol: 'C$', code: 'CAD', exchangeRate: 1.35 },
  { symbol: '£', code: 'GBP', exchangeRate: 0.79 },
  { symbol: 'NZ$', code: 'NZD', exchangeRate: 1.64 },
  { symbol: '€', code: 'EUR', exchangeRate: 0.92 },
  { symbol: '₱', code: 'PHP', exchangeRate: 55.5 }
]

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currenciesState, setCurrenciesState] = useState<Currency[]>(currencies)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [isAutoDetected, setIsAutoDetected] = useState(false)
  const [hasUserSelectedCurrency, setHasUserSelectedCurrency] = useState(false)

  // Fetch real-time exchange rates - memoized with useCallback
  const fetchExchangeRates = useCallback(async () => {
    setIsLoadingRates(true)
    try {
      console.log('🔄 Fetching exchange rates...')
      const rates = await currencyApi.getExchangeRates()
      
      if (rates) {
        setExchangeRates(rates)
        setLastUpdated(new Date().toLocaleTimeString())
        
        // Update currencies with real-time rates
        const updatedCurrencies = currencies.map(currency => ({
          ...currency,
          exchangeRate: rates[currency.code] || currency.exchangeRate
        }))
        
        // Update the currencies state
        setCurrenciesState(updatedCurrencies)
        
        // Update selected currency with new rate
        const currentSelected = updatedCurrencies.find(c => c.code === selectedCurrency.code)
        if (currentSelected) {
          setSelectedCurrency(currentSelected)
        }
        
        console.log('✅ Exchange rates updated successfully:', rates)
        console.log('Updated currencies:', updatedCurrencies)
      } else {
        console.warn('⚠️ No exchange rates received from API, using fallback rates')
        // Use fallback rates when API fails
        const fallbackCurrencies = currencies.map(currency => {
          if (currency.code === 'PHP') {
            return { ...currency, exchangeRate: 1.0 }
          } else {
            // Use the fallback rate directly (PHP to target currency)
            const fallbackRate = fallbackRates[currency.code as keyof typeof fallbackRates]
            return { ...currency, exchangeRate: fallbackRate }
          }
        })
        
        setCurrenciesState(fallbackCurrencies)
        
        // Update selected currency with fallback rate
        const currentSelected = fallbackCurrencies.find(c => c.code === selectedCurrency.code)
        if (currentSelected) {
          setSelectedCurrency(currentSelected)
        }
        
        console.log('✅ Using fallback exchange rates:', fallbackRates)
        console.log('Updated currencies with fallback rates:', fallbackCurrencies)
      }
    } catch (error) {
      console.error('❌ Failed to fetch exchange rates:', error)
      // Use fallback rates when API fails
      const fallbackCurrencies = currencies.map(currency => {
        if (currency.code === 'PHP') {
          return { ...currency, exchangeRate: 1.0 }
        } else {
          // Use the fallback rate directly (PHP to target currency)
          const fallbackRate = fallbackRates[currency.code as keyof typeof fallbackRates]
          return { ...currency, exchangeRate: fallbackRate }
        }
      })
      
      setCurrenciesState(fallbackCurrencies)
      
      // Update selected currency with fallback rate
      const currentSelected = fallbackCurrencies.find(c => c.code === selectedCurrency.code)
      if (currentSelected) {
        setSelectedCurrency(currentSelected)
      }
      
      console.log('✅ Using fallback exchange rates due to API error:', fallbackRates)
      console.log('Updated currencies with fallback rates:', fallbackCurrencies)
    } finally {
      setIsLoadingRates(false)
    }
  }, [selectedCurrency.code])

  // Refresh rates function
  const refreshRates = useCallback(async () => {
    await fetchExchangeRates()
  }, [fetchExchangeRates])

  // Detect user location and set appropriate currency
  const detectUserLocation = useCallback(async () => {
    setIsDetectingLocation(true)
    try {
      console.log('🔄 Starting location detection...')
      const locationInfo = await getLocationInfo()
      
      if (locationInfo.location) {
        setUserLocation(locationInfo.location)
        
        // Find the currency in our available currencies
        const detectedCurrency = currenciesState.find(c => c.code === locationInfo.currency)
        
        if (detectedCurrency) {
          setSelectedCurrency(detectedCurrency)
          setIsAutoDetected(true)
          setHasUserSelectedCurrency(false) // Reset user selection flag when auto-detecting
          console.log(`✅ Auto-detected currency: ${detectedCurrency.code} for location: ${locationInfo.location.country}`)
        } else {
          console.log(`⚠️ Currency ${locationInfo.currency} not found in available currencies, keeping current selection`)
        }
      } else {
        console.log('⚠️ No location detected, keeping default currency')
      }
    } catch (error) {
      console.error('❌ Failed to detect user location:', error)
      // Don't throw error, just log it
    } finally {
      setIsDetectingLocation(false)
    }
  }, [currenciesState])

  // Fetch rates on mount and every 5 minutes
  useEffect(() => {
    let isMounted = true;
    
    const fetchRates = async () => {
      if (!isMounted) return;
      await fetchExchangeRates();
    };
    
    fetchRates();
    
    const interval = setInterval(() => {
      if (isMounted) {
        fetchRates();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchExchangeRates]);

  // Detect user location on mount (only if user hasn't manually selected a currency)
  useEffect(() => {
    let isMounted = true;
    
    const detectLocation = async () => {
      if (!isMounted) return;
      // Only auto-detect if user hasn't manually selected a currency
      if (!hasUserSelectedCurrency) {
        try {
          console.log('🔄 Attempting to auto-detect user location...');
          await detectUserLocation();
        } catch (error) {
          console.warn('⚠️ Auto-detection failed, keeping default currency:', error);
          // Don't throw error, just log it and keep default currency
        }
      }
    };
    
    detectLocation();
    
    return () => {
      isMounted = false;
    };
  }, [detectUserLocation, hasUserSelectedCurrency]);

  const convertPrice = (phpAmount: number): number => {
    // If PHP is selected, return the amount as is
    if (selectedCurrency.code === 'PHP') {
      return phpAmount;
    }
    
    // Use the selected currency's exchange rate (which gets updated with real-time rates)
    // The exchange rate is now relative to PHP, not USD
    const rate = selectedCurrency.exchangeRate;
    console.log(`Converting ${phpAmount} PHP to ${selectedCurrency.code} using rate: ${rate}`);
    return phpAmount * rate;
  }

  const formatPrice = (price: number): string => {
    if (selectedCurrency.code === 'PHP') {
      return `₱${Math.round(price).toLocaleString()}`
    } else if (selectedCurrency.code === 'USD') {
      return `$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'AUD') {
      return `A$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'CAD') {
      return `C$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'GBP') {
      return `£${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'NZD') {
      return `NZ$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'EUR') {
      return `€${price.toFixed(0)}`
    }
    return `${selectedCurrency.symbol}${price.toFixed(0)}`
  }

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      convertPrice,
      formatPrice,
      isLoadingRates,
      lastUpdated,
      refreshRates,
      currencies: currenciesState,
      userLocation,
      isDetectingLocation,
      detectUserLocation,
      isAutoDetected,
      setIsAutoDetected,
      hasUserSelectedCurrency,
      setHasUserSelectedCurrency
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export { currencies }
