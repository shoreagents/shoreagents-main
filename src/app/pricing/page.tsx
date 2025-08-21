"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { PricingCalculatorModal } from "@/components/ui/pricing-calculator-modal";
import { Calculator, Users, Building, Clock, DollarSign, ArrowRight, Star, FileText } from "lucide-react";
import { useCurrency } from "@/lib/currencyContext";

export default function PricingPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { selectedCurrency, convertPrice, formatPrice } = useCurrency();

  // Sample calculation for preview (matching the calculator logic)
  const sampleStaffCost = 25000 * 1.43; // Base salary with multiplier
  const sampleBenefits = 2925 + (Math.min(Math.max(25000, 5000), 35000) * 0.10) + 
                        (Math.min(Math.max(25000, 10000), 100000) * 0.025) + 
                        (Math.min(25000, 10000) * 0.02);
  const totalStaffCost = sampleStaffCost + sampleBenefits;
  const workspaceCost = 8000; // Work from home
  const setupCost = 60000 / 6; // Setup fee spread over 6 months
  const totalFirst6Months = totalStaffCost + workspaceCost + setupCost;
  const totalAfter6Months = totalStaffCost + workspaceCost;

  // Format preview prices
  const formatPreviewPrice = (phpAmount: number) => {
    const converted = convertPrice(phpAmount / 55.5);
    return formatPrice(converted);
  };

  return (
    <div className="min-h-screen bg-lime-50">
      <SideNav />
      
      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Top Split Layout - Header Content Left, Calculator Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Left Side - Header Content */}
            <div className="space-y-8">
              {/* Transparent Pricing Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700">
                <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                TRANSPARENT PRICING
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Shore Agents{" "}
                <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">
                  Pricing Calculator
                </span>
              </h1>

              {/* Sub-heading */}
              <h2 className="text-2xl font-semibold text-gray-800">
                Modular Pricing - Mix & Match Your Perfect Setup
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Staff + Workspace + Equipment + Management. No hidden fees, transparent multipliers, benefits at actual cost.
              </p>

              {/* Open Calculator Button */}
              <button 
                onClick={() => setIsCalculatorOpen(true)}
                className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 text-white px-8 py-4 rounded-3xl font-semibold hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center] flex items-center cursor-pointer"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Open Calculator
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Right Side - Calculator Preview */}
            <div className="space-y-6">
              {/* Calculator Preview Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-lime-200 overflow-hidden">
                <div className="bg-lime-600 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <Calculator className="w-6 h-6" />
                    <h3 className="text-xl font-semibold">Pricing Calculator</h3>
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
                      <span className="text-gray-900 font-medium">{formatPreviewPrice(totalStaffCost)}/month</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-lime-600" />
                        <span className="text-gray-700">Work From Home</span>
                      </div>
                      <span className="text-gray-900 font-medium">{formatPreviewPrice(workspaceCost)}/month</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-lime-600" />
                        <span className="text-gray-700">6-Month Contract</span>
                      </div>
                      <span className="text-gray-900 font-medium">{formatPreviewPrice(setupCost)}/month</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total (First 6 Months)</span>
                        <span className="text-2xl font-bold text-lime-600">{formatPreviewPrice(totalFirst6Months)}/month</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">After 6 Months</span>
                        <span className="text-lg font-semibold text-blue-600">{formatPreviewPrice(totalAfter6Months)}/month</span>
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

          {/* Bottom Section - Rearranged Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* How It Works */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-lime-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Calculator className="w-6 h-6 text-lime-600 mr-3" />
                How It Works
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Configure Your Team</h4>
                    <p className="text-gray-600 text-sm">Add staff members and set their salaries. Our transparent multipliers automatically calculate total costs including benefits.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Choose Workspace</h4>
                    <p className="text-gray-600 text-sm">Select from Work From Home, Hybrid, or Full Office options. Each has different setup costs and monthly fees.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Get Instant Pricing</h4>
                    <p className="text-gray-600 text-sm">See real-time calculations with detailed breakdowns. Compare 6-month vs monthly payment plans.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-lime-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <div className="space-y-4">
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

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-lime-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-lime-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.9/5 Rating</h4>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-lime-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">500+ Teams</h4>
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
