"use client"

import React from 'react'
import { useCurrency } from '@/lib/currencyContext'
import { Button } from '@/components/ui/button'

export default function CurrencyTestPage() {
  const { 
    selectedCurrency, 
    setSelectedCurrency, 
    userLocation, 
    isDetectingLocation, 
    detectUserLocation, 
    isAutoDetected,
    hasUserSelectedCurrency,
    setHasUserSelectedCurrency,
    currencies,
    convertPrice,
    formatPrice
  } = useCurrency()

  const testPrices = [100, 500, 1000, 2500, 5000]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Currency Detection Test</h1>
          
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-lime-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-lime-800 mb-3">Current Currency</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-semibold">{selectedCurrency.symbol} {selectedCurrency.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Exchange Rate:</span>
                  <span className="font-semibold">{selectedCurrency.exchangeRate}</span>
                </div>
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">Auto-detected:</span>
                   <span className={`font-semibold ${isAutoDetected ? 'text-lime-600' : 'text-gray-500'}`}>
                     {isAutoDetected ? 'Yes' : 'No'}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">User selected:</span>
                   <span className={`font-semibold ${hasUserSelectedCurrency ? 'text-blue-600' : 'text-gray-500'}`}>
                     {hasUserSelectedCurrency ? 'Yes' : 'No'}
                   </span>
                 </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Location Info</h2>
              <div className="space-y-2">
                {userLocation ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-semibold">{userLocation.country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-semibold">{userLocation.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Country Code:</span>
                      <span className="font-semibold">{userLocation.countryCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Timezone:</span>
                      <span className="font-semibold">{userLocation.timezone}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">
                    {isDetectingLocation ? 'Detecting location...' : 'No location detected'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={detectUserLocation}
              disabled={isDetectingLocation}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              {isDetectingLocation ? 'Detecting...' : 'Detect My Location'}
            </Button>
            
                         <Button 
               onClick={() => {
                 setSelectedCurrency(currencies[0])
                 setHasUserSelectedCurrency(true)
               }}
               className="bg-gray-600 hover:bg-gray-700 text-white"
             >
               Reset to USD
             </Button>
             
             <Button 
               onClick={() => setHasUserSelectedCurrency(false)}
               className="bg-blue-600 hover:bg-blue-700 text-white"
             >
               Enable Auto-Detect
             </Button>
          </div>

          {/* Price Conversion Test */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Conversion Test</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {testPrices.map((price) => (
                <div key={price} className="bg-white rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">${price} USD</div>
                  <div className="text-lg font-bold text-lime-600">
                    {formatPrice(convertPrice(price))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Currencies */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Currencies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currencies.map((currency) => (
                                 <button
                   key={currency.code}
                   onClick={() => {
                     setSelectedCurrency(currency)
                     setHasUserSelectedCurrency(true)
                   }}
                   className={`p-3 rounded-lg border transition-all duration-200 ${
                     selectedCurrency.code === currency.code
                       ? 'bg-lime-100 border-lime-600 text-lime-800'
                       : 'bg-white border-gray-200 hover:bg-gray-50'
                   }`}
                 >
                  <div className="text-lg font-bold">{currency.symbol}</div>
                  <div className="text-sm">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.exchangeRate}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
