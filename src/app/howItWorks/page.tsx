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
            
            <button onClick={() => window.location.href = '/pricing'}  className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-3xl font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 text-lg shadow-lg hover:shadow-xl cursor-pointer">
              See Pricing Calculator
            </button>
          </div>
        </div>
      </section>

      {/* New Process Steps Section */}
      <section className="bg-lime-600 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-lime-200">3-Step</span> Hiring Process
            </h2>
            <p className="text-xl text-lime-100 max-w-3xl mx-auto">
              Simple, transparent, and effective - here's exactly how we help you find the perfect team members.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Book a Chat With Us</h3>
                  <p className="text-lime-600 font-medium text-base">15-30 Minutes</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What Happens:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• You call us or book online</li>
                    <li>• What kind of work do you need done?</li>
                    <li>• How many people do you want?</li>
                    <li>• What's your budget?</li>
                    <li>• Office or working from home?</li>
                    <li>• When do you want to start?</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What You Need to Prepare:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Job description (basic is fine)</li>
                    <li>• Budget range per person</li>
                    <li>• Timeline (when you want them to start)</li>
                    <li>• Any special requirements</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">What WE Do:</h5>
                    <p className="text-gray-600 text-sm">Listen and understand your needs</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">What YOU Do:</h5>
                    <p className="text-gray-600 text-sm">Tell us what you want</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">15-30 minutes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">💰</span>
                    <span className="text-gray-600 font-semibold">FREE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">We Find Qualified People</h3>
                  <p className="text-lime-600 font-medium text-base">1-2 Weeks</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What WE Do Behind the Scenes:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Search our database of 25,000+ candidates</li>
                    <li>• Post on job sites, Facebook, LinkedIn</li>
                    <li>• Call potential candidates</li>
                    <li>• Use AI to filter and match candidates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Get:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• 3-5 qualified candidates who meet your requirements</li>
                    <li>• Their resumes and test scores</li>
                    <li>• Video interviews you can review</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We DON'T Do:</h4>
                  <p className="text-gray-600 text-sm">Train them on YOUR business, industry, or processes</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">1-2 weeks</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">💰</span>
                    <span className="text-gray-600 font-semibold">FREE (included in setup)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">You Interview and Choose</h3>
                  <p className="text-lime-600 font-medium text-base">100% YOUR Decision</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What Happens:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• We schedule interviews between you and candidates</li>
                    <li>• YOU interview them via video call, phone, or in-person</li>
                    <li>• YOU ask questions about YOUR business needs</li>
                    <li>• YOU decide who fits your requirements</li>
                    <li>• YOU pick who you want to hire</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We DON'T Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Make hiring decisions for you</li>
                    <li>• Know if they're right for YOUR business</li>
                    <li>• Understand YOUR industry better than you</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Interview candidates yourself</li>
                    <li>• Ask YOUR business-specific questions</li>
                    <li>• Make the final hiring decision</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">30-60 minutes per candidate</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">🎯</span>
                    <span className="text-gray-600 font-semibold">Your Choice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Division of Responsibility Section */}
      <section className="bg-lime-600 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Real Division of Responsibility
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Box: Shore Agents = Employment Provider */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Shore Agents = Employment Provider</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">We Provide:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Smart, educated, English-speaking people</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Workspace and equipment</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Payroll and benefits management</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Legal employment compliance</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">IT support and infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Replacement if they quit</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">We Are NOT:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-energy-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Business consultants</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-energy-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Training providers for YOUR industry</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-energy-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Work supervisors or managers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Box: YOU = The Actual Boss */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-ocean-500 rounded-lg mr-4 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">YOU = The Actual Boss</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">You Handle:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">All work-related training and management</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Teaching them YOUR business processes</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Daily work supervision and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Performance standards and quality control</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">YOUR company culture and procedures</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">You Are:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-gray-700">Their direct supervisor</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-gray-700">The expert in YOUR business</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-gray-700">Responsible for their work output</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
