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
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

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

  // Fetch real-time exchange rates - memoized with useCallback
  const fetchExchangeRates = useCallback(async () => {
    setIsLoadingRates(true)
    try {
      console.log('Fetching exchange rates...')
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
        
        console.log('Exchange rates updated successfully:', rates)
        console.log('Updated currencies:', updatedCurrencies)
      } else {
        console.warn('No exchange rates received from API')
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      // Fallback to static rates if API fails
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
      const locationInfo = await getLocationInfo()
      
      if (locationInfo.location) {
        setUserLocation(locationInfo.location)
        
        // Find the currency in our available currencies
        const detectedCurrency = currenciesState.find(c => c.code === locationInfo.currency)
        
        if (detectedCurrency && detectedCurrency.code !== selectedCurrency.code) {
          setSelectedCurrency(detectedCurrency)
          setIsAutoDetected(true)
          console.log(`Auto-detected currency: ${detectedCurrency.code} for location: ${locationInfo.location.country}`)
        }
      }
    } catch (error) {
      console.error('Failed to detect user location:', error)
    } finally {
      setIsDetectingLocation(false)
    }
  }, [currenciesState, selectedCurrency.code])

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

  // Detect user location on mount
  useEffect(() => {
    let isMounted = true;
    
    const detectLocation = async () => {
      if (!isMounted) return;
      await detectUserLocation();
    };
    
    detectLocation();
    
    return () => {
      isMounted = false;
    };
  }, [detectUserLocation]);

  const convertPrice = (usdPrice: number): number => {
    // Use the selected currency's exchange rate (which gets updated with real-time rates)
    const rate = selectedCurrency.exchangeRate
    console.log(`Converting ${usdPrice} USD to ${selectedCurrency.code} using rate: ${rate}`)
    return usdPrice * rate
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
      isAutoDetected
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
