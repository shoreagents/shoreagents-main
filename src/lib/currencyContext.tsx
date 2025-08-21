"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { currencyApi } from './api'

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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})

  // Fetch real-time exchange rates
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true)
    try {
      const rates = await currencyApi.getExchangeRates()
      
      if (rates) {
        setExchangeRates(rates)
        setLastUpdated(new Date().toLocaleTimeString())
        
        // Update currencies with real-time rates
        const updatedCurrencies = currencies.map(currency => ({
          ...currency,
          exchangeRate: rates[currency.code] || currency.exchangeRate
        }))
        
        // Update selected currency with new rate
        const currentSelected = updatedCurrencies.find(c => c.code === selectedCurrency.code)
        if (currentSelected) {
          setSelectedCurrency(currentSelected)
        }
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      // Fallback to static rates if API fails
    } finally {
      setIsLoadingRates(false)
    }
  }

  // Refresh rates function
  const refreshRates = async () => {
    await fetchExchangeRates()
  }

  // Fetch rates on mount and every 5 minutes
  useEffect(() => {
    fetchExchangeRates()
    
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [])

  const convertPrice = (usdPrice: number): number => {
    // Use real-time rate if available, otherwise fallback to static rate
    const rate = exchangeRates[selectedCurrency.code] || selectedCurrency.exchangeRate
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
      refreshRates
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
