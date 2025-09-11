'use client';

import { useState, useEffect } from 'react';
import { X, Users, Building, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, Calculator } from 'lucide-react';
import { useCurrency } from '@/lib/currencyContext';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Checkbox } from './checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Progress } from './progress';

interface RoleDetail {
  id: string;
  title: string;
  description?: string;
  level: 'entry' | 'mid' | 'senior';
  count: number;
  workspace?: 'wfh' | 'hybrid' | 'office';
}

interface QuoteData {
  totalMembers: number;
  roles: RoleDetail[];
  workplace: 'wfh' | 'hybrid' | 'office';
  industry: string;
  sameRoles: boolean;
  totalMonthlyCost: number;
  totalWorkspaceCost: number;
  totalStaffCost: number;
  breakdown: Array<{
    role: string;
    level: string;
    count: number;
    baseSalary: number;
    multiplier: number;
    monthlyCost: number;
    workspaceCost: number;
    totalCost: number;
  }>;
}

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingCalculatorModal({ isOpen, onClose }: PricingCalculatorModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Step 1: Member count
  const [memberCount, setMemberCount] = useState<number | null>(null);
  
  // Step 2: Industry and roles
  const [industry, setIndustry] = useState('');
  const [sameRoles, setSameRoles] = useState(false);
  const [roles, setRoles] = useState<RoleDetail[]>([
    { id: '1', title: '', level: 'entry', count: 1 }
  ]);
  
  // Step 3: Workplace setup
  const [workplace, setWorkplace] = useState<'wfh' | 'hybrid' | 'office'>('wfh');
  
  // Step 5: Quote data
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  // Currency context integration
  const { 
    selectedCurrency, 
    convertPrice, 
    formatPrice 
  } = useCurrency();

  // Get multiplier based on level
  const getMultiplier = (level: 'entry' | 'mid' | 'senior') => {
    switch (level) {
      case 'entry': return 1.7;
      case 'mid': return 1.5;
      case 'senior': return 1.4;
      default: return 1.7;
    }
  };

  // Get base salary range for level
  const getBaseSalary = (level: 'entry' | 'mid' | 'senior') => {
    switch (level) {
      case 'entry': return 30000; // ₱20,000 - ₱39,999 average
      case 'mid': return 70000;   // ₱40,000 - ₱99,999 average
      case 'senior': return 120000; // ₱100,000+ average
      default: return 30000;
    }
  };

  // Get workspace cost per person in USD converted to PHP
  const getWorkspaceCostPerPerson = (workspace: 'wfh' | 'hybrid' | 'office') => {
    const usdToPhp = 56; // Approximate conversion rate
    switch (workspace) {
      case 'wfh': return 150 * usdToPhp; // $150 USD
      case 'hybrid': return 220 * usdToPhp; // $220 USD
      case 'office': return 290 * usdToPhp; // $290 USD
      default: return 150 * usdToPhp;
    }
  };

  // AI Processing simulation
  const processQuote = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate quote
    let totalStaffCost = 0;
    let totalWorkspaceCost = 0;
    const breakdown = roles.map(role => {
      const baseSalary = getBaseSalary(role.level);
      const multiplier = getMultiplier(role.level);
      const monthlyCost = baseSalary * multiplier * role.count;
      const roleWorkspace = role.workspace || workplace;
      const workspaceCost = getWorkspaceCostPerPerson(roleWorkspace) * role.count;
      const totalCost = monthlyCost + workspaceCost;
      
      totalStaffCost += monthlyCost;
      totalWorkspaceCost += workspaceCost;
      
      return {
        role: role.title,
        level: role.level,
        count: role.count,
        baseSalary,
        multiplier,
        monthlyCost,
        workspaceCost,
        totalCost
      };
    });
    
    const totalMonthlyCost = totalStaffCost + totalWorkspaceCost;
    
    setQuoteData({
      totalMembers: memberCount || 0,
      roles,
      workplace,
      industry,
      sameRoles,
      totalMonthlyCost,
      totalWorkspaceCost,
      totalStaffCost,
      breakdown
    });
    
    setIsProcessing(false);
    setCurrentStep(4);
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form only when explicitly starting over or when modal is first opened
  const resetForm = () => {
    setCurrentStep(1);
    setMemberCount(null);
    setIndustry('');
    setSameRoles(false);
    setRoles([{ id: '1', title: '', level: 'entry', count: 1, workspace: 'wfh' }]);
    setWorkplace('wfh');
    setQuoteData(null);
  };

  // Only reset form when modal is first opened (not when reopening)
  useEffect(() => {
    if (isOpen && currentStep === 1 && !memberCount && !industry) {
      // Only reset if form is completely empty (first time opening)
      resetForm();
    }
  }, [isOpen]);

  // Helper functions
  const addRole = () => {
    const newId = (roles.length + 1).toString();
    setRoles([...roles, { id: newId, title: '', level: 'entry', count: 1, workspace: 'wfh' }]);
  };

  const removeRole = (id: string) => {
    if (roles.length > 1) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const updateRole = (id: string, field: keyof RoleDetail, value: string | number) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, [field]: value } : role
    ));
  };

  const formatPriceDisplay = (phpAmount: number) => {
    if (selectedCurrency.code === 'PHP') {
      return `₱${phpAmount.toLocaleString()}`;
    }
    const converted = convertPrice(phpAmount);
    return `${formatPrice(converted)} (₱${phpAmount.toLocaleString()})`;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return memberCount !== null;
      case 2: return industry.trim() !== '' && roles.every(role => role.title.trim() !== '');
      case 3: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 3) {
      processQuote();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-lime-200 bg-lime-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quick Pricing Quote</h2>
              <p className="text-sm text-gray-600">Get your personalized team pricing in 5 steps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-lime-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 bg-lime-50 border-b border-lime-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-lime-800">Step {currentStep} of 5</span>
            <span className="text-sm text-lime-600">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 5) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">How many team members do you need?</h3>
                <p className="text-gray-600">Enter the number of employees for your team</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Input Field */}
                <div className="text-center">
                  <Label htmlFor="memberCount" className="text-base font-medium mb-3 block">Number of Team Members</Label>
                  <Input
                    id="memberCount"
                    type="number"
                    min="1"
                    max="100"
                    value={memberCount || ''}
                    onChange={(e) => setMemberCount(parseInt(e.target.value) || null)}
                    placeholder="Enter number of team members"
                    className="text-center text-lg font-semibold h-12 max-w-xs mx-auto"
                  />
                </div>
                
                {/* Quick Response Buttons */}
                <div>
                  <p className="text-center text-sm text-gray-600 mb-4">Or choose from common team sizes:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 3, 5, 10, 15, 25].map((count) => (
                      <Button
                        key={count}
                        variant={memberCount === count ? "default" : "outline"}
                        onClick={() => setMemberCount(count)}
                        className={`h-12 text-base font-semibold ${
                          memberCount === count 
                            ? 'bg-lime-600 hover:bg-lime-700 text-white' 
                            : 'border-lime-300 text-lime-700 hover:bg-lime-50'
                        }`}
                      >
                        {count} {count === 1 ? 'Member' : 'Members'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell us about the roles</h3>
                <p className="text-gray-600">What industry is your business in and what roles do you need?</p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <Label htmlFor="industry" className="text-base font-medium">What industry is your business in?</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Real Estate, E-commerce, Healthcare..."
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameRoles"
                    checked={sameRoles}
                    onCheckedChange={(checked) => setSameRoles(checked as boolean)}
                  />
                  <Label htmlFor="sameRoles" className="text-sm">All {memberCount || 0} roles are the same</Label>
                </div>

                {!sameRoles && (
                  <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                    <p className="text-lime-800 text-sm">
                      Great! We'll collect details for each of your {memberCount || 0} unique roles.
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Label className="text-lg font-semibold">Role Details</Label>
                      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs">✏️</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {roles.map((role, index) => (
                      <Card key={role.id} className="p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div>
                            <span></span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {sameRoles ? "All Roles" : `Role ${index + 1}`}
                          </h4>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`title-${role.id}`} className="text-sm font-medium text-gray-700">Role Title</Label>
                            <Input
                              id={`title-${role.id}`}
                              value={role.title}
                              onChange={(e) => updateRole(role.id, 'title', e.target.value)}
                              placeholder="e.g., Virtual Assistant, Marketing Specialist, Customer Support"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`description-${role.id}`} className="text-sm font-medium text-gray-700">Role Description</Label>
                            <textarea
                              id={`description-${role.id}`}
                              value={role.description || ''}
                              onChange={(e) => updateRole(role.id, 'description', e.target.value)}
                              placeholder="Describe the key responsibilities and requirements for this role..."
                              rows={3}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                            />
                          </div>


                          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <span className="text-yellow-500">💡</span>
                            <span>Type a role title and I'll suggest detailed responsibilities! This helps our AI provide accurate pricing.</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {roles.length < (memberCount || 1) && !sameRoles && (
                    <div className="mt-6">
                      <button
                        onClick={addRole}
                        className="w-full border-2 border-dashed border-lime-300 rounded-lg p-6 text-center hover:border-lime-400 hover:bg-lime-50 transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2 text-lime-600">
                          <span className="text-lg">+</span>
                          <span className="font-medium">Add Role {roles.length + 1} of {memberCount || 1}</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Setup</h3>
                <p className="text-gray-600">Select the workspace arrangement that works best for your team.</p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Individual Setup Options */}
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-blue-800">Individual Setup Options</h4>
                        <p className="text-sm text-blue-600">Choose the setup for each role individually</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Role-specific workspace arrangements */}
                {roles.map((role, index) => (
                  <Card key={role.id} className="p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{role.title || `Role ${index + 1}`}</h4>
                        <p className="text-sm text-gray-600">Select workspace arrangement</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          id: 'wfh', 
                          title: 'Work from Home', 
                          subtitle: 'Remote setup',
                          icon: '🏠'
                        },
                        { 
                          id: 'hybrid', 
                          title: 'Hybrid', 
                          subtitle: 'Flexible option',
                          icon: '🔄'
                        },
                        { 
                          id: 'office', 
                          title: 'Full Office', 
                          subtitle: 'Office-based',
                          icon: '🏢'
                        }
                      ].map((option) => (
                        <Card 
                          key={option.id}
                          className={`cursor-pointer transition-all p-4 ${
                            role.workspace === option.id 
                              ? 'border-lime-500 bg-lime-50' 
                              : 'border-gray-200 hover:border-lime-300'
                          }`}
                          onClick={() => updateRole(role.id, 'workspace', option.id)}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <h5 className="font-semibold text-gray-900 mb-1">{option.title}</h5>
                            <p className="text-sm text-gray-600">{option.subtitle}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-lime-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quote Generated Successfully!</h3>
                <p className="text-gray-600">Your personalized pricing quote is ready to view.</p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-lime-600">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Ready to view your quote</span>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => setCurrentStep(5)}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8"
                >
                  View Quote
                </Button>
              </div>
            </div>
          )}

          {currentStep === 5 && quoteData && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Quote</h3>
                <p className="text-gray-600">Here's what we recommend for your team</p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Quote Summary */}
                <Card className="bg-gradient-to-r from-lime-50 to-lime-100 border-lime-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-lime-600 mb-2">
                        {formatPriceDisplay(quoteData.totalMonthlyCost)}
                      </div>
                      <div className="text-lg text-gray-700">per month</div>
                      <div className="text-sm text-gray-600 mt-2">
                        For {quoteData.totalMembers} team members in {quoteData.industry}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Staff Costs:</span>
                        <span className="font-semibold">{formatPriceDisplay(quoteData.totalStaffCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Workspace Costs:</span>
                        <span className="font-semibold">{formatPriceDisplay(quoteData.totalWorkspaceCost)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg">
                        <span className="font-bold">Total Monthly:</span>
                        <span className="font-bold text-lime-600">{formatPriceDisplay(quoteData.totalMonthlyCost)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Team Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {quoteData.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{item.role}</div>
                            <div className="text-sm text-gray-600">{item.count} × {item.level}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatPriceDisplay(item.totalCost)}</div>
                            <div className="text-sm text-gray-600">per month</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-lime-600 hover:bg-lime-700 text-white px-8"
                  >
                    Book Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={resetForm}
                    className="border-lime-300 text-lime-700 hover:bg-lime-50"
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
            )}
            
            <div className={currentStep === 1 ? "w-full flex justify-end" : "flex-1 flex justify-end"}>
              <Button
                onClick={nextStep}
                disabled={!canProceed() || isProcessing}
                className="flex items-center space-x-2 bg-lime-600 hover:bg-lime-700"
              >
                <span>{currentStep === 3 ? 'Get Quote' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
