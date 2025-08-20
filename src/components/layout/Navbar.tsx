"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownItem } from '@/components/ui/dropdown'
import { ChevronDown, Menu, X, Star, ArrowRight } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

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
            <Link href="/how-it-works" className="text-gray-700 hover:text-lime-600 px-3 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold">
              How it works
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-lime-600 px-3 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold">
              Pricing
            </Link>
            <Link href="/case-studies" className="text-gray-700 hover:text-lime-600 px-3 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold">
              Case Studies
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-lime-600 px-3 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold">
              Blogs
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-lime-600 px-3 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold">
              About Shore
            </Link>
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
            <Link href="/how-it-works" className="text-gray-700 hover:text-lime-600 px-2 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold text-sm">
              How it works
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-lime-600 px-2 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold text-sm">
              Pricing
            </Link>
            <Link href="/case-studies" className="text-gray-700 hover:text-lime-600 px-2 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold text-sm">
              Case Studies
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-lime-600 px-2 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold text-sm">
              Blogs
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-lime-600 px-2 py-2 rounded-lg hover:bg-lime-50 transition-all duration-200 whitespace-nowrap font-semibold text-sm">
              About Shore
            </Link>
          </div>



          {/* Mobile menu button - Only on small screens */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-700"
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
               <Link href="/how-it-works" className="block px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded-lg font-semibold">
                 How it works
               </Link>
               <Link href="/pricing" className="block px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded-lg font-semibold">
                 Pricing
               </Link>
               <Link href="/case-studies" className="block px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded-lg font-semibold">
                 Case Studies
               </Link>
               <Link href="/blogs" className="block px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded-lg font-semibold">
                 Blogs
               </Link>
               <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-lime-600 hover:bg-lime-50 rounded-lg font-semibold">
                 About Shore
               </Link>
              

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
