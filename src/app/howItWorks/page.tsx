"use client";

import { SideNav } from "@/components/layout/SideNav";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      
      {/* Main Content Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-6">
              <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              THE COMPLETE HONEST GUIDE
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              How Shore Agents{" "}
              <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Actually Works</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              What We <span className="text-lime-600 font-bold">ACTUALLY</span> Do vs. What <span className="text-lime-600 font-bold">YOU</span> Do
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              No bullshit explanation of our 6-step process - what we handle, what you handle, and why it works.
            </p>
          </div>

                     {/* Call-to-Action Buttons */}
           <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
             <button className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 text-white px-8 py-4 rounded-3xl font-semibold hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 text-lg shadow-lg hover:shadow-xl cursor-pointer flex items-center">
               Start Your Process Today
               <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
               </svg>
             </button>
             
             <button className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-3xl font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 text-lg shadow-lg hover:shadow-xl cursor-pointer">
               See Pricing Calculator
             </button>
           </div>
        </div>
      </section>
    </div>
  );
}
