"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

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

  const convertPrice = (usdPrice: number): number => {
    return usdPrice * selectedCurrency.exchangeRate
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
      formatPrice
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
