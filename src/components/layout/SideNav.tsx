"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownItem } from '@/components/ui/dropdown'
import { ChevronDown, Star, ArrowRight } from 'lucide-react'

export function SideNav() {
  return (
    <div className="fixed top-20 right-0 z-50 group">
      <div className="flex flex-col space-y-3 pr-2 transition-all duration-300 group-hover:pr-4">
        {/* Philippines Got Talent Button */}
        <div className="flex items-center transition-all duration-300 group-hover:translate-x-0 translate-x-20">
          <div className="bg-lime-100 border border-lime-300 rounded-full px-6 py-5 shadow-lg min-w-[200px] h-16 flex items-center justify-center">
            <Star className="w-5 h-5 mr-3 text-lime-600" />
            <div className="flex flex-col items-center justify-center h-full space-y-0">
              <span className="text-xs leading-none text-gray-700">PHILIPPINES</span>
              <span className="text-xs leading-none text-gray-700">GOT</span>
              <span className="font-black text-xs leading-none text-gray-700">TALENT!</span>
            </div>
            <ArrowRight className="w-5 h-5 ml-3 text-lime-600" />
          </div>
        </div>
        
        {/* Book Consultations Button */}
        <div className="flex items-center transition-all duration-300 group-hover:translate-x-0 translate-x-20">
          <div className="bg-lime-100 border border-lime-300 rounded-full px-6 py-5 shadow-lg min-w-[200px] h-16 flex items-center justify-center">
            <svg className="w-5 h-5 mr-3 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">Book Consultations</span>
          </div>
        </div>
        
        {/* More Dropdown Button */}
        <div className="flex items-center transition-all duration-300 group-hover:translate-x-0 translate-x-20">
          <Dropdown
            trigger={
              <div className="bg-lime-100 border border-lime-300 rounded-full px-6 py-5 shadow-lg min-w-[200px] h-16 flex items-center justify-center cursor-pointer hover:bg-lime-200 transition-colors">
                <svg className="w-5 h-5 mr-3 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <span className="text-sm text-gray-700 font-medium">Currencies</span>
                <ChevronDown className="h-4 w-4 ml-2 text-lime-600" />
              </div>
            }
          >
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇺🇸</span>
              <span>USD</span>
            </DropdownItem>
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇦🇺</span>
              <span>AUD</span>
            </DropdownItem>
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇨🇦</span>
              <span>CAD</span>
            </DropdownItem>
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇬🇧</span>
              <span>GBP</span>
            </DropdownItem>
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇳🇿</span>
              <span>NZD</span>
            </DropdownItem>
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇪🇺</span>
              <span>EUR</span>
            </DropdownItem>
            <DropdownItem href="#" className="flex items-center space-x-2">
              <span className="text-2xl">🇵🇭</span>
              <span>PHP</span>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
