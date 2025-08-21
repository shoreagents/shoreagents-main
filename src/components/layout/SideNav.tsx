"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Star, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SideNav() {
  const router = useRouter()

  const handlePhilippinesGotTalent = () => {
    // Navigate to employees page
    router.push('/employees')
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
      </div>
    </div>
  )
}