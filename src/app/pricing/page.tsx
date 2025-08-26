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
    <div className="bg-lime-50">
      <SideNav />
      
      {/* Main Section - Full View Height */}
      <section className="min-h-screen py-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Main Split Layout - Header Content Left, Calculator Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center cursor-pointer"
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

              {/* Quick Stats - Horizontal Layout */}
              <div className="flex space-x-4">
                <div className="flex-1 flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg border border-lime-200">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">4.9/5 Rating</h4>
                    <p className="text-sm text-gray-600">Client Satisfaction</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg border border-lime-200">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">500+ Teams</h4>
                    <p className="text-sm text-gray-600">Successfully Onboarded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Visible After Scrolling */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Pricing Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent, modular pricing that adapts to your specific needs. No hidden fees, no surprises.
            </p>
          </div>

          {/* Two Column Layout with Professional Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* How It Works */}
            <div className="relative">
              <div className="lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-px lg:bg-gradient-to-b lg:from-transparent lg:via-lime-300 lg:to-transparent"></div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mr-4">
                  <Calculator className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">How It Works</h3>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Configure Your Team</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Add staff members and set their salaries. Our transparent multipliers automatically calculate total costs including benefits, ensuring you know exactly what you're paying for.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Choose Workspace</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Select from Work From Home, Hybrid, or Full Office options. Each has different setup costs and monthly fees, giving you flexibility to match your business model.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Get Instant Pricing</h4>
                    <p className="text-gray-600 leading-relaxed">
                      See real-time calculations with detailed breakdowns. Compare 6-month vs monthly payment plans to find the option that works best for your budget and timeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="lg:pl-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What's Included</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-lime-50 transition-colors">
                  <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Staff Management</h4>
                    <p className="text-sm text-gray-600">Complete HR and payroll services</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-lime-50 transition-colors">
                  <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Workspace Options</h4>
                    <p className="text-sm text-gray-600">Flexible office and remote solutions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-lime-50 transition-colors">
                  <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Benefits Calculation</h4>
                    <p className="text-sm text-gray-600">Government-mandated benefits included</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-lime-50 transition-colors">
                  <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contract Flexibility</h4>
                    <p className="text-sm text-gray-600">Monthly or long-term commitments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - At the Very Bottom */}
      <section className="py-16 bg-lime-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing Breakdown</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing structure with flexible options to match your business needs
            </p>
          </div>

          {/* Two Column Layout - Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card - Talent Investment */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Talent Investment</h3>
                </div>
                <p className="text-gray-600 text-base">Transparent Multipliers</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Entry Level */}
                <div className="relative">
                  <div className="absolute -left-3 top-0 w-1.5 h-full bg-green-500 rounded-full"></div>
                  <div className="pl-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Entry Level</h4>
                    <p className="text-gray-600 mb-1 text-sm">Salary range: $350 - $700</p>
                    <p className="text-2xl font-bold text-green-600 mb-1">1.43x</p>
                    <p className="text-xs text-gray-500">Example: $438 × 1.43 = $626/month</p>
                  </div>
                </div>

                {/* Mid Level */}
                <div className="relative">
                  <div className="absolute -left-3 top-0 w-1.5 h-full bg-blue-500 rounded-full"></div>
                  <div className="pl-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Mid Level</h4>
                    <p className="text-gray-600 mb-1 text-sm">Salary range: $700 - $1,750</p>
                    <p className="text-2xl font-bold text-blue-600 mb-1">1.33x</p>
                    <p className="text-xs text-gray-500">Example: $875 × 1.33 = $1,164/month</p>
                  </div>
                </div>

                {/* Senior Level */}
                <div className="relative">
                  <div className="absolute -left-3 top-0 w-1.5 h-full bg-orange-500 rounded-full"></div>
                  <div className="pl-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Senior Level</h4>
                    <p className="text-gray-600 mb-1 text-sm">Salary range: $1,750+</p>
                    <p className="text-2xl font-bold text-orange-600 mb-1">1.25x</p>
                    <p className="text-xs text-gray-500">Example: $1,750 × 1.25 = $2,188/month</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Multipliers cover:</span> Recruitment, staff management, workspace infrastructure, profit margin
                  </p>
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Benefits charged separately</span> at exact government cost (~$109/month)
                  </p>
                </div>

                {/* Calculate Button */}
                <button 
                  onClick={() => setIsCalculatorOpen(true)}
                  className="w-full bg-lime-600 text-white px-4 py-3 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center text-base cursor-pointer"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Your Costs
                </button>
              </div>
            </div>

            {/* Right Card - Workspace Options */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Workspace Options</h3>
                </div>
                <p className="text-gray-600 text-base">Mix & Match</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Work From Home */}
                <div className="group hover:bg-gray-50 rounded-lg p-3 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">Work From Home</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$140</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">Full remote infrastructure, monitoring tools, IT support</p>
                  <p className="text-xs text-gray-500">Setup Cost: $1,050 (includes laptop, monitor, UPS)</p>
                </div>

                {/* Hybrid Desk */}
                <div className="group hover:bg-gray-50 rounded-lg p-3 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">Hybrid Desk</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$210</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">A-B scheduling, shared desk, personal locker, flexible</p>
                  <p className="text-xs text-gray-500">Setup Cost: $788 (includes business laptop + hot desk essentials)</p>
                </div>

                {/* Full Office Seat */}
                <div className="group hover:bg-gray-50 rounded-lg p-3 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">Full Office Seat</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$280</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">Dedicated desk 24/7, ergonomic setup, all amenities</p>
                  <p className="text-xs text-gray-500">Setup Cost: $525 (includes desktop workstation + office setup)</p>
                </div>

                {/* Private Office - Special Highlight */}
                <div className="relative bg-gradient-to-r from-lime-50 to-lime-100 border-2 border-lime-200 rounded-lg p-4">
                  <div className="absolute -top-2 -right-2 bg-lime-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">Private Office</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$37</p>
                      <p className="text-xs text-gray-500">per sqm</p>
                    </div>
                  </div>
                  <p className="text-gray-600 font-semibold mb-2 text-sm">YOUR SPACE, YOUR RULES - unlimited employees! (10+ minimum)</p>
                  <p className="text-xs text-gray-500">Terms: 12-month lease, 3-month security deposit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing Examples Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing Examples</h2>
          </div>

          {/* Two Column Layout - Example Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Card - 1 Person, Entry Level, Work From Home */}
            <div className="bg-lime-50 rounded-xl border border-lime-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">1 Person, Entry Level, Work From Home</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Salary ($438 × 1.43):</span>
                    <span className="font-semibold text-gray-900">$626</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Benefits (exact cost):</span>
                    <span className="font-semibold text-gray-900">$109</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Workspace (WFH):</span>
                    <span className="font-semibold text-gray-900">$140</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Setup (first 6 months):</span>
                    <span className="font-semibold text-gray-900">$175</span>
                  </div>
                  
                  <div className="border-t border-lime-200 pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lime-700">First 6 months:</span>
                      <span className="font-bold text-lime-700 text-lg">$1,050/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lime-700">After 6 months:</span>
                      <span className="font-bold text-lime-700 text-lg">$875/month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - 25-Person Workforce, Private Office */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">25-Person Workforce, Private Office</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Staff costs (25 people):</span>
                    <span className="font-semibold text-gray-900">$24,063</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Office lease (100sqm):</span>
                    <span className="font-semibold text-gray-900">$3,658</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Setup costs:</span>
                    <span className="font-semibold text-gray-900">$13,125 upfront</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Security deposit:</span>
                    <span className="font-semibold text-gray-900">$10,973 upfront</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-900 text-lg">Monthly total:</span>
                      <span className="font-bold text-gray-900 text-xl">$27,720/month</span>
                    </div>
                    <p className="text-blue-600 text-sm font-medium">Unlimited staff rotation through office space!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className="py-16 bg-lime-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Advantages</h2>
          </div>

          {/* Four Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 - True Flexibility */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">True Flexibility</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Mix workspace types as needed. Start with WFH, upgrade to office, scale to private space.
              </p>
            </div>

            {/* Card 2 - Transparent Pricing */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Transparent Pricing</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                No hidden fees. Benefits at actual cost. Clear multipliers based on salary level.
              </p>
            </div>

            {/* Card 3 - Quick Deployment */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quick Deployment</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Start in 2-3 weeks. Faster scaling once initial process is established.
              </p>
            </div>

            {/* Card 4 - Complete Package */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Complete Package</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Recruitment, equipment, HR, compliance all included in the pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-lime-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cheap because we're staff leasing, not consulting. We provide staff + workspace + equipment + basic management. You handle training, processes, and client-side management.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center justify-center">
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-sm font-semibold hover:bg-lime-50 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center justify-center">
                See How It Works
              </button>
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
