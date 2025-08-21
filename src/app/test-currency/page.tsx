'use client';

import { useCurrency } from '@/lib/currencyContext';
import { useEffect, useState } from 'react';

export default function TestCurrencyPage() {
  const { selectedCurrency, setSelectedCurrency, convertPrice, formatPrice, isLoadingRates, lastUpdated, refreshRates, currencies } = useCurrency();
  const [testAmount, setTestAmount] = useState(1000);

  useEffect(() => {
    // Force refresh rates on page load
    refreshRates();
  }, [refreshRates]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Currency Conversion Test</h1>
        
                 <div className="bg-white rounded-lg shadow-md p-6 mb-6">
           <h2 className="text-xl font-semibold mb-4">API Status</h2>
           <div className="space-y-2">
             <p><strong>Loading:</strong> {isLoadingRates ? 'Yes' : 'No'}</p>
             <p><strong>Last Updated:</strong> {lastUpdated || 'Never'}</p>
             <p><strong>Current Currency:</strong> {selectedCurrency.code} ({selectedCurrency.symbol})</p>
             <p><strong>Exchange Rate:</strong> {selectedCurrency.exchangeRate}</p>
             <p><strong>All Currency Rates:</strong></p>
             <div className="text-sm bg-gray-50 p-2 rounded">
               {currencies.map(currency => (
                 <div key={currency.code}>
                   {currency.code}: {currency.exchangeRate}
                 </div>
               ))}
             </div>
           </div>
          
                     <div className="mt-4 space-x-2">
             <button 
               onClick={refreshRates}
               disabled={isLoadingRates}
               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
             >
               {isLoadingRates ? 'Refreshing...' : 'Refresh Rates'}
             </button>
             <button 
               onClick={() => {
                 console.log('Current currencies state:', currencies);
                 console.log('Current selected currency:', selectedCurrency);
               }}
               className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
             >
               Debug State
             </button>
           </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Currency Conversion Test</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Amount (USD):
            </label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <p><strong>USD:</strong> ${testAmount.toLocaleString()}</p>
            <p><strong>Converted to {selectedCurrency.code}:</strong> {formatPrice(convertPrice(testAmount))}</p>
          </div>
        </div>

                 <div className="bg-white rounded-lg shadow-md p-6">
           <h2 className="text-xl font-semibold mb-4">All Currencies</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {currencies.map((currency) => (
               <button
                 key={currency.code}
                 onClick={() => setSelectedCurrency(currency)}
                 className={`p-3 rounded-lg border-2 transition-colors ${
                   selectedCurrency.code === currency.code
                     ? 'border-blue-500 bg-blue-50'
                     : 'border-gray-200 hover:border-gray-300'
                 }`}
               >
                 <div className="font-medium">{currency.code}</div>
                 <div className="text-sm text-gray-600">
                   {formatPrice(convertPrice(testAmount))}
                 </div>
               </button>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}
