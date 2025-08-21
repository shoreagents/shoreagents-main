"use client";

import { SideNav } from "@/components/layout/SideNav";

export default function GettingStartedPage() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              GET STARTED TODAY
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Ready to <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Get Started?</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              Let's Find Your Perfect Team Members
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Take the first step towards building your dream team. Our process is simple, transparent, and designed to get you the right people quickly.
            </p>
          </div>

          {/* Getting Started Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mr-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Book Your Consultation</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Schedule a 15-30 minute call with our team. We'll discuss your needs, budget, and timeline to understand exactly what you're looking for.
              </p>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free consultation call</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No pressure or commitment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Get your questions answered</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mr-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">We Find Your Candidates</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our team searches through our database of 25,000+ qualified candidates to find the perfect matches for your specific requirements.
              </p>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered candidate matching</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pre-screened and tested candidates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>3-5 qualified candidates delivered</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mr-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">You Interview & Choose</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                You interview the candidates we provide and make the final hiring decision. You're in complete control of who joins your team.
              </p>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Direct interviews with candidates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% your hiring decision</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Start working together immediately</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-lime-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Building Your Team?
            </h2>
            
            <p className="text-xl text-lime-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of businesses that have found their perfect team members through ShoreAgents. Start your journey today!
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button className="bg-white text-lime-600 px-8 py-4 rounded-3xl font-semibold hover:bg-gray-100 transition-all duration-300 text-lg shadow-lg hover:shadow-xl cursor-pointer flex items-center">
                Schedule Your Free Consultation
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-3xl font-semibold hover:bg-white hover:text-lime-600 transition-all duration-300 text-lg shadow-lg hover:shadow-xl cursor-pointer"
              >
                View Pricing
              </button>
            </div>

            <div className="mt-8 text-lime-100">
              <p className="text-sm">No commitment required • Free consultation • 100% satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
