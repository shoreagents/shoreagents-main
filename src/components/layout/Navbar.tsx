"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownItem } from '@/components/ui/dropdown'
import { ChevronDown, Menu, X, Star, ArrowRight } from 'lucide-react'
import { useCurrency, currencies } from '@/lib/currencyContext'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
  const { selectedCurrency, setSelectedCurrency } = useCurrency()
  const pathname = usePathname()

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  
  const toggleCurrencyDropdown = () => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)
  
  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency)
    setIsCurrencyDropdownOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
             <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 pl-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/ShoreAgents-Logo.png"
                alt="ShoreAgents Logo"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center">
            {/* Services Dropdown */}
            <Dropdown
              trigger={
                <div className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 cursor-pointer px-3 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              }
            >
              <DropdownItem href="/services">Our Services</DropdownItem>
              <DropdownItem href="/pillars">Pillars</DropdownItem>
            </Dropdown>

            {/* Other Navigation Items */}
            <Link href="/howItWorks" className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold hover:scale-105 hover:shadow-sm ${isActive('/howItWorks') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              How it works
            </Link>
            <Link href="/pricing" className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold hover:scale-105 hover:shadow-sm ${isActive('/pricing') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              Pricing
            </Link>
            <Link href="/case-studies" className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold hover:scale-105 hover:shadow-sm ${isActive('/case-studies') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              Case Studies
            </Link>
            <Link href="/blogs" className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold hover:scale-105 hover:shadow-sm ${isActive('/blogs') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              Blogs
            </Link>
            <Link href="/about" className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold hover:scale-105 hover:shadow-sm ${isActive('/about') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              About Shore
            </Link>
          </div>

          {/* Currency Selector - Right Side */}
          <div className="hidden md:flex items-center pr-4">
            <div className="relative">
              <div 
                onClick={toggleCurrencyDropdown}
                className="flex items-center space-x-2 bg-lime-50 border border-lime-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-lime-100 hover:scale-105 hover:shadow-md transition-all duration-200 w-24"
              >
                <span className="text-lg font-bold text-lime-600">{selectedCurrency.symbol}</span>
                <span className="text-sm font-medium text-gray-700">{selectedCurrency.code}</span>
                <ChevronDown className={`h-4 w-4 text-lime-600 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Currency Dropdown */}
              <div className={`absolute top-full right-0 mt-2 bg-white border border-lime-300 rounded-lg shadow-lg transition-all duration-300 z-50 w-24 ${isCurrencyDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="py-2">
                  {currencies.map((currency) => (
                    <div 
                      key={currency.code}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-lime-50 transition-colors"
                      onClick={() => handleCurrencySelect(currency)}
                    >
                      <span className="text-lg font-bold text-lime-600 w-8">{currency.symbol}</span>
                      <span className="text-sm text-gray-700">{currency.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medium Screen Navigation - More Compact */}
          <div className="hidden md:flex lg:hidden items-center space-x-2 flex-1 justify-center">
            {/* Services Dropdown */}
            <Dropdown
              trigger={
                <div className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 cursor-pointer px-2 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold text-sm">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              }
            >
              <DropdownItem href="/services">Our Services</DropdownItem>
              <DropdownItem href="/pillars">Pillars</DropdownItem>
            </Dropdown>

            {/* Other Navigation Items - Compact */}
            <Link href="/howItWorks" className={`px-2 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold text-sm hover:scale-105 hover:shadow-sm ${isActive('/howItWorks') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              How it works
            </Link>
            <Link href="/pricing" className={`px-2 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold text-sm hover:scale-105 hover:shadow-sm ${isActive('/pricing') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              Pricing
            </Link>
            <Link href="/case-studies" className={`px-2 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold text-sm hover:scale-105 hover:shadow-sm ${isActive('/case-studies') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              Case Studies
            </Link>
            <Link href="/blogs" className={`px-2 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold text-sm hover:scale-105 hover:shadow-sm ${isActive('/blogs') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              Blogs
            </Link>
            <Link href="/about" className={`px-2 py-2 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold text-sm hover:scale-105 hover:shadow-sm ${isActive('/about') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
              About Shore
            </Link>
          </div>



          {/* Mobile menu button - Only on small screens */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:scale-110 hover:bg-lime-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

                 {/* Mobile Navigation Menu */}
         {isMobileMenuOpen && (
           <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                             {/* Services Mobile */}
               <div className="px-3 py-2">
                 <div className="text-gray-700 font-medium mb-2">Services</div>
                 <div className="pl-4 space-y-1">
                   <Link href="/services" className="block text-gray-600 hover:text-lime-600 py-1 font-semibold">
                     Our Services
                   </Link>
                   <Link href="/pillars" className="block text-gray-600 hover:text-lime-600 py-1 font-semibold">
                     Pillars
                   </Link>
                 </div>
               </div>
               
               {/* Other Mobile Items */}
               <Link href="/howItWorks" className={`block px-3 py-2 rounded-lg font-semibold ${isActive('/howItWorks') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
                 How it works
               </Link>
               <Link href="/pricing" className={`block px-3 py-2 rounded-lg font-semibold ${isActive('/pricing') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
                 Pricing
               </Link>
               <Link href="/case-studies" className={`block px-3 py-2 rounded-lg font-semibold ${isActive('/case-studies') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
                 Case Studies
               </Link>
               <Link href="/blogs" className={`block px-3 py-2 rounded-lg font-semibold ${isActive('/blogs') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
                 Blogs
               </Link>
               <Link href="/about" className={`block px-3 py-2 rounded-lg font-semibold ${isActive('/about') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'}`}>
                 About Shore
               </Link>
              

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
