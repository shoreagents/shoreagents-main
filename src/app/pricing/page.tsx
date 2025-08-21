"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { PricingCalculatorModal } from "@/components/ui/pricing-calculator-modal";
import { Calculator, Users, Building, Clock, DollarSign, ArrowRight, Star, FileText } from "lucide-react";

export default function PricingPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-lime-50">
      <SideNav />
      
      {/* Main Content Section */}
      <section className="py-16">
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
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Context & Information */}
            <div className="space-y-8">
              {/* How It Works */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-lime-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-6 h-6 text-lime-600 mr-3" />
                  How It Works
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lime-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Configure Your Team</h4>
                      <p className="text-gray-600">Add staff members and set their salaries. Our transparent multipliers automatically calculate total costs including benefits.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lime-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Choose Workspace</h4>
                      <p className="text-gray-600">Select from Work From Home, Hybrid, or Full Office options. Each has different setup costs and monthly fees.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lime-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Get Instant Pricing</h4>
                      <p className="text-gray-600">See real-time calculations with detailed breakdowns. Compare 6-month vs monthly payment plans.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-lime-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-lime-50 rounded-lg">
                    <Users className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700 font-medium">Staff Management</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-lime-50 rounded-lg">
                    <Building className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700 font-medium">Workspace Options</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-lime-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700 font-medium">Benefits Calculation</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-lime-50 rounded-lg">
                    <Clock className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700 font-medium">Contract Flexibility</span>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-lime-600 to-lime-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-lime-100 mb-6">
                  Use our interactive calculator to see exactly how much your offshore team will cost. No hidden fees, transparent pricing.
                </p>
                <button 
                  onClick={() => setIsCalculatorOpen(true)}
                  className="bg-white text-lime-600 px-6 py-3 rounded-xl font-semibold hover:bg-lime-50 transition-colors flex items-center space-x-2"
                >
                  <span>Open Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Side - Calculator Preview */}
            <div className="space-y-6">
              {/* Calculator Preview Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-lime-200 overflow-hidden">
                <div className="bg-lime-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calculator className="w-6 h-6" />
                      <h3 className="text-xl font-semibold">Pricing Calculator</h3>
                    </div>
                    <button 
                      onClick={() => setIsCalculatorOpen(true)}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Open Full Calculator
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Quick Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-lime-600" />
                        <span className="text-gray-700">1 Staff Member</span>
                      </div>
                      <span className="text-gray-900 font-medium">$735/month</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-lime-600" />
                        <span className="text-gray-700">Work From Home</span>
                      </div>
                      <span className="text-gray-900 font-medium">$144/month</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-lime-600" />
                        <span className="text-gray-700">6-Month Contract</span>
                      </div>
                      <span className="text-gray-900 font-medium">$175/month</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total (First 6 Months)</span>
                        <span className="text-2xl font-bold text-lime-600">$1,054/month</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">After 6 Months</span>
                        <span className="text-lg font-semibold text-blue-600">$879/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-lime-200 text-center">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-lime-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">4.9/5 Rating</h4>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-lime-200 text-center">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-lime-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">500+ Teams</h4>
                  <p className="text-sm text-gray-600">Successfully Onboarded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Modal */}
      <PricingCalculatorModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
}
