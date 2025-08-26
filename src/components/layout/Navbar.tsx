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
  
  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency)
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
            <div className="relative group">
              <Link href="/services" className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              
              {/* Services Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-3">
                  {/* Our Services */}
                  <div className="relative group/services">
                    <Link href="/services" className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded transition-colors duration-200">
                      <span className="font-medium">Our Services</span>
                      <ChevronDown className="h-4 w-4 group-hover/services:rotate-180 transition-transform duration-200" />
                    </Link>
                    
                    {/* Our Services Submenu */}
                    <div className="absolute left-full top-0 ml-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-300">
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Our Services</h3>
                        
                        {/* Main Service Steps */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <Link href="/services/our-services/hire-one-agent" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Hire One Agent</h4>
                                <p className="text-sm text-gray-600 mt-1">Perfect for first-time outsourcers</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Start conservative</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/our-services/build-a-team" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Build a Team</h4>
                                <p className="text-sm text-gray-600 mt-1">Scale your business with 3-10 professionals</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">3-10 people</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/our-services/create-workforce" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Create a Workforce</h4>
                                <p className="text-sm text-gray-600 mt-1">Large operations, 10+ people</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Private office</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Specialized Roles */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Real Estate Virtual Assistant
                            </Link>
                            <Link href="/services/our-services/property-management-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Property Management Assistant
                            </Link>
                            <Link href="/services/our-services/administrative-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Administrative Assistant
                            </Link>
                            <Link href="/services/our-services/customer-service-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Customer Service Assistant
                            </Link>
                          </div>
                          <div className="space-y-2">
                            <Link href="/services/our-services/construction-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Construction Team
                            </Link>
                            <Link href="/services/our-services/insurance-support" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Insurance Support
                            </Link>
                            <Link href="/services/our-services/marketing-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Marketing Team
                            </Link>
                            <Link href="/services/our-services/finance-accounting" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Finance & Accounting
                            </Link>
                          </div>
                          <div className="space-y-2">
                            <Link href="/services/our-services/technical-teams" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Technical Teams
                            </Link>
                            <Link href="/services/our-services/engineering-support" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Engineering Support
                            </Link>
                            <Link href="/services/our-services/legal-teams" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Legal Teams
                            </Link>
                            <Link href="/services/our-services/complete-departments" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Complete Departments
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pillars */}
                  <div className="relative group/pillars">
                    <Link href="/pillars" className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded transition-colors duration-200">
                      <span className="font-medium">Pillars</span>
                      <ChevronDown className="h-4 w-4 group-hover/pillars:rotate-180 transition-transform duration-200" />
                    </Link>
                    
                    {/* Pillars Submenu */}
                    <div className="absolute left-full top-0 ml-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/pillars:opacity-100 group-hover/pillars:visible transition-all duration-300">
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Pillars</h3>
                        <p className="text-sm text-gray-600 mb-4">37 topical pillars covering all industries and services</p>
                        
                        {/* Main Pillar Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <Link href="/services/pillars/outsourcing-services" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Outsourcing Services</h4>
                                <p className="text-sm text-gray-600 mt-1">Complete business process outsourcing</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Main Pillar</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/pillars/virtual-assistants" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Virtual Assistants</h4>
                                <p className="text-sm text-gray-600 mt-1">Specialized virtual assistant services</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Main Pillar</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/pillars/technical-digital" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Technical & Digital</h4>
                                <p className="text-sm text-gray-600 mt-1">Advanced technical services</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Specialized</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Pillar Items Grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Link href="/services/pillars/real-estate-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Real Estate Outsourcing
                            </Link>
                            <Link href="/services/pillars/property-management-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Property Management Outsourcing
                            </Link>
                            <Link href="/services/pillars/construction-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Construction Outsourcing
                            </Link>
                            <Link href="/services/pillars/accounting-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Accounting Outsourcing
                            </Link>
                          </div>
                          <div className="space-y-2">
                            <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Real Estate Virtual Assistant
                            </Link>
                            <Link href="/services/pillars/seo-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              SEO Virtual Assistant
                            </Link>
                            <Link href="/services/pillars/ai-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              AI Virtual Assistant
                            </Link>
                            <Link href="/services/pillars/social-media-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Social Media Virtual Assistant
                            </Link>
                          </div>
                          <div className="space-y-2">
                            <Link href="/services/pillars/architectural-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Architectural Outsourcing
                            </Link>
                            <Link href="/services/pillars/engineering-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Engineering Outsourcing
                            </Link>
                            <Link href="/services/pillars/seo-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              SEO Outsourcing
                            </Link>
                            <Link href="/services/pillars/graphic-design-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Graphic Design Outsourcing
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Other Navigation Items */}
            <Link href="/howItWorks" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isActive('/howItWorks') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
              <span className="relative inline-block">
              How it works
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/howItWorks') ? 'w-full' : ''}`}></span>
              </span>
            </Link>
            <Link href="/pricing" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isActive('/pricing') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
              <span className="relative inline-block">
              Pricing
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/pricing') ? 'w-full' : ''}`}></span>
              </span>
            </Link>
            <Link href="/case-studies" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isActive('/case-studies') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
              <span className="relative inline-block">
              Case Studies
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/case-studies') ? 'w-full' : ''}`}></span>
              </span>
            </Link>
            <Link href="/blogs" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isActive('/blogs') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
              <span className="relative inline-block">
              Blogs
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/blogs') ? 'w-full' : ''}`}></span>
              </span>
            </Link>
            {/* About Dropdown */}
            <div className="relative group">
              <Link href="/about" className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200">
                <span>About Shore</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              
              {/* About Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">About Shore</h3>
                  
                  {/* Main About Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Link href="/about/our-story" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Our Story</h4>
                          <p className="text-sm text-gray-600 mt-1">Learn about our journey</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Story</span>
                        </div>
                        <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/about/our-team" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Our Team</h4>
                          <p className="text-sm text-gray-600 mt-1">Meet the people behind Shore</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Team</span>
                        </div>
                        <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/about/our-mission" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors duration-200 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200">Our Mission</h4>
                          <p className="text-sm text-gray-600 mt-1">What drives us forward</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded">Mission</span>
                        </div>
                        <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* About Items Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Link href="/about/stephen-atcheler" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Stephen Atcheler, CEO
                      </Link>
                      <Link href="/about/leadership-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Leadership Team
                      </Link>
                      <Link href="/about/company-values" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Company Values
                      </Link>
                      <Link href="/about/culture" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Our Culture
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/about/case-studies" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Case Studies
                      </Link>
                      <Link href="/about/success-stories" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Success Stories
                      </Link>
                      <Link href="/about/client-testimonials" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Client Testimonials
                      </Link>
                      <Link href="/about/partnerships" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Partnerships
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/about/office-location" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Office Location
                      </Link>
                      <Link href="/about/contact-us" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Contact Us
                      </Link>
                      <Link href="/about/careers" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        Careers
                      </Link>
                      <Link href="/about/news" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                        News & Updates
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Selector - Right Side */}
          <div className="hidden md:flex items-center pr-4">
            <div className="relative group">
              <div 
                className="flex items-center space-x-2 bg-lime-600 text-white border border-lime-600 rounded-lg px-4 py-1.5 cursor-pointer hover:bg-lime-500 hover:border-lime-500 transition-all duration-200 w-28 shadow-sm hover:shadow-md"
              >
                <span className="text-lg font-bold text-white">{selectedCurrency.symbol}</span>
                <span className="text-sm font-medium text-white">{selectedCurrency.code}</span>
                <ChevronDown className="h-4 w-4 text-white transition-transform duration-200 group-hover:rotate-180" />
              </div>
              
              {/* Currency Dropdown */}
              <div className="absolute top-full right-0 mt-2 bg-white border border-lime-600 rounded-lg shadow-xl transition-all duration-300 ease-in-out z-50 w-28 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div className="py-2">
                  {currencies.map((currency) => (
                    <div 
                      key={currency.code}
                      className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-lime-50 transition-colors duration-200"
                      onClick={() => handleCurrencySelect(currency)}
                    >
                      <span className="text-lg font-bold text-lime-600 w-8">{currency.symbol}</span>
                      <span className="text-sm text-gray-700 font-medium">{currency.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medium Screen Navigation - More Compact */}
          <div className="hidden md:flex lg:hidden items-center space-x-2 flex-1 justify-center">
            {/* Services Dropdown */}
            <div className="relative group">
              <Link href="/services" className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 px-2 py-2 whitespace-nowrap font-semibold text-sm transition-colors duration-200">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              
              {/* Services Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-2">
                  {/* Our Services */}
                  <div className="relative group/services">
                    <Link href="/services" className="flex items-center justify-between w-full text-left px-2 py-1 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded transition-colors duration-200 text-sm">
                      <span className="font-medium">Our Services</span>
                      <ChevronDown className="h-3 w-3 group-hover/services:rotate-180 transition-transform duration-200" />
                    </Link>
                    
                    {/* Our Services Submenu */}
                    <div className="absolute left-full top-0 ml-1 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-300">
                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Our Services</h3>
                        
                        {/* Main Service Steps */}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          <Link href="/services/our-services/hire-one-agent" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Hire One Agent</h4>
                                <p className="text-xs text-gray-600 mt-1">Perfect for first-time outsourcers</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Start conservative</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/our-services/build-a-team" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Build a Team</h4>
                                <p className="text-xs text-gray-600 mt-1">Scale your business with 3-10 professionals</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">3-10 people</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/our-services/create-workforce" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Create a Workforce</h4>
                                <p className="text-xs text-gray-600 mt-1">Large operations, 10+ people</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Private office</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Specialized Roles */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Real Estate Virtual Assistant
                            </Link>
                            <Link href="/services/our-services/property-management-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Property Management Assistant
                            </Link>
                            <Link href="/services/our-services/administrative-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Administrative Assistant
                            </Link>
                            <Link href="/services/our-services/customer-service-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Customer Service Assistant
                            </Link>
                          </div>
                          <div className="space-y-1">
                            <Link href="/services/our-services/construction-team" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Construction Team
                            </Link>
                            <Link href="/services/our-services/insurance-support" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Insurance Support
                            </Link>
                            <Link href="/services/our-services/marketing-team" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Marketing Team
                            </Link>
                            <Link href="/services/our-services/finance-accounting" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Finance & Accounting
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pillars */}
                  <div className="relative group/pillars">
                    <Link href="/pillars" className="flex items-center justify-between w-full text-left px-2 py-1 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded transition-colors duration-200 text-sm">
                      <span className="font-medium">Pillars</span>
                      <ChevronDown className="h-3 w-3 group-hover/pillars:rotate-180 transition-transform duration-200" />
                    </Link>
                    
                    {/* Pillars Submenu */}
                    <div className="absolute left-full top-0 ml-1 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/pillars:opacity-100 group-hover/pillars:visible transition-all duration-300">
                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Pillars</h3>
                        <p className="text-xs text-gray-600 mb-3">37 topical pillars covering all industries and services</p>
                        
                        {/* Main Pillar Cards */}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          <Link href="/services/pillars/outsourcing-services" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Outsourcing Services</h4>
                                <p className="text-xs text-gray-600 mt-1">Complete business process outsourcing</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Main Pillar</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/pillars/virtual-assistants" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Virtual Assistants</h4>
                                <p className="text-xs text-gray-600 mt-1">Specialized virtual assistant services</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Main Pillar</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/services/pillars/technical-digital" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Technical & Digital</h4>
                                <p className="text-xs text-gray-600 mt-1">Advanced technical services</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Specialized</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Pillar Items Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Link href="/services/pillars/real-estate-outsourcing" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Real Estate Outsourcing
                            </Link>
                            <Link href="/services/pillars/property-management-outsourcing" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Property Management Outsourcing
                            </Link>
                            <Link href="/services/pillars/construction-outsourcing" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Construction Outsourcing
                            </Link>
                            <Link href="/services/pillars/accounting-outsourcing" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Accounting Outsourcing
                            </Link>
                          </div>
                          <div className="space-y-1">
                            <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Real Estate Virtual Assistant
                            </Link>
                            <Link href="/services/pillars/seo-virtual-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              SEO Virtual Assistant
                            </Link>
                            <Link href="/services/pillars/ai-virtual-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              AI Virtual Assistant
                            </Link>
                            <Link href="/services/pillars/social-media-virtual-assistant" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Social Media Virtual Assistant
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Dropdown - Medium Screen */}
            <div className="relative group">
                             <Link href="/about" className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 px-2 py-2 whitespace-nowrap font-semibold text-sm transition-colors duration-200">
                <span>About Shore</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              
              {/* About Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">About Shore</h3>
                  
                  {/* Main About Cards */}
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <Link href="/about/our-story" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Our Story</h4>
                          <p className="text-xs text-gray-600 mt-1">Learn about our journey</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Story</span>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Partnership</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/about/gallery-group-partnership-2" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Gallery Group Partnership</h4>
                                <p className="text-xs text-gray-600 mt-1">Another successful partnership</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Partnership</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/about/jack-miller-savings" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Jack Miller: $40K Savings</h4>
                                <p className="text-xs text-gray-600 mt-1">Cost savings case study</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Savings</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Additional Results Items */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Link href="/about/all-case-studies" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              All Case Studies
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="relative group/resources">
                    <Link href="/about" className="flex items-center justify-between w-full text-left px-2 py-1 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded transition-colors duration-200 text-sm">
                      <span className="font-medium">Resources</span>
                      <ChevronDown className="h-3 w-3 group-hover/resources:rotate-180 transition-transform duration-200" />
                    </Link>
                    
                    {/* Resources Submenu */}
                    <div className="absolute left-full top-0 ml-1 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/resources:opacity-100 group-hover/resources:visible transition-all duration-300">
                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Resources</h3>
                        
                        {/* Resources Section */}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          <Link href="/about/complete-service-guide" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Complete Service Guide</h4>
                                <p className="text-xs text-gray-600 mt-1">Comprehensive service overview</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Guide</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/about/blog-articles" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Blog & Articles</h4>
                                <p className="text-xs text-gray-600 mt-1">Latest insights and updates</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Blog</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/about/pricing-calculator" className="block p-3 bg-lime-50 rounded hover:bg-lime-100 transition-colors duration-200 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors duration-200 text-sm">Pricing Calculator</h4>
                                <p className="text-xs text-gray-600 mt-1">Calculate your costs</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded">Calculator</span>
                              </div>
                              <div className="text-lime-600 group-hover:translate-x-1 transition-transform duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Additional Resources Items */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Link href="/about/our-agents-demos" className="block text-xs text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium">
                              Our Agents Demos
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          {/* Mobile menu button - Only on small screens */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:bg-lime-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        <div>
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                             {/* Services Mobile */}
               <div className="px-3 py-2">
                 <div className="text-gray-700 font-medium mb-2">Services</div>
                 <div className="pl-4 space-y-1">
                   <div className="mb-3">
                     <div className="text-sm font-semibold text-gray-800 mb-1">Our Services</div>
                     <div className="pl-2 space-y-1">
                       {/* Main Service Steps */}
                       <Link href="/services/our-services/hire-one-agent" className="block text-gray-600 hover:text-lime-600 py-1 text-sm font-medium">
                         Hire One Agent - Perfect for first-time outsourcers
                       </Link>
                       <Link href="/services/our-services/build-a-team" className="block text-gray-600 hover:text-lime-600 py-1 text-sm font-medium">
                         Build a Team - Scale your business with 3-10 professionals
                       </Link>
                       <Link href="/services/our-services/create-workforce" className="block text-gray-600 hover:text-lime-600 py-1 text-sm font-medium">
                         Create a Workforce - Large operations, 10+ people
                       </Link>
                       
                       {/* Specialized Roles */}
                       <div className="mt-3 pt-2 border-t border-gray-200">
                         <div className="text-xs font-semibold text-gray-700 mb-1">Specialized Roles:</div>
                         <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Real Estate Virtual Assistant
                         </Link>
                         <Link href="/services/our-services/property-management-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Property Management Assistant
                         </Link>
                         <Link href="/services/our-services/administrative-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Administrative Assistant
                         </Link>
                         <Link href="/services/our-services/customer-service-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Customer Service Assistant
                         </Link>
                         <Link href="/services/our-services/construction-team" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Construction Team
                         </Link>
                         <Link href="/services/our-services/insurance-support" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Insurance Support
                         </Link>
                         <Link href="/services/our-services/marketing-team" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Marketing Team
                         </Link>
                         <Link href="/services/our-services/finance-accounting" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Finance & Accounting
                         </Link>
                         <Link href="/services/our-services/technical-teams" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Technical Teams
                         </Link>
                         <Link href="/services/our-services/engineering-support" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Engineering Support
                         </Link>
                         <Link href="/services/our-services/legal-teams" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Legal Teams
                         </Link>
                         <Link href="/services/our-services/complete-departments" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                           Complete Departments
                         </Link>
                       </div>
                     </div>
                   </div>
                   <div>
                     <div className="text-sm font-semibold text-gray-800 mb-1">Pillars</div>
                     <div className="pl-2 space-y-1">
                                                 <Link href="/services/pillars/real-estate-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Real Estate Outsourcing
                       </Link>
                                               <Link href="/services/pillars/property-management-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Property Management Outsourcing
                       </Link>
                                               <Link href="/services/pillars/construction-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Construction Outsourcing
                       </Link>
                                               <Link href="/services/pillars/accounting-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Accounting Outsourcing
                       </Link>
                                               <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Real Estate Virtual Assistant
                       </Link>
                                               <Link href="/services/pillars/seo-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         SEO Virtual Assistant
                       </Link>
                                               <Link href="/services/pillars/ai-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         AI Virtual Assistant
                       </Link>
                                               <Link href="/services/pillars/social-media-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Social Media Virtual Assistant
                       </Link>
                                               <Link href="/services/pillars/architectural-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Architectural Outsourcing
                       </Link>
                                               <Link href="/services/pillars/engineering-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Engineering Outsourcing
                       </Link>
                                               <Link href="/services/pillars/seo-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         SEO Outsourcing
                   </Link>
                                               <Link href="/services/pillars/graphic-design-outsourcing" className="block text-gray-600 hover:text-lime-600 py-1 text-sm">
                         Graphic Design Outsourcing
                   </Link>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Other Mobile Items */}
               <Link href="/howItWorks" className={`block px-3 py-2 font-semibold relative group ${isActive('/howItWorks') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
                 <span className="relative inline-block">
                 How it works
                   <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/howItWorks') ? 'w-full' : ''}`}></span>
                 </span>
               </Link>
               <Link href="/pricing" className={`block px-3 py-2 font-semibold relative group ${isActive('/pricing') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
                 <span className="relative inline-block">
                 Pricing
                   <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/pricing') ? 'w-full' : ''}`}></span>
                 </span>
               </Link>
               <Link href="/case-studies" className={`block px-3 py-2 font-semibold relative group ${isActive('/case-studies') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
                 <span className="relative inline-block">
                 Case Studies
                   <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/case-studies') ? 'w-full' : ''}`}></span>
                 </span>
               </Link>
               <Link href="/blogs" className={`block px-3 py-2 font-semibold relative group ${isActive('/blogs') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
                 <span className="relative inline-block">
                 Blogs
                   <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/blogs') ? 'w-full' : ''}`}></span>
                 </span>
               </Link>
               <Link href="/about" className={`block px-3 py-2 font-semibold relative group ${isActive('/about') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600'}`}>
                 <span className="relative inline-block">
                 About Shore
                   <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/about') ? 'w-full' : ''}`}></span>
                 </span>
               </Link>
             </div>
           </div>
         )}
       </div>
     </nav>
   )
 }
