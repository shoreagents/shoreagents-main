"use client";

import { SideNav } from "@/components/layout/SideNav";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      
      {/* Main Content Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="text-center mb-12">
            {/* Transparent Pricing Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-6">
              <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              TRANSPARENT PRICING
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Shore Agents{" "}
              <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">
                Pricing Calculator
              </span>
            </h1>

            {/* Sub-heading */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Modular Pricing - Mix & Match Your Perfect Setup
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Staff + Workspace + Equipment + Management. No hidden fees, transparent multipliers, benefits at actual cost.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                             {/* Open Pricing Calculator Button */}
               <button className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 text-white px-8 py-4 rounded-3xl font-semibold hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center] flex items-center cursor-pointer">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Open Pricing Calculator
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

                             {/* Book Free Consultation Button */}
               <button className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-3xl font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center cursor-pointer">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Book Free Consultation
              </button>
            </div>
          </div>

          {/* Additional Content Placeholder */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Pricing Calculator Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                Our interactive pricing calculator is being developed to give you exact costs for your specific needs.
              </p>
              <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-3">What you'll be able to calculate:</h4>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-lime-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Staff salaries with transparent multipliers
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-lime-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Workspace options (Office vs Work from Home)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-lime-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Equipment and infrastructure costs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-lime-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Benefits at exact government rates
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-lime-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Setup fees with payment plan options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
