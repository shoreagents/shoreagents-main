'use client';

import { useState, useEffect } from 'react';
import { X, Calculator, Users, Building, Clock, DollarSign, Home, Zap, Building2, Plus, Minus, RefreshCw, Eye } from 'lucide-react';
import { useCurrency, currencies } from '@/lib/currencyContext';

interface StaffMember {
  id: string;
  role: 'virtual-assistant' | 'admin-assistant' | 'customer-service' | 'graphic-designer' | 'accountant' | 'project-manager';
  workspace: 'wfh' | 'hybrid' | 'office';
}

interface Calculations {
  totalStaffCost: number;
  totalWorkspaceCost: number;
  totalSetupCost: number;
  monthlySetupCost: number;
  totalMonthly: number;
  totalUpfront: number;
  totalAfter6Months: number;
  breakdown: Array<{
    id: string;
    role: string;
    multiplier: number;
    baseCost: number;
    workspace: string;
    workspaceCost: number;
    setupFee: number;
    totalCost: number;
  }>;
}

interface PricingCalculatorTestingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingCalculatorTesting({ isOpen, onClose }: PricingCalculatorTestingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', role: 'virtual-assistant', workspace: 'wfh' }
  ]);
  const [contractType, setContractType] = useState<'6month' | 'monthly' | 'private'>('6month');
  const [calculations, setCalculations] = useState<Calculations>({
    totalStaffCost: 0,
    totalWorkspaceCost: 0,
    totalSetupCost: 0,
    monthlySetupCost: 0,
    totalMonthly: 0,
    totalUpfront: 0,
    totalAfter6Months: 0,
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

  // Get multiplier based on role
  const getMultiplier = (role: 'virtual-assistant' | 'admin-assistant' | 'customer-service' | 'graphic-designer' | 'accountant' | 'project-manager') => {
    switch (role) {
      case 'virtual-assistant': return 1.7;
      case 'admin-assistant': return 1.5;
      case 'customer-service': return 1.6;
      case 'graphic-designer': return 1.4;
      case 'accountant': return 1.5;
      case 'project-manager': return 1.3;
      default: return 1.7;
    }
  };

  // Get average salary for role
  const getAverageSalary = (role: 'virtual-assistant' | 'admin-assistant' | 'customer-service' | 'graphic-designer' | 'accountant' | 'project-manager') => {
    switch (role) {
      case 'virtual-assistant': return 30000;
      case 'admin-assistant': return 70000;
      case 'customer-service': return 45000;
      case 'graphic-designer': return 85000;
      case 'accountant': return 60000;
      case 'project-manager': return 120000;
      default: return 30000;
    }
  };

  // Get workspace cost per person in PHP
  const getWorkspaceCostPerPerson = (workspace: 'wfh' | 'hybrid' | 'office') => {
    switch (workspace) {
      case 'wfh': return 8000;
      case 'hybrid': return 12000;
      case 'office': return 16000;
      default: return 8000;
    }
  };

  // Get setup fee per person in PHP
  const getSetupFeePerPerson = (workspace: 'wfh' | 'hybrid' | 'office') => {
    switch (workspace) {
      case 'wfh': return 1650;
      case 'hybrid': return 1250;
      case 'office': return 850;
      default: return 1650;
    }
  };

  // Calculate all costs
  useEffect(() => {
    let totalStaffCost = 0;
    let totalWorkspaceCost = 0;
    let totalSetupCost = 0;
    
    const breakdown = staff.map(member => {
      const multiplier = getMultiplier(member.role);
      // Use average salary for each level
      const avgSalary = getAverageSalary(member.role);
      const baseCost = avgSalary * multiplier;
      const workspaceCost = getWorkspaceCostPerPerson(member.workspace);
      const setupFee = getSetupFeePerPerson(member.workspace);
      const totalCost = baseCost + workspaceCost;
      
      totalStaffCost += baseCost;
      totalWorkspaceCost += workspaceCost;
      totalSetupCost += setupFee;
      
      return {
        id: member.id,
        role: member.role,
        multiplier,
        baseCost,
        workspace: member.workspace,
        workspaceCost,
        setupFee,
        totalCost
      };
    });

    let monthlySetupCost = 0;
    let totalUpfront = 0;

    if (contractType === '6month') {
      monthlySetupCost = totalSetupCost / 6;
    } else if (contractType === 'monthly') {
      totalUpfront = totalSetupCost + totalStaffCost;
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
      breakdown
    });
  }, [staff, contractType]);

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
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-lime-200 bg-lime-50">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-lime-600 rounded-lg flex items-center justify-center">
              <Eye className="w-3 h-3 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Testing & Debug View
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
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-lime-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-hidden">
          {/* Left Section - Team Builder */}
          <div className="flex-1 p-3 bg-white overflow-y-auto">
            <div className="space-y-4">
              {/* Team Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Team ({staff.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const newId = Math.max(...staff.map(s => parseInt(s.id))) + 1;
                      setStaff([...staff, { id: newId.toString(), role: 'virtual-assistant', workspace: 'wfh' }]);
                    }}
                    className="bg-lime-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-lime-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {staff.map((member, index) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">Person {index + 1}</h4>
                        {staff.length > 1 && (
                          <button
                            onClick={() => {
                              if (staff.length > 1) {
                                setStaff(staff.filter(s => s.id !== member.id));
                              }
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Role Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                          <select
                            value={member.role}
                            onChange={(e) => {
                              setStaff(staff.map(s => s.id === member.id ? { ...s, role: e.target.value as 'virtual-assistant' | 'admin-assistant' | 'customer-service' | 'graphic-designer' | 'accountant' | 'project-manager' } : s));
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-xs"
                          >
                            <option value="virtual-assistant">Virtual Assistant (1.7x)</option>
                            <option value="admin-assistant">Admin Assistant (1.5x)</option>
                            <option value="customer-service">Customer Service (1.6x)</option>
                            <option value="graphic-designer">Graphic Designer (1.4x)</option>
                            <option value="accountant">Accountant (1.5x)</option>
                            <option value="project-manager">Project Manager (1.3x)</option>
                          </select>
                          <div className="text-xs text-gray-500 mt-1">
                            {member.role === 'virtual-assistant' ? '₱30,000 - ₱39,999' : member.role === 'admin-assistant' ? '₱70,000 - ₱99,999' : member.role === 'customer-service' ? '₱45,000 - ₱64,999' : member.role === 'graphic-designer' ? '₱85,000+' : member.role === 'accountant' ? '₱60,000+' : '₱120,000+'}
                          </div>
                        </div>

                        {/* Workspace Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Workspace</label>
                          <select
                            value={member.workspace}
                            onChange={(e) => {
                              setStaff(staff.map(s => s.id === member.id ? { ...s, workspace: e.target.value as 'wfh' | 'hybrid' | 'office' } : s));
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-xs"
                          >
                            <option value="wfh">Work from Home (₱8,000/month)</option>
                            <option value="hybrid">Hybrid (₱12,000/month)</option>
                            <option value="office">Office (₱16,000/month)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Type Section */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-lime-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Contract Type</h3>
                </div>
                
                <div className="space-y-2">
                  {[
                    { id: '6month', label: '6-Month Contract', description: 'Setup fee spread over 6 months' },
                    { id: 'monthly', label: 'Month-to-Month', description: 'Pay setup fee upfront' }
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-2 border-2 rounded-lg cursor-pointer transition-all ${
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
                      <div className={`w-3 h-3 rounded-full border-2 mr-2 ${
                        contractType === option.id
                          ? 'border-lime-500 bg-lime-500'
                          : 'border-gray-300'
                      }`}>
                        {contractType === option.id && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Detailed Computations */}
          <div className="flex-1 p-3 bg-lime-50 overflow-y-auto border-l border-lime-200">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-lime-600" />
                <h3 className="text-base font-semibold text-gray-900">Detailed Computations</h3>
              </div>

              {/* Staff Costs Breakdown */}
              <div className="bg-white rounded-lg p-3 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-xs">Staff Costs Breakdown</h4>
                <div className="space-y-2">
                  {calculations.breakdown.map((member, index) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900 text-xs">Person {index + 1}</span>
                        <span className="text-xs text-gray-600">({member.role}, {member.workspace})</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Avg Salary × {member.multiplier}x:</span>
                          <span>{formatPriceOnly(member.baseCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Workspace Cost:</span>
                          <span>{formatPriceOnly(member.workspaceCost)}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Setup Fee:</span>
                          <span>{formatPriceOnly(member.setupFee)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-200">
                          <span className="font-medium">Total Monthly:</span>
                          <span className="font-medium">{formatPriceOnly(member.totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-semibold text-lime-600 text-xs">Total Staff Cost</span>
                    <span className="font-semibold text-lime-600 text-xs">
                      {formatPriceOnly(calculations.totalStaffCost)}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Workspace Costs */}
              <div className="bg-white rounded-lg p-3 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-xs">Workspace Costs</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-700">Total Workspace Cost</span>
                    <span className="font-medium text-gray-900">
                      {formatPriceOnly(calculations.totalWorkspaceCost)}/month
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {staff.map((member, index) => (
                      <div key={member.id} className="flex justify-between">
                        <span>Person {index + 1} ({member.workspace}):</span>
                        <span>{formatPriceOnly(getWorkspaceCostPerPerson(member.workspace))}/month</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Setup Costs */}
              <div className="bg-white rounded-lg p-3 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-xs">Setup Costs</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-700">Total Setup Fee</span>
                    <span className="font-medium text-gray-900">
                      {formatPriceOnly(calculations.totalSetupCost)}
                    </span>
                  </div>
                  {contractType === '6month' && (
                    <div className="flex justify-between items-center text-xs text-lime-600 mt-1">
                      <span>Monthly Setup Cost (6 months):</span>
                      <span>{formatPriceOnly(calculations.monthlySetupCost)}/month</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Costs Summary */}
              <div className="space-y-2">
                <div className="bg-lime-100 rounded-lg p-3 border border-lime-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm">First 6 Months</span>
                    <span className="text-lg font-bold text-lime-600">
                      {formatPriceOnly(calculations.totalMonthly)}/month
                    </span>
                  </div>
                  <div className="text-xs text-lime-700 mt-1">
                    Staff + Workspace + Setup
                  </div>
                </div>
                
                <div className="bg-lime-100 rounded-lg p-3 border border-lime-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm">After 6 Months</span>
                    <span className="text-lg font-bold text-lime-600">
                      {formatPriceOnly(calculations.totalAfter6Months)}/month
                    </span>
                  </div>
                  <div className="text-xs text-lime-700 mt-1">
                    Staff + Workspace
                  </div>
                </div>
                
                {contractType === 'monthly' && (
                  <div className="bg-orange-100 rounded-lg p-3 border border-orange-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 text-sm">Upfront Payment</span>
                      <span className="text-lg font-bold text-orange-600">
                        {formatPriceOnly(calculations.totalUpfront)}
                      </span>
                    </div>
                    <div className="text-xs text-orange-700 mt-1">
                      Setup + First Month Staff
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
