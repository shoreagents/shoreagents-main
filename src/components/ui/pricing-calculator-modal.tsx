'use client';

import { useState, useEffect } from 'react';
import { X, Plus, ShoppingCart, Users, Calculator, Building, Clock, DollarSign, Home, Zap, Building2, Minus, RefreshCw } from 'lucide-react';
import { useCurrency, currencies } from '@/lib/currencyContext';
import { PricingCalculatorTesting } from './pricing-calculator-testing';

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
    level: string;
    multiplier: number;
    baseCost: number;
    workspace: string;
    workspaceCost: number;
    setupFee: number;
    totalCost: number;
  }>;
}

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingCalculatorModal({ isOpen, onClose }: PricingCalculatorModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [employeeCount, setEmployeeCount] = useState<'under10' | 'over10' | null>(null);
  const [showTestingCalculator, setShowTestingCalculator] = useState(false);
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
      // Use average salary for each role in PHP
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
        level: member.role,
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
      setShowQuestion(true);
      setEmployeeCount(null);
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

  const handleEmployeeCountSelection = (count: 'under10' | 'over10') => {
    setEmployeeCount(count);
    setShowQuestion(false);
    
    if (count === 'over10') {
      setContractType('private');
      // Automatically add 10 people
      const initialStaff = Array.from({ length: 10 }, (_, index) => ({
        id: (index + 1).toString(),
        role: 'virtual-assistant' as const,
        workspace: 'wfh' as const
      }));
      setStaff(initialStaff);
    } else {
      // For under 10, start with just 1 person
      setContractType('6month');
      setStaff([{ id: '1', role: 'virtual-assistant', workspace: 'wfh' }]);
    }
  };

  const addStaffMember = () => {
    const newId = Math.max(...staff.map(s => parseInt(s.id))) + 1;
    setStaff([...staff, { id: newId.toString(), role: 'virtual-assistant', workspace: 'wfh' }]);
  };

  const removeStaffMember = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const updateStaffMember = (id: string, key: 'role' | 'workspace', value: 'virtual-assistant' | 'admin-assistant' | 'customer-service' | 'graphic-designer' | 'accountant' | 'project-manager' | 'wfh' | 'hybrid' | 'office') => {
    setStaff(staff.map(s => s.id === id ? { ...s, [key]: value } : s));
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
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Build Your Team</h2>
              <p className="text-sm text-gray-600">Customize your team and see pricing</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTestingCalculator(true)}
              className="px-3 py-2 bg-lime-600 text-white text-sm rounded-lg hover:bg-lime-700 transition-colors flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Testing View
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-lime-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="px-4 py-3 bg-lime-50 border-b border-lime-100">
          <div className="text-xs text-lime-800">
            <span className="font-medium">All-inclusive pricing:</span> Salary, benefits, and management fees included
          </div>
        </div>

        {/* Initial Question */}
        {showQuestion && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-white via-lime-50 to-white rounded-2xl shadow-2xl border-2 border-lime-300/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center leading-tight">
                Are you looking for 10 or more employees?
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleEmployeeCountSelection('under10')}
                  className="w-full p-5 border-2 border-lime-300 rounded-xl hover:border-lime-500 hover:bg-gradient-to-r hover:from-lime-50 hover:to-white transition-all duration-300 text-left bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg group"
                >
                  <div className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-lime-700 transition-colors">Under 10 employees</div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-700">Standard team building with flexible workspace options</div>
                </button>
                <button
                  onClick={() => handleEmployeeCountSelection('over10')}
                  className="w-full p-5 border-2 border-lime-300 rounded-xl hover:border-lime-500 hover:bg-gradient-to-r hover:from-lime-50 hover:to-white transition-all duration-300 text-left bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg group"
                >
                  <div className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-lime-700 transition-colors">10 or more employees</div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-700">Private office space with dedicated infrastructure</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Calculator Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-140px)] overflow-hidden">
          {/* Left Section - Team Builder */}
          <div className="flex-1 p-4 bg-white overflow-y-auto">
            <div className="space-y-6">
              {/* Team Building Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Team</h3>
                  <button
                    onClick={addStaffMember}
                    className="px-3 py-2 bg-lime-600 text-white text-sm rounded-lg hover:bg-lime-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Person
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {staff.map((member, index) => (
                    <div key={member.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Person {index + 1}</span>
                        <button
                          onClick={() => removeStaffMember(member.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <select
                          value={member.role}
                          onChange={(e) => updateStaffMember(member.id, 'role', e.target.value as 'virtual-assistant' | 'admin-assistant' | 'customer-service' | 'graphic-designer' | 'accountant' | 'project-manager')}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        >
                          <option value="virtual-assistant">Virtual Assistant</option>
                          <option value="admin-assistant">Admin Assistant</option>
                          <option value="customer-service">Customer Service</option>
                          <option value="graphic-designer">Graphic Designer</option>
                          <option value="accountant">Accountant</option>
                          <option value="project-manager">Project Manager</option>
                        </select>
                        
                        <select
                          value={member.workspace}
                          onChange={(e) => updateStaffMember(member.id, 'workspace', e.target.value as 'wfh' | 'hybrid' | 'office')}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        >
                          <option value="wfh">Work from Home</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="office">Office</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  Total Team Members: <span className="font-semibold text-lime-600">{staff.length}</span>
                </div>
                
                {/* Office Work Toggle - Only show for 10+ employees */}
                {employeeCount === 'over10' && (
                  <div className="mt-4 p-3 bg-lime-50 rounded-lg border border-lime-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1 text-sm">Office Work Toggle</h4>
                        <p className="text-xs text-gray-600">Do you want them to work at office?</p>
                      </div>
                      <button
                        onClick={() => {
                          const allOffice = staff.every(member => member.workspace === 'office');
                          const newWorkspace = allOffice ? 'wfh' : 'office';
                          setStaff(staff.map(member => ({ ...member, workspace: newWorkspace })));
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 ${
                          staff.every(member => member.workspace === 'office') 
                            ? 'bg-lime-600' 
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            staff.every(member => member.workspace === 'office') 
                              ? 'translate-x-6' 
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {staff.every(member => member.workspace === 'office') 
                        ? 'All team members will work from office' 
                        : 'Team members can work from home, hybrid, or office'}
                    </div>
                  </div>
                )}
              </div>

              {/* Contract Type Section - Only show for under 10 employees */}
              {employeeCount === 'under10' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Contract Type</h3>
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
              )}

              {/* Private Office Info for 10+ employees */}
              {employeeCount === 'over10' && (
                <div className="p-4 bg-lime-50 border border-lime-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-5 h-5 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Private Office Setup</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    With {staff.length} employees, you qualify for a private office. 
                    Your team will have dedicated workspace with all infrastructure included.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Cart Summary */}
          <div className="flex-1 p-4 bg-lime-50 overflow-y-auto border-l border-lime-200">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-lime-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cart Summary</h3>
              </div>

              {/* Team Summary */}
              <div className="bg-white rounded-lg p-4 border border-lime-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Team Overview</h4>
                <div className="space-y-2">
                  {staff.map((member, index) => (
                    <div key={member.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="font-medium">Person {index + 1}</span>
                        <span className="text-gray-500 ml-2">({member.role}, {member.workspace})</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatPriceOnly(getAverageSalary(member.role) * getMultiplier(member.role) + getWorkspaceCostPerPerson(member.workspace))}/month
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Total Costs</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Total Monthly Cost:</span>
                    <span className="font-bold text-xl text-lime-600">
                      {formatPriceOnly(calculations.totalMonthly)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    All-inclusive pricing: Salary, benefits, management fees, and workspace costs included
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-lime-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-lime-700 transition-colors flex items-center justify-center space-x-3 shadow-lg">
                <ShoppingCart className="w-5 h-5" />
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Calculator */}
      <PricingCalculatorTesting 
        isOpen={showTestingCalculator} 
        onClose={() => setShowTestingCalculator(false)} 
      />
    </div>
  );
}
