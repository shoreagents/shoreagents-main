"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownItem } from '@/components/ui/dropdown'
import { ChevronDown, Star, ArrowRight } from 'lucide-react'

export function SideNav() {
  const [selectedCurrency, setSelectedCurrency] = useState({
    symbol: '$',
    code: 'USD'
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currencies = [
    { symbol: '$', code: 'USD' },
    { symbol: 'A$', code: 'AUD' },
    { symbol: 'C$', code: 'CAD' },
    { symbol: '£', code: 'GBP' },
    { symbol: 'NZ$', code: 'NZD' },
    { symbol: '€', code: 'EUR' },
    { symbol: '₱', code: 'PHP' }
  ]

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency)
    setIsDropdownOpen(false) // Close dropdown after selection
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handlePhilippinesGotTalent = () => {
    // Add your Philippines Got Talent action here
    console.log('Philippines Got Talent clicked')
    // Example: window.open('https://philippinesgottalent.com', '_blank')
  }

  const handleBookConsultations = () => {
    // Add your Book Consultations action here
    console.log('Book Consultations clicked')
    // Example: window.open('/book-consultation', '_blank')
  }

  return (
    <div className="fixed top-20 right-0 z-50 group">
      <div className="flex flex-col space-y-3 pr-2 transition-all duration-300 group-hover:-pr-10 hover:-mr-10">
        {/* Philippines Got Talent Button */}
        <div className="flex items-center transition-all duration-300 group-hover:translate-x-0 translate-x-44">
          <button 
            onClick={handlePhilippinesGotTalent}
            className="bg-lime-100 border border-lime-300 rounded-2xl px-6 py-5 shadow-[4px_4px_0px_#4d7c0f] min-w-[200px] h-16 flex items-center justify-start opacity-60 group-hover:opacity-100 transition-opacity duration-300 hover:bg-lime-200 transition-colors cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0.5"
          >
            <Star className="w-5 h-5 mr-3 text-lime-600 flex-shrink-0" />
            <div className="flex flex-col items-start justify-center h-full space-y-0 flex-grow">
              <span className="text-xs leading-none text-gray-700">PHILIPPINES</span>
              <span className="text-xs leading-none text-gray-700">GOT</span>
              <span className="font-black text-xs leading-none text-gray-700">TALENT!</span>
            </div>
            <ArrowRight className="w-5 h-5 ml-3 text-lime-600 flex-shrink-0" />
          </button>
        </div>
        
        {/* Book Consultations Button */}
        <div className="flex items-center transition-all duration-300 group-hover:translate-x-0 translate-x-44">
          <button 
            onClick={handleBookConsultations}
            className="bg-lime-100 border border-lime-300 rounded-2xl px-6 py-5 shadow-[4px_4px_0px_#4d7c0f] min-w-[200px] h-16 flex items-center justify-start opacity-60 group-hover:opacity-100 transition-opacity duration-300 hover:bg-lime-200 transition-colors cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-3 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">Book Consultations</span>
          </button>
        </div>
        
        {/* Currency Selector */}
        <div className="flex items-center transition-all duration-300 group-hover:translate-x-0 translate-x-44 relative">
          <div 
            onClick={toggleDropdown}
            className="bg-lime-100 border border-lime-300 rounded-2xl px-6 py-5 shadow-[4px_4px_0px_#4d7c0f] min-w-[200px] h-16 flex items-center cursor-pointer hover:bg-lime-200 transition-colors opacity-60 group-hover:opacity-100 transition-opacity duration-300 relative active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0.5"
          >
            {/* Currency Icon (always visible on left) */}
            <span className="text-xl font-bold text-lime-600 mr-3 flex-shrink-0">{selectedCurrency.symbol}</span>
            
            {/* Centered text */}
            <div className="flex-grow flex justify-center">
              <span className="text-sm text-gray-700 font-medium">{selectedCurrency.code}</span>
            </div>
            
            <ChevronDown className={`h-4 w-4 ml-2 text-lime-600 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Dropdown menu */}
          <div className={`absolute top-full left-0 right-0 mt-2 bg-white border border-lime-300 rounded-2xl shadow-[4px_4px_0px_#4d7c0f] transition-all duration-300 z-50 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="py-2">
              {currencies.map((currency) => (
                <div 
                  key={currency.code}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-lime-50 transition-colors"
                  onClick={() => handleCurrencySelect(currency)}
                >
                  <span className="text-lg font-bold text-lime-600 w-8 flex-shrink-0">{currency.symbol}</span>
                  <div className="flex-grow flex justify-center">
                    <span className="text-sm text-gray-700">{currency.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}