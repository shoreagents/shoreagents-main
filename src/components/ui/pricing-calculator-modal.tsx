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

  // Currency context integration
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
    return 1.43;
  };

  // Get workspace cost per person
  const getWorkspaceCostPerPerson = () => {
    const costs = {
      wfh: 8000,
      hybrid: 12000,
      office: 16000,
      private: 0
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

    let totalWorkspaceCost = 0;
    let officeSize = 0;
    
    if (isPrivateOffice) {
      officeSize = Math.ceil(staffCount / 4) * 10;
      totalWorkspaceCost = officeSize * 2090;
    } else {
      totalWorkspaceCost = getWorkspaceCostPerPerson() * staffCount;
    }

    const setupFeePerPerson = getSetupFeePerPerson();
    const totalSetupCost = setupFeePerPerson * staffCount;
    
    let monthlySetupCost = 0;
    let totalUpfront = 0;
    let securityDeposit = 0;

    if (contractType === '6month') {
      monthlySetupCost = totalSetupCost / 6;
    } else if (contractType === 'monthly') {
      totalUpfront = totalSetupCost + totalStaffCost;
    } else if (contractType === 'private') {
      totalUpfront = totalSetupCost;
      securityDeposit = totalWorkspaceCost * 3;
      totalUpfront += securityDeposit;
    }

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
    if (selectedCurrency.code === 'PHP') {
      return `₱${phpAmount.toLocaleString()}`;
    }
    const converted = convertPrice(phpAmount);
    return `${formatPrice(converted)} (₱${phpAmount.toLocaleString()})`;
  };

  const formatPriceOnly = (phpAmount: number) => {
    if (selectedCurrency.code === 'PHP') {
      return `₱${phpAmount.toLocaleString()}`;
    }
    const converted = convertPrice(phpAmount);
    return formatPrice(converted);
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
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pricing Calculator
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-600">Currency:</span>
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
                          : 'bg-white text-gray-600 hover:bg-lime-100 border border-lime-200'
                      }`}
                    >
                      {currency.code}
                    </button>
                  ))}
                </div>
                <button
                  onClick={refreshRates}
                  disabled={isLoadingRates}
                  className={`p-1 rounded text-xs transition-colors ${
                    isLoadingRates 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-lime-600 hover:text-lime-700 hover:bg-lime-100'
                  }`}
                  title="Refresh rates"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-lime-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)] overflow-hidden">
          {/* Left Section - Configuration */}
          <div className="flex-1 p-4 bg-white overflow-y-auto">
            <div className="space-y-6">
              {/* Staff Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Staff ({staff.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const newId = Math.max(...staff.map(s => parseInt(s.id))) + 1;
                      setStaff([...staff, { id: newId.toString(), salary: 25000 }]);
                    }}
                    className="bg-lime-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-lime-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm"
                            placeholder="25000"
                          />
                          <span className="text-sm font-medium text-lime-600 bg-lime-50 px-2 py-1 rounded">
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
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="w-4 h-4 text-lime-600" />
                  <h3 className="text-base font-semibold text-gray-900">Workspace</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'wfh', label: 'Work From Home', price: 8000, icon: Home },
                    { id: 'hybrid', label: 'Hybrid Desk', price: 12000, icon: Zap },
                    { id: 'office', label: 'Office Seat', price: 16000, icon: Building2 }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all text-sm ${
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
                        <div className={`w-3 h-3 rounded-full border-2 mr-2 ${
                          workspaceType === option.id
                            ? 'border-lime-500 bg-lime-500'
                            : 'border-gray-300'
                        }`}>
                          {workspaceType === option.id && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-lime-600" />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-600">
                              {formatPriceWithPHP(option.price)}/month
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
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-lime-600" />
                  <h3 className="text-base font-semibold text-gray-900">Contract</h3>
                </div>
                
                <div className="space-y-2">
                  {[
                    { id: '6month', label: '6-Month Contract', description: 'Setup fee spread over 6 months' },
                    { id: 'monthly', label: 'Month-to-Month', description: 'Pay setup fee upfront' }
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
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
                      <div className={`w-3 h-3 rounded-full border-2 mr-3 ${
                        contractType === option.id
                          ? 'border-lime-500 bg-lime-500'
                          : 'border-gray-300'
                      }`}>
                        {contractType === option.id && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Results */}
          <div className="flex-1 p-4 bg-lime-50 overflow-y-auto border-l border-lime-200">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-lime-600" />
                <h3 className="text-base font-semibold text-gray-900">Investment Breakdown</h3>
              </div>

              {/* Staff Costs */}
              <div className="bg-white rounded-lg p-3 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Staff Costs</h4>
                <div className="space-y-1">
                  {calculations.breakdown.map((member, index) => (
                    <div key={member.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        Person {index + 1} ({formatPriceOnly(member.salary)} × {member.multiplier})
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPriceOnly(member.totalCost)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-semibold text-lime-600 text-sm">Total Staff Cost</span>
                    <span className="font-semibold text-lime-600 text-sm">
                      {formatPriceOnly(calculations.totalStaffCost)}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Workspace Cost */}
              <div className="bg-white rounded-lg p-3 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Workspace</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {workspaceType === 'wfh' ? 'Work From Home' : workspaceType === 'hybrid' ? 'Hybrid Desk' : 'Office Seat'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPriceOnly(getWorkspaceCostPerPerson())}/month
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>
                      {formatPriceOnly(getWorkspaceCostPerPerson())} × {staff.length} person{staff.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Setup Costs */}
              <div className="bg-white rounded-lg p-3 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Setup</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Total Setup Fee</span>
                    <span className="font-medium text-gray-900">
                      {formatPriceOnly(calculations.totalSetupCost)}
                    </span>
                  </div>
                  {contractType === '6month' && (
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Spread over 6 months =</span>
                      <span>{formatPriceOnly(calculations.monthlySetupCost)}/month</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Costs Summary */}
              <div className="space-y-3">
                <div className="bg-lime-100 rounded-lg p-3 border border-lime-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm">First 6 Months</span>
                    <span className="text-lg font-bold text-lime-600">
                      {formatPriceOnly(calculations.totalMonthly)}/month
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm">After 6 Months</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPriceOnly(calculations.totalAfter6Months)}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-lime-600 text-white py-3 px-4 rounded-lg font-semibold text-base hover:bg-lime-700 transition-colors flex items-center justify-center space-x-2 shadow-lg">
                <DollarSign className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
