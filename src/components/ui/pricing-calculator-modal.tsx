'use client';

import { useState, useEffect } from 'react';
import { X, Calculator, Users, Building, Clock, DollarSign, Home, Zap, Building2, Plus, Minus, RefreshCw } from 'lucide-react';
import { useCurrency, currencies } from '@/lib/currencyContext';

interface StaffMember {
  id: string;
  salary: number;
}

interface Calculations {
  totalStaffCost: number;
  totalWorkspaceCost: number;
  totalSetupCost: number;
  monthlySetupCost: number;
  totalMonthly: number;
  totalUpfront: number;
  totalAfter6Months: number;
  officeSize: number;
  securityDeposit: number;
  breakdown: Array<{
    id: string;
    salary: number;
    multiplier: number;
    baseCost: number;
    benefits: number;
    totalCost: number;
  }>;
}

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingCalculatorModal({ isOpen, onClose }: PricingCalculatorModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([{ id: '1', salary: 25000 }]);
  const [workspaceType, setWorkspaceType] = useState<'wfh' | 'hybrid' | 'office' | 'private'>('wfh');
  const [contractType, setContractType] = useState<'6month' | 'monthly' | 'private'>('6month');
  const [calculations, setCalculations] = useState<Calculations>({
    totalStaffCost: 0,
    totalWorkspaceCost: 0,
    totalSetupCost: 0,
    monthlySetupCost: 0,
    totalMonthly: 0,
    totalUpfront: 0,
    totalAfter6Months: 0,
    officeSize: 0,
    securityDeposit: 0,
    breakdown: []
  });

  // Currency context integration with Open Exchange Rates API
  // This provides real-time exchange rates for USD, AUD, CAD, GBP, NZD, EUR, and PHP
  const { 
    selectedCurrency, 
    setSelectedCurrency, 
    convertPrice, 
    formatPrice, 
    isLoadingRates, 
    lastUpdated, 
    refreshRates, 
    currencies,
    setHasUserSelectedCurrency 
  } = useCurrency();

  // Calculate benefits based on salary
  const calculateBenefits = (salary: number) => {
    const sssEmployer = Math.min(Math.max(salary, 5000), 35000) * 0.10;
    const philHealthEmployer = Math.min(Math.max(salary, 10000), 100000) * 0.025;
    const pagIBIGEmployer = Math.min(salary, 10000) * 0.02;
    const hmo = 2925;
    return sssEmployer + philHealthEmployer + pagIBIGEmployer + hmo;
  };

  // Get multiplier based on salary
  const getMultiplier = (salary: number) => {
    if (salary >= 20000 && salary <= 39999) return 1.43;
    if (salary >= 40000 && salary <= 99999) return 1.33;
    if (salary >= 100000) return 1.25;
    return 1.43; // Default to entry level
  };

  // Get workspace cost per person
  const getWorkspaceCostPerPerson = () => {
    const costs = {
      wfh: 8000,
      hybrid: 12000,
      office: 16000,
      private: 0 // Covered by office lease
    };
    return costs[workspaceType];
  };

  // Get setup fee per person
  const getSetupFeePerPerson = () => {
    const fees = {
      wfh: 60000,
      hybrid: 45000,
      office: 30000,
      private: 30000
    };
    return fees[workspaceType];
  };

  // Calculate all costs
  useEffect(() => {
    const staffCount = staff.length;
    const isPrivateOffice = staffCount >= 10 && workspaceType === 'private';
    
    // Calculate staff costs and breakdown
    let totalStaffCost = 0;
    const breakdown = staff.map(member => {
      const multiplier = getMultiplier(member.salary);
      const baseCost = member.salary * multiplier;
      const benefits = calculateBenefits(member.salary);
      const totalCost = baseCost + benefits;
      totalStaffCost += totalCost;
      
      return {
        id: member.id,
        salary: member.salary,
        multiplier,
        baseCost,
        benefits,
        totalCost
      };
    });

    // Calculate workspace costs
    let totalWorkspaceCost = 0;
    let officeSize = 0;
    
    if (isPrivateOffice) {
      officeSize = Math.ceil(staffCount / 4) * 10; // Round up to nearest 10sqm
      totalWorkspaceCost = officeSize * 2090; // Office lease
    } else {
      totalWorkspaceCost = getWorkspaceCostPerPerson() * staffCount;
    }

    // Calculate setup costs
    const setupFeePerPerson = getSetupFeePerPerson();
    const totalSetupCost = setupFeePerPerson * staffCount;
    
    let monthlySetupCost = 0;
    let totalUpfront = 0;
    let securityDeposit = 0;

    if (contractType === '6month') {
      monthlySetupCost = totalSetupCost / 6;
    } else if (contractType === 'monthly') {
      totalUpfront = totalSetupCost + totalStaffCost; // Setup + 1 month security
    } else if (contractType === 'private') {
      totalUpfront = totalSetupCost;
      securityDeposit = totalWorkspaceCost * 3; // 3 months office lease
      totalUpfront += securityDeposit;
    }

    // Calculate totals
    const totalMonthly = totalStaffCost + totalWorkspaceCost + monthlySetupCost;
    const totalAfter6Months = totalStaffCost + totalWorkspaceCost;

    setCalculations({
      totalStaffCost,
      totalWorkspaceCost,
      totalSetupCost,
      monthlySetupCost,
      totalMonthly,
      totalUpfront,
      totalAfter6Months,
      officeSize,
      securityDeposit,
      breakdown
    });
  }, [staff, workspaceType, contractType]);

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

  // Currency display helpers
  const formatPriceWithPHP = (phpAmount: number) => {
    // If PHP is selected, show PHP amount directly
    if (selectedCurrency.code === 'PHP') {
      return `₱${phpAmount.toLocaleString()}`;
    }
    
    // Convert PHP amount to selected currency
    const converted = convertPrice(phpAmount);
    
    console.log(`Converting ${phpAmount} PHP to ${selectedCurrency.code}:`, {
      phpAmount,
      selectedCurrency: selectedCurrency.code,
      selectedExchangeRate: selectedCurrency.exchangeRate,
      finalAmount: converted
    });
    
    return `${formatPrice(converted)} (₱${phpAmount.toLocaleString()})`;
  };

  const formatPriceOnly = (phpAmount: number) => {
    // If PHP is selected, show PHP amount directly
    if (selectedCurrency.code === 'PHP') {
      return `₱${phpAmount.toLocaleString()}`;
    }
    
    // Convert PHP amount to selected currency
    const converted = convertPrice(phpAmount);
    
    return formatPrice(converted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-lime-50 rounded-2xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lime-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Shore Agents Pricing Calculator
              </h2>
                             <div className="flex items-center space-x-2 mt-1">
                 <span className="text-sm text-gray-600">Prices shown in:</span>
                 <div className="flex flex-wrap gap-1">
                   {currencies.map((currency) => (
                     <button
                       key={currency.code}
                       onClick={() => {
                         setSelectedCurrency(currency);
                         setHasUserSelectedCurrency(true);
                       }}
                       className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                         selectedCurrency.code === currency.code
                           ? 'bg-lime-600 text-white'
                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                       }`}
                     >
                       {currency.code}
                     </button>
                   ))}
                 </div>
                 <div className="flex items-center space-x-2 ml-2">
                   <button
                     onClick={refreshRates}
                     disabled={isLoadingRates}
                     className={`p-1 rounded text-xs transition-colors ${
                       isLoadingRates 
                         ? 'text-gray-400 cursor-not-allowed' 
                         : 'text-lime-600 hover:text-lime-700 hover:bg-lime-50'
                     }`}
                     title="Refresh exchange rates"
                   >
                     <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
                   </button>
                   {isLoadingRates && (
                     <span className="text-xs text-lime-600 animate-pulse">
                       Updating rates...
                     </span>
                   )}
                   {lastUpdated && !isLoadingRates && (
                     <span className="text-xs text-gray-500">
                       Updated: {lastUpdated}
                     </span>
                   )}
                 </div>
               </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-100px)]">
          {/* Left Section - Your Requirements */}
          <div className="flex-1 p-6 bg-white border-r border-lime-200 overflow-y-auto">
            <div className="space-y-8">
              {/* Staff Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-lime-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Staff ({staff.length} person{staff.length !== 1 ? 's' : ''})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const newId = Math.max(...staff.map(s => parseInt(s.id))) + 1;
                      setStaff([...staff, { id: newId.toString(), salary: 25000 }]);
                    }}
                    className="bg-lime-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-lime-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Person</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {staff.map((member, index) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Person {index + 1}:
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={member.salary}
                            onChange={(e) => {
                              setStaff(staff.map(s => s.id === member.id ? { ...s, salary: parseInt(e.target.value) || 0 } : s));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            placeholder="25000"
                          />
                          <span className="text-sm font-medium text-lime-600">
                            {getMultiplier(member.salary)}x
                          </span>
                        </div>
                      </div>
                      {staff.length > 1 && (
                        <button
                          onClick={() => {
                            if (staff.length > 1) {
                              setStaff(staff.filter(s => s.id !== member.id));
                            }
                          }}
                          className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workspace Type Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Building className="w-5 h-5 text-lime-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Workspace Type</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'wfh', label: 'Work From Home', price: 8000, icon: Home },
                    { id: 'hybrid', label: 'Hybrid Desk', price: 12000, icon: Zap },
                    { id: 'office', label: 'Full Office Seat', price: 16000, icon: Building2 }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          workspaceType === option.id
                            ? 'border-lime-500 bg-lime-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="workspace"
                          value={option.id}
                          checked={workspaceType === option.id}
                          onChange={(e) => setWorkspaceType(e.target.value as "wfh" | "hybrid" | "office" | "private")}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          workspaceType === option.id
                            ? 'border-lime-500 bg-lime-500'
                            : 'border-gray-300'
                        }`}>
                          {workspaceType === option.id && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-lime-600" />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">
                              {formatPriceWithPHP(option.price)}/month per person
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Contract Type Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-lime-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Contract Type</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: '6month', label: '6-Month Contract', description: 'Setup fee spread over 6 months (90% choose this)' },
                    { id: 'monthly', label: 'Month-to-Month', description: 'Pay setup fee upfront + security deposit' }
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        contractType === option.id
                          ? 'border-lime-500 bg-lime-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contract"
                        value={option.id}
                        checked={contractType === option.id}
                        onChange={(e) => setContractType(e.target.value as "6month" | "monthly")}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        contractType === option.id
                          ? 'border-lime-500 bg-lime-500'
                          : 'border-gray-300'
                      }`}>
                        {contractType === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Your Investment Breakdown */}
          <div className="flex-1 p-6 bg-lime-50 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-lime-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Investment Breakdown</h3>
              </div>

              {/* Staff Costs */}
              <div className="bg-white rounded-lg p-4 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-3">Staff Costs</h4>
                <div className="space-y-2">
                  {calculations.breakdown.map((member, index) => (
                    <div key={member.id} className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Person {index + 1} ({formatPriceOnly(member.salary)} × {member.multiplier})
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPriceOnly(member.totalCost)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-semibold text-lime-600">Total Staff Cost</span>
                    <span className="font-semibold text-lime-600">
                      {formatPriceOnly(calculations.totalStaffCost)}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Workspace Cost */}
              <div className="bg-white rounded-lg p-4 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-3">Workspace Cost</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {workspaceType === 'wfh' ? 'Work From Home' : workspaceType === 'hybrid' ? 'Hybrid Desk' : 'Full Office Seat'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPriceOnly(getWorkspaceCostPerPerson())}/month
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {formatPriceOnly(getWorkspaceCostPerPerson())} × {staff.length} person{staff.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Setup Costs */}
              <div className="bg-white rounded-lg p-4 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-3">Setup Costs</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Setup Fee</span>
                    <span className="font-medium text-gray-900">
                      {formatPriceOnly(calculations.totalSetupCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {formatPriceOnly(getSetupFeePerPerson())} × {staff.length} person{staff.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {contractType === '6month' && (
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Spread over 6 months =</span>
                      <span>{formatPriceOnly(calculations.monthlySetupCost)}/month</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Costs Summary */}
              <div className="space-y-4">
                <div className="bg-lime-100 rounded-lg p-4 border border-lime-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">First 6 Months</span>
                    <span className="text-2xl font-bold text-lime-600">
                      {formatPriceOnly(calculations.totalMonthly)}/month
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-lg p-4 border border-blue-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">After 6 Months</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPriceOnly(calculations.totalAfter6Months)}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-lime-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-lime-700 transition-colors flex items-center justify-center space-x-2 shadow-lg">
                <DollarSign className="w-5 h-5" />
                <span>Book Consultation with This Setup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
