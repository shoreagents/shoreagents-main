"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownItem } from '@/components/ui/dropdown'
import { ChevronDown, Menu, X, Star, ArrowRight } from 'lucide-react'
import { useCurrency, currencies, Currency } from '@/lib/currencyContext'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const { selectedCurrency, setSelectedCurrency, userLocation, isDetectingLocation, detectUserLocation, isAutoDetected } = useCurrency()
  const pathname = usePathname()

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  
  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency)
    // Clear auto-detection flag when manually selecting
    if (isAutoDetected) {
      // You can add logic here to clear the auto-detection state if needed
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
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
              <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Our Services</h3>
                    <p className="text-sm text-gray-600">Comprehensive outsourcing solutions for every business need</p>
                  </div>

                  {/* Top Cards Section */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Hire One Agent Card */}
                    <Link href="/services/our-services/hire-one-agent" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Hire One Agent</h4>
                          <p className="text-sm text-gray-600 mb-3">Perfect for first-time outsourcers</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Start conservative
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>

                    {/* Build a Team Card */}
                    <Link href="/services/our-services/build-a-team" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Build a Team</h4>
                          <p className="text-sm text-gray-600 mb-3">Scale your business with 3-10 professionals</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            3-10 people
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>

                    {/* Create a Workforce Card */}
                    <Link href="/services/our-services/create-workforce" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Create a Workforce</h4>
                          <p className="text-sm text-gray-600 mb-3">Large operations, 10+ people</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Private office
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  </div>

                  {/* Bottom Links Section */}
                  <div className="grid grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div className="space-y-2">
                      <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Real Estate Virtual Assistant
                      </Link>
                      <Link href="/services/our-services/property-management-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Property Management Assistant
                      </Link>
                      <Link href="/services/our-services/administrative-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Administrative Assistant
                      </Link>
                      <Link href="/services/our-services/customer-service-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Customer Service Assistant
                      </Link>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-2">
                      <Link href="/services/our-services/construction-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Construction Team
                      </Link>
                      <Link href="/services/our-services/insurance-support" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Insurance Support
                      </Link>
                      <Link href="/services/our-services/marketing-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Marketing Team
                      </Link>
                      <Link href="/services/our-services/finance-accounting" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Finance & Accounting
                      </Link>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-2">
                      <Link href="/services/our-services/architecture-teams" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Architecture Teams
                      </Link>
                      <Link href="/services/our-services/engineering-support" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Engineering Support
                      </Link>
                      <Link href="/services/our-services/legal-teams" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Legal Teams
                      </Link>
                      <Link href="/services/our-services/complete-departments" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Complete Departments
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillars Dropdown */}
            <div className="relative group">
              <Link href="/pillars" className="flex items-center space-x-1 text-gray-700 hover:text-lime-600 px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200">
                <span>Pillars</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              
              {/* Pillars Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pillars</h3>
                    <p className="text-sm text-gray-600">37 topical pillars covering all industries and services</p>
                  </div>

                  {/* Top Cards Section */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Outsourcing Services Card */}
                    <Link href="/services/pillars/outsourcing-services" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Outsourcing Services</h4>
                          <p className="text-sm text-gray-600 mb-3">Complete business process outsourcing</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Main Pillar
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>

                    {/* Virtual Assistants Card */}
                    <Link href="/services/pillars/virtual-assistants" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Virtual Assistants</h4>
                          <p className="text-sm text-gray-600 mb-3">Specialized virtual assistant services</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Specialized
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>

                    {/* Technical & Digital Card */}
                    <Link href="/services/pillars/technical-digital" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Technical & Digital</h4>
                          <p className="text-sm text-gray-600 mb-3">Technical and digital services</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Technical
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  </div>

                  {/* Bottom Links Section */}
                  <div className="grid grid-cols-3 gap-8">
                    {/* Column 1 - Outsourcing Services */}
                    <div className="space-y-2">
                      <Link href="/services/pillars/real-estate-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Real Estate Outsourcing
                      </Link>
                      <Link href="/services/pillars/property-management-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Property Management Outsourcing
                      </Link>
                      <Link href="/services/pillars/construction-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Construction Outsourcing
                      </Link>
                      <Link href="/services/pillars/accounting-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Accounting Outsourcing
                      </Link>
                    </div>

                    {/* Column 2 - Virtual Assistants */}
                    <div className="space-y-2">
                      <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Real Estate Virtual Assistant
                      </Link>
                      <Link href="/services/pillars/seo-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        SEO Virtual Assistant
                      </Link>
                      <Link href="/services/pillars/ai-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        AI Virtual Assistant
                      </Link>
                      <Link href="/services/pillars/social-media-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Social Media Virtual Assistant
                      </Link>
                    </div>

                    {/* Column 3 - Technical & Digital */}
                    <div className="space-y-2">
                      <Link href="/services/pillars/architectural-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Architectural Outsourcing
                      </Link>
                      <Link href="/services/pillars/engineering-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Engineering Outsourcing
                      </Link>
                      <Link href="/services/pillars/seo-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        SEO Outsourcing
                      </Link>
                      <Link href="/services/pillars/graphic-design-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Graphic Design Outsourcing
                      </Link>
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
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">About Shore</h3>
                    <p className="text-sm text-gray-600">Learn about our company, team, and mission</p>
                  </div>

                  {/* Top Cards Section */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Our Story Card */}
                    <Link href="/about/our-story" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Our Story</h4>
                          <p className="text-sm text-gray-600 mb-3">Learn about our journey</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Story
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>

                    {/* Our Team Card */}
                    <Link href="/about/team" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Our Team</h4>
                          <p className="text-sm text-gray-600 mb-3">Meet the people behind Shore</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Team
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>

                    {/* Our Mission Card */}
                    <Link href="/about/our-mission" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Our Mission</h4>
                          <p className="text-sm text-gray-600 mb-3">What drives us forward</p>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Mission
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  </div>

                  {/* Bottom Links Section */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-2">
                      <Link href="/about/stephen-atcheler" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Stephen Atcheler, CEO
                      </Link>
                      <Link href="/about/leadership-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Leadership Team
                      </Link>
                      <Link href="/about/company-values" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Company Values
                      </Link>
                      <Link href="/about/culture" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Our Culture
                      </Link>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                      <Link href="/about/case-studies" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Case Studies
                      </Link>
                      <Link href="/about/success-stories" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Success Stories
                      </Link>
                      <Link href="/about/client-testimonials" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Client Testimonials
                      </Link>
                      <Link href="/about/partnerships" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Partnerships
                      </Link>
                      <Link href="/about/office-location" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Office Location
                      </Link>
                      <Link href="/about/contact-us" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Contact Us
                      </Link>
                      <Link href="/about/careers" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Careers
                      </Link>
                      <Link href="/about/news" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
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
                className={`flex items-center space-x-2 bg-lime-600 text-white border border-lime-600 rounded-lg px-4 py-1.5 cursor-pointer hover:bg-lime-500 hover:border-lime-500 transition-all duration-200 w-28 shadow-sm hover:shadow-md ${isAutoDetected ? 'ring-2 ring-lime-300' : ''}`}
                title={isDetectingLocation ? "Detecting your location..." : `Current currency: ${selectedCurrency.code}${isAutoDetected ? ' (Auto-detected)' : ''}`}
              >
                {isDetectingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm font-medium text-white">...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold text-white">{selectedCurrency.symbol}</span>
                    <span className="text-sm font-medium text-white">{selectedCurrency.code}</span>
                  </>
                )}
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

          {/* Mobile Right Side - Currency and Burger */}
          <div className="lg:hidden flex items-center space-x-2 pr-4">
            {/* Mobile Currency Selector - Outside Burger */}
            <div className="relative group">
              <button 
                className={`flex items-center space-x-2 bg-lime-600 text-white border border-lime-600 rounded-lg px-3 py-2 hover:bg-lime-500 hover:border-lime-500 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-opacity-50 ${isAutoDetected ? 'ring-2 ring-lime-300 ring-opacity-50' : ''}`}
                title={isDetectingLocation ? "Detecting your location..." : `Current currency: ${selectedCurrency.code}${isAutoDetected ? ' (Auto-detected)' : ''}`}
                onClick={() => {
                  // Toggle dropdown visibility
                  const dropdown = document.querySelector('.currency-dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('opacity-0');
                    dropdown.classList.toggle('invisible');
                  }
                }}
              >
                {isDetectingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm font-medium text-white">...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                    <span className="text-sm font-medium text-white">{selectedCurrency.code}</span>
                  </>
                )}
                <ChevronDown className="h-3 w-3 text-white transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              {/* Currency Dropdown */}
              <div className="currency-dropdown absolute top-full right-0 mt-2 bg-white border border-lime-600 rounded-lg shadow-xl transition-all duration-300 ease-in-out z-50 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div className="p-3">
                  <div className="text-gray-700 font-medium mb-3 text-left">Currency</div>
                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((currency) => (
                      <button 
                        key={currency.code}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-lime-50 rounded transition-colors duration-200 border border-gray-200 text-left w-full"
                        onClick={() => handleCurrencySelect(currency)}
                      >
                        <span className="text-lg font-bold text-lime-600 w-8">{currency.symbol}</span>
                        <span className="text-sm text-gray-700 font-medium">{currency.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button - Right Side */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:bg-lime-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="max-h-[80vh] overflow-y-auto bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                
                {/* Main Navigation Items */}
                <Link href="/howItWorks" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/howItWorks') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
                  <span className="relative inline-block">
                  How it works
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/howItWorks') ? 'w-full' : ''}`}></span>
                  </span>
                </Link>
                
                <Link href="/pricing" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/pricing') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
                  <span className="relative inline-block">
                  Pricing
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/pricing') ? 'w-full' : ''}`}></span>
                  </span>
                </Link>
                
                <Link href="/case-studies" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/case-studies') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
                  <span className="relative inline-block">
                  Case Studies
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/case-studies') ? 'w-full' : ''}`}></span>
                  </span>
                </Link>
                
                <Link href="/blogs" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/blogs') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
                  <span className="relative inline-block">
                  Blogs
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full ${isActive('/blogs') ? 'w-full' : ''}`}></span>
                  </span>
                </Link>

                {/* Services Section */}
                <div className="border-b border-gray-100">
                  <button 
                    onClick={() => toggleSection('services')}
                    className="w-full flex items-center justify-between px-3 py-3 font-semibold text-gray-700 hover:text-lime-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Services</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('services') ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedSections.includes('services') && (
                    <div className="pl-4 space-y-1 pb-3">
                      {/* Our Services */}
                   <div className="mb-3">
                        <div className="text-sm font-semibold text-gray-800 mb-2 px-3 py-1">Our Services</div>
                        <div className="pl-3 space-y-1">
                          <Link href="/services/our-services/hire-one-agent" className="block text-gray-600 hover:text-lime-600 py-2 text-sm font-medium px-3 rounded hover:bg-lime-50">
                         Hire One Agent - Perfect for first-time outsourcers
                       </Link>
                          <Link href="/services/our-services/build-a-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm font-medium px-3 rounded hover:bg-lime-50">
                         Build a Team - Scale your business with 3-10 professionals
                       </Link>
                          <Link href="/services/our-services/create-workforce" className="block text-gray-600 hover:text-lime-600 py-2 text-sm font-medium px-3 rounded hover:bg-lime-50">
                         Create a Workforce - Large operations, 10+ people
                       </Link>
                       
                       {/* Specialized Roles */}
                       <div className="mt-3 pt-2 border-t border-gray-200">
                            <div className="text-xs font-semibold text-gray-700 mb-2 px-3">Specialized Roles:</div>
                            <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Real Estate Virtual Assistant
                         </Link>
                            <Link href="/services/our-services/property-management-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Property Management Assistant
                         </Link>
                            <Link href="/services/our-services/administrative-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Administrative Assistant
                         </Link>
                            <Link href="/services/our-services/customer-service-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Customer Service Assistant
                         </Link>
                            <Link href="/services/our-services/construction-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Construction Team
                         </Link>
                            <Link href="/services/our-services/insurance-support" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Insurance Support
                         </Link>
                            <Link href="/services/our-services/marketing-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Marketing Team
                         </Link>
                            <Link href="/services/our-services/finance-accounting" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Finance & Accounting
                         </Link>
                            <Link href="/services/our-services/architecture-teams" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Architecture Teams
                         </Link>
                            <Link href="/services/our-services/engineering-support" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Engineering Support
                         </Link>
                            <Link href="/services/our-services/legal-teams" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Legal Teams
                         </Link>
                            <Link href="/services/our-services/complete-departments" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Complete Departments
                         </Link>
                       </div>
                     </div>
                   </div>
                      
                      {/* Pillars */}
                   <div>
                        <div className="text-sm font-semibold text-gray-800 mb-2 px-3 py-1">Pillars</div>
                        <div className="pl-3 space-y-1">
                          <Link href="/services/pillars/real-estate-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Real Estate Outsourcing
                       </Link>
                          <Link href="/services/pillars/property-management-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Property Management Outsourcing
                       </Link>
                          <Link href="/services/pillars/construction-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Construction Outsourcing
                       </Link>
                          <Link href="/services/pillars/accounting-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Accounting Outsourcing
                       </Link>
                          <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Real Estate Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/seo-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         SEO Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/ai-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         AI Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/social-media-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Social Media Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/architectural-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Architectural Outsourcing
                       </Link>
                          <Link href="/services/pillars/engineering-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Engineering Outsourcing
                       </Link>
                          <Link href="/services/pillars/seo-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         SEO Outsourcing
                   </Link>
                          <Link href="/services/pillars/graphic-design-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Graphic Design Outsourcing
                   </Link>
                     </div>
                   </div>
                 </div>
                  )}
               </div>
               
                {/* About Section */}
                <div className="border-b border-gray-100">
                  <button 
                    onClick={() => toggleSection('about')}
                    className="w-full flex items-center justify-between px-3 py-3 font-semibold text-gray-700 hover:text-lime-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>About Shore</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('about') ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedSections.includes('about') && (
                    <div className="pl-4 space-y-1 pb-3">
                      <Link href="/about/our-story" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Story
                      </Link>
                      <Link href="/about/team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Team
                      </Link>
                      <Link href="/about/our-mission" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Mission
                      </Link>
                      <Link href="/about/stephen-atcheler" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Stephen Atcheler, CEO
                      </Link>
                      <Link href="/about/leadership-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Leadership Team
                      </Link>
                      <Link href="/about/company-values" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Company Values
               </Link>
                      <Link href="/about/culture" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Culture
               </Link>
                      <Link href="/about/case-studies" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                 Case Studies
                      </Link>
                      <Link href="/about/success-stories" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Success Stories
                      </Link>
                      <Link href="/about/client-testimonials" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Client Testimonials
                      </Link>
                      <Link href="/about/partnerships" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Partnerships
                      </Link>
                      <Link href="/about/office-location" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Office Location
                      </Link>
                      <Link href="/about/contact-us" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Contact Us
               </Link>
                      <Link href="/about/careers" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Careers
               </Link>
                      <Link href="/about/news" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        News & Updates
               </Link>
                    </div>
                  )}
                </div>

                {/* Side Nav Items - Mobile */}
                <div className="px-3 py-3 space-y-3">
                  <div className="text-gray-700 font-medium mb-3">Quick Actions</div>
                  
                  {/* Philippines Got Talent Button - Mobile */}
                  <button 
                    onClick={() => window.location.href = '/employees'}
                    className="w-full bg-lime-100 border border-lime-600 rounded-lg px-4 py-3 shadow-[4px_4px_0px_#4d7c0f] flex items-center justify-between opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-lime-200 hover:shadow-[6px_6px_0px_#4d7c0f] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0 active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-lime-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">
                        <span className="font-normal">PHILIPPINES GOT </span>
                        <span className="font-bold">TALENT!</span>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-lime-600 flex-shrink-0" />
                  </button>
                  
                  {/* Book Consultations Button - Mobile */}
                  <button 
                    onClick={() => window.location.href = '/gettingstart'}
                    className="w-full bg-lime-100 border border-lime-600 rounded-lg px-4 py-3 shadow-[4px_4px_0px_#4d7c0f] flex items-center justify-between opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-lime-200 hover:shadow-[6px_6px_0px_#4d7c0f] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0 active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        <span className="font-normal">BOOK </span>
                        <span className="font-bold">CONSULTATIONS!</span>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-lime-600 flex-shrink-0" />
                  </button>
                </div>
              </div>
             </div>
           </div>
         )}
       </div>
     </nav>
   )
 }
