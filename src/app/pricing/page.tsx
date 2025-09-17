"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { PricingCalculatorModal } from "@/components/ui/pricing-calculator-modal";
import { Calculator, Users, Building, Clock, DollarSign, ArrowRight, Star, CheckCircle, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import { useCurrency } from "@/lib/currencyContext";
// import { useEngagementTracking } from "@/lib/useEngagementTracking"; // Removed - using GlobalEngagementTracker
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PricingPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { convertPrice, formatPrice } = useCurrency();
  // const { recordInteraction } = useEngagementTracking(); // Removed - using GlobalEngagementTracker

  // Realistic sample quote data
  const sampleQuote = {
    totalMembers: 2,
    industry: "E-commerce",
    roles: [
      { title: "Customer Service Representative", level: "entry", count: 1 },
      { title: "Social Media Manager", level: "mid", count: 1 }
    ],
    totalMonthlyCost: 156800, // PHP - more realistic for 2 people
    workspace: "wfh"
  };

  // Format preview prices
  const formatPreviewPrice = (phpAmount: number) => {
    const converted = convertPrice(phpAmount / 55.5);
    return formatPrice(converted);
  };

  return (
    <div className="bg-lime-50">
      <SideNav />
      
      {/* Hero Section - Clean Shadcn Design */}
      <section className="min-h-screen py-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <Badge variant="secondary" className="bg-lime-100 text-lime-800 border-lime-300">
                <Zap className="w-4 h-4 mr-2" />
                AI-POWERED QUOTES
              </Badge>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                  Get Your Team{" "}
                  <span className="bg-gradient-to-r from-lime-600 to-lime-400 bg-clip-text text-transparent">
                    Pricing Quote
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  AI-powered role suggestions, industry-specific pricing, and transparent calculations. 
                  Get accurate quotes in 5 simple steps.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lime-600" />
                  </div>
                  <span className="text-gray-700">AI suggests roles based on your industry</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lime-600" />
                  </div>
                  <span className="text-gray-700">Industry-specific salary calculations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lime-600" />
                  </div>
                  <span className="text-gray-700">No hidden fees, transparent pricing</span>
                </div>
              </div>

              <Button 
                size="lg"
                onClick={() => {
                  setIsCalculatorOpen(true);
                }}
                className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 text-lg"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get Quick Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Right Side - Realistic Quote Preview */}
            <div className="space-y-6">
              <Card className="shadow-lg border-lime-200">
                <CardHeader className="bg-gradient-to-r from-lime-600 to-lime-500 text-white">
                  <CardTitle className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Sample Quote</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-lime-600 mb-2">
                      {formatPreviewPrice(sampleQuote.totalMonthlyCost)}
                    </div>
                    <div className="text-gray-600">per month</div>
                    <div className="text-sm text-gray-500 mt-2">
                      {sampleQuote.totalMembers} team members • {sampleQuote.industry}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Team Details</h4>
                    {sampleQuote.roles.map((role, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{role.title}</div>
                          <div className="text-sm text-gray-600">{role.level} level</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatPreviewPrice(sampleQuote.totalMonthlyCost / sampleQuote.totalMembers)}
                          </div>
                          <div className="text-sm text-gray-600">per month</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <Button 
                    variant="outline" 
                    className="w-full border-lime-300 text-lime-700 hover:bg-lime-50"
                    onClick={() => {
                      setIsCalculatorOpen(true);
                    }}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Get Your Quote
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-lime-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-lime-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">4.9/5</h4>
                    <p className="text-sm text-gray-600">Client Rating</p>
                  </CardContent>
                </Card>
                <Card className="border-lime-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-lime-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">500+</h4>
                    <p className="text-sm text-gray-600">Teams Served</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Pricing Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent, modular pricing that adapts to your specific needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* How It Works */}
            <Card className="border-lime-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-lime-600" />
                  </div>
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Configure Your Team</h4>
                    <p className="text-gray-600">
                      AI suggests roles based on your industry. Set experience levels and team size.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Workspace</h4>
                    <p className="text-gray-600">
                      Select from Work From Home, Hybrid, or Full Office options.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Instant Pricing</h4>
                    <p className="text-gray-600">
                      See real-time calculations with industry-specific salary rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-lime-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-lime-600" />
                  </div>
                  <span>What's Included</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Staff Management</h4>
                    <p className="text-sm text-gray-600">Complete HR and payroll services</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Building className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Workspace Options</h4>
                    <p className="text-sm text-gray-600">Flexible office and remote solutions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Benefits Calculation</h4>
                    <p className="text-sm text-gray-600">Government-mandated benefits included</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Contract Flexibility</h4>
                    <p className="text-sm text-gray-600">Monthly or long-term commitments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className="py-16 bg-lime-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Advantages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why choose Shore Agents for your team expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600">
                  Smart role suggestions and industry-specific pricing calculations
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent</h3>
                <p className="text-gray-600">
                  No hidden fees, clear pricing structure with industry-specific rates
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scalable</h3>
                <p className="text-gray-600">
                  Start small and scale up with flexible workspace and team options
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Setup</h3>
                <p className="text-gray-600">
                  Get your team up and running in 2-3 weeks with our streamlined process
                </p>
              </CardContent>
            </Card>
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

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-lime-50 to-lime-100 border-lime-200">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get your personalized team pricing quote in just 5 steps. 
                AI-powered suggestions, industry-specific rates, and transparent calculations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => {
                    setIsCalculatorOpen(true);
                  }}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 text-lg"
                >
                  Get Quick Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-lime-600 text-lime-600 hover:bg-lime-50 px-8 py-4 text-lg"
                >
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
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
