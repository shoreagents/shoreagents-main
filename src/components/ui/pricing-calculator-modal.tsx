'use client';

import { useState, useEffect } from 'react';
import { X, Users, Building, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, Calculator, Brain, Zap } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog';
import { useCurrency } from '@/lib/currencyContext';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Progress } from './progress';
import { AIIndustryAutocomplete } from './ai-industry-autocomplete';
import { AIRoleAutocomplete } from './ai-role-autocomplete';
import { AIDescriptionGenerator } from './ai-description-generator';
import { RoleCardCollapsed } from './role-card-collapsed';
import { getCandidateRecommendations, CandidateRecommendation } from '@/lib/bpocPricingService';
import { TalentCard } from './talent-card';
import { EmployeeCardData } from '@/types/api';
import { rankEmployeesByScore } from '@/lib/employeeRankingService';
import { getFixedSetupCost, getFixedWorkspaceCost, convertSalaryToCurrency, formatCurrency } from '@/lib/fixedPricingService';
import { getFallbackSalary } from '@/lib/salaryLookupService';
import { PricingQuoteServiceClient, PricingQuoteData } from '@/lib/pricingQuoteServiceClient';
import { useUserAuth } from '@/lib/user-auth-context'
import { generateUserId, savePageVisit } from '@/lib/userEngagementService';
import { useFavorites } from '@/lib/favorites-context';

interface RoleDetail {
  id: string;
  title: string;
  description?: string;
  level: 'entry' | 'mid' | 'senior';
  count: number;
  workspace?: 'wfh' | 'hybrid' | 'office';
  isCompleted?: boolean;
  candidateMatch?: {
    totalCandidates: number;
    recommendedCandidates: unknown[];
  };
  isBPOCIntegrated?: boolean;
}

interface QuoteData {
  totalMembers: number;
  roles: RoleDetail[];
  workplace: string;
  workplaceBreakdown: string;
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
    isBPOCIntegrated?: boolean;
    candidateCount?: number;
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
  const [isSaving, setIsSaving] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [fadingOutRole, setFadingOutRole] = useState<string | null>(null);
  const [fadeInNextRole, setFadeInNextRole] = useState<string | null>(null);
  const [expandingRole, setExpandingRole] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [showRolesAlert, setShowRolesAlert] = useState(false);
  const [editingRoles, setEditingRoles] = useState<Set<string>>(new Set());
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Step 1: Member count
  const [memberCount, setMemberCount] = useState<number | null>(null);
  
  // Step 2: Industry and roles
  const [industry, setIndustry] = useState('');
  const [sameRoles, setSameRoles] = useState(false);
  const [roles, setRoles] = useState<RoleDetail[]>([
    { id: '1', title: '', description: '', level: 'entry', count: 1, isCompleted: false }
  ]);
  
  // Step 3: Workplace setup - removed global workplace state, using individual role workspace
  
  // Step 5: Quote data
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  // Currency context integration
  const { 
    selectedCurrency, 
    convertPrice, 
    formatPrice 
  } = useCurrency();

  // User auth context
  const { user, isAuthenticated } = useUserAuth();

  // Favorites context
  const { isFavorite, toggleFavorite } = useFavorites();

  // Convert BPOC candidate to EmployeeCardData format
  const convertToEmployeeCardData = (candidate: {
    id: string;
    name: string;
    position: string;
    overallScore: number;
    matchScore: number;
    skills: string[];
    expectedSalary?: number;
  }, rank: number): EmployeeCardData => {
    return {
      user: {
        id: candidate.id,
        name: candidate.name,
        email: '', // BPOC doesn't have email in this context
        location: '', // BPOC doesn't have location in this context
        position: candidate.position,
        avatar: null, // BPOC doesn't have avatar in this context
        bio: null,
        work_status: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      applications: [],
      appliedJobs: [],
      aiAnalysis: {
        id: candidate.id,
        user_id: candidate.id,
        overall_score: candidate.overallScore,
        ats_compatibility_score: candidate.matchScore,
        content_quality_score: candidate.overallScore,
        professional_presentation_score: candidate.overallScore,
        skills_alignment_score: candidate.matchScore,
        key_strengths: candidate.skills.slice(0, 3),
        improvements: [],
        recommendations: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      resume: undefined,
      workStatus: {
        id: candidate.id,
        userId: candidate.id,
        currentEmployer: '',
        currentPosition: candidate.position,
        workStatus: 'active',
        preferredShift: '',
        workSetup: '',
        currentMood: '',
        noticePeriodDays: 0,
        expectedSalary: candidate.expectedSalary?.toString() || '',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  };

  // Get multiplier based on level
  const getMultiplier = (level: 'entry' | 'mid' | 'senior') => {
    switch (level) {
      case 'entry': return 1.7;
      case 'mid': return 1.5;
      case 'senior': return 1.4;
      default: return 1.7;
    }
  };

  // Get base salary range for level based on industry
  // Removed getBaseSalary - using internet salary data directly

  // Get workspace cost per person using fixed pricing structure
  const getWorkspaceCostPerPerson = (workspace: 'wfh' | 'hybrid' | 'office') => {
    return getFixedWorkspaceCost(workspace, selectedCurrency.code);
  };

  // Save quote to database
  const saveQuoteToDatabase = async (quoteData: QuoteData) => {
    // Allow saving for both authenticated and anonymous users

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Prepare the data for the database
      // Use device fingerprint for both authenticated and anonymous users
      const userId = user?.user_id || generateUserId()
      
      console.log('🔍 Pricing Quote Debug:', {
        isAuthenticated: !!user,
        user: user ? { id: user.id, user_id: user.user_id, user_type: user.user_type } : null,
        generatedUserId: userId,
        userType: user?.user_type || 'Anonymous'
      })
      
      // For anonymous users, ensure they exist in the database first
      if (!user) {
        console.log('🔄 Ensuring anonymous user exists before saving quote...')
        // This will create the anonymous user if it doesn't exist
        await savePageVisit('/pricing', undefined, 0)
      }
      
      const pricingQuoteData: PricingQuoteData = {
        user_id: userId, // Use device fingerprint, not Supabase Auth UUID
        session_id: `session_${Date.now()}`, // Generate a session ID
        member_count: quoteData.totalMembers,
        industry: quoteData.industry,
        total_monthly_cost: quoteData.totalMonthlyCost,
        currency_code: selectedCurrency.code,
        roles: quoteData.breakdown.map((item, index) => {
          const role = quoteData.roles[index];
          return {
            role_title: item.role,
            role_description: role?.description || '',
            experience_level: item.level,
            workspace_type: role?.workspace || 'wfh',
            base_salary_php: item.baseSalary,
            multiplier: item.multiplier,
            monthly_cost: item.monthlyCost,
            workspace_cost: item.workspaceCost,
            total_cost: item.totalCost
          };
        })
      };

      const result = await PricingQuoteServiceClient.saveQuote(pricingQuoteData);
      
      if (result.success) {
        setSaveSuccess(true);
        console.log('✅ Quote saved successfully:', result.data);
        return { success: true, data: result.data };
      } else {
        setSaveError(result.error || 'Failed to save quote');
        console.error('❌ Failed to save quote:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      console.error('❌ Unexpected error saving quote:', error);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  // AI Processing simulation
    const processQuote = async () => {
      setIsProcessing(true);
      
      // Add a minimum delay to show the loading animation
      const minDelay = new Promise(resolve => setTimeout(resolve, 800)); // 0.8 seconds minimum
      
      try {
        // Skip BPOC salary expectations, go straight to internet rates
        console.log(`🚀 SKIPPING BPOC SALARY EXPECTATIONS - Using realistic internet rates directly`);
        
        // Fetch BPOC candidates for each role (for step 5 display)
        const rolesWithCandidates = await Promise.all(
          roles.map(async (role) => {
            try {
              console.log(`🔍 Fetching BPOC candidates for: ${role.title} (${role.level} level)`);
              const candidateMatch = await getCandidateRecommendations(role.title, role.level, industry);
              
              return {
                ...role,
                candidateMatch,
                isBPOCIntegrated: candidateMatch.totalCandidates > 0
              };
            } catch (error) {
              console.error(`❌ Error fetching BPOC candidates for ${role.title}:`, error);
              return {
                ...role,
                candidateMatch: { totalCandidates: 0, recommendedCandidates: [] },
                isBPOCIntegrated: false
              };
            }
          })
        );
        
        // Calculate quote using internet salary data directly
        let totalStaffCost = 0;
        let totalWorkspaceCost = 0;
        const breakdown = rolesWithCandidates.map(role => {
          // Use internet salary lookup service for realistic salaries
          const expectedSalary = getFallbackSalary(role.title, role.level);
          console.log(`📊 Using realistic internet salary for ${role.title} (${role.level}): ₱${expectedSalary.toLocaleString()}`);
          const levelMultiplier = getMultiplier(role.level);
        
        // Formula: Salary = expected_salary × level multiplier + setup cost
        const roleWorkspace = role.workspace || 'wfh'; // Default to WFH if no workspace set
        
        // Convert salary expectation to target currency
        const convertedSalary = convertSalaryToCurrency(expectedSalary, selectedCurrency.code);
        
        // Calculate components per person
        const salaryCostPerPerson = convertedSalary * levelMultiplier;
        const workspaceCostPerPersonValue = getFixedWorkspaceCost(roleWorkspace, selectedCurrency.code);
        
        // Total cost per person
        const costPerPerson = salaryCostPerPerson + workspaceCostPerPersonValue;
        
        // Always calculate each role individually (each role = 1 person)
        // This allows for different workspace setups even when roles are the same
        const totalCost = costPerPerson; // Each role represents 1 person
        const salaryCost = salaryCostPerPerson;
        const workspaceCost = workspaceCostPerPersonValue;
        
        // Console log the calculation
        console.log(`💰 CALCULATION - INTERNET SALARY DATA for ${role.title}:`, {
          role: role.title,
          level: role.level,
          originalSalaryPHP: expectedSalary,
          convertedSalary: convertedSalary,
          currency: selectedCurrency.code,
          levelMultiplier: levelMultiplier,
          salaryCostPerPerson: salaryCostPerPerson,
          workspaceCostPerPerson: workspaceCostPerPersonValue,
          costPerPerson: costPerPerson,
          totalCost: totalCost,
          dataSource: 'INTERNET_SALARY_DATABASE',
          note: 'Using realistic internet salary data directly'
        });
        
        // Log the base salary without multiplier for transparency
        console.log(`📊 BASE SALARY (without multiplier) for ${role.title} (${role.level}):`, {
          role: role.title,
          level: role.level,
          baseSalaryPHP: expectedSalary,
          baseSalaryConverted: convertedSalary,
          currency: selectedCurrency.code,
          note: 'This is the raw salary before applying level multiplier'
        });
        
        // Log workspace debugging info
        console.log(`🏢 WORKSPACE DEBUG for ${role.title}:`, {
          roleId: role.id,
          roleTitle: role.title,
          roleWorkspace: role.workspace,
          finalWorkspaceUsed: roleWorkspace,
          workspaceCost: workspaceCostPerPersonValue,
          note: 'Shows which workspace type is being used for this specific role'
        });
        
        totalStaffCost += salaryCost;
      totalWorkspaceCost += workspaceCost;
      
      return {
        role: role.title,
        level: role.level,
          count: 1, // Each role represents 1 person
          baseSalary: expectedSalary,
          multiplier: levelMultiplier,
          monthlyCost: salaryCost,
          workspaceCost: workspaceCost,
          totalCost,
          isBPOCIntegrated: false,
          candidateCount: 0
      };
    });
    
    const totalMonthlyCost = totalStaffCost + totalWorkspaceCost;
    
      // Calculate workplace breakdown
      const workplaceCounts = rolesWithCandidates.reduce((acc, role) => {
        const workspace = role.workspace || 'wfh';
        acc[workspace] = (acc[workspace] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const workplaceBreakdown = Object.entries(workplaceCounts)
        .map(([workspace, count]) => `${count}x ${workspace.toUpperCase()}`)
        .join(', ');
      
      // Summary console log
      const bpocMatchedCount = rolesWithCandidates.filter(role => role.isBPOCIntegrated).length;
      console.log(`📊 QUOTE SUMMARY - INTERNET SALARY DATA:`, {
        totalRoles: rolesWithCandidates.length,
        bpocCandidatesFound: bpocMatchedCount,
        totalMonthlyCost: totalMonthlyCost,
        totalStaffCost: totalStaffCost,
        totalWorkspaceCost: totalWorkspaceCost,
        industry: industry,
        workplace: workplaceBreakdown,
        dataSource: 'INTERNET_SALARY_DATABASE',
        note: 'Skipped BPOC salary expectations, using realistic internet rates directly'
      });
    
    const finalQuoteData = {
      totalMembers: memberCount || 0,
        roles: rolesWithCandidates,
      workplace: workplaceBreakdown, // Use the breakdown string instead
        workplaceBreakdown,
      industry,
      sameRoles,
      totalMonthlyCost,
        totalWorkspaceCost: totalWorkspaceCost,
      totalStaffCost,
      breakdown
    };

    setQuoteData(finalQuoteData);

    // Save quote to database for both authenticated and anonymous users
    console.log('💾 Saving quote to database...');
    await saveQuoteToDatabase(finalQuoteData);
    
    } catch (error) {
      console.error('Error processing quote:', error);
    }
      
      // Wait for minimum delay to show loading animation
      await minDelay;
    
    setIsProcessing(false);
      // Step 4 is already set, no need to change it
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
    setRoles([{ id: '1', title: '', description: '', level: 'entry', count: 1, workspace: 'wfh', isCompleted: false }]);
    // Removed setWorkplace - using individual role workspaces
    setQuoteData(null);
    setActiveRoleId(null);
    // Reset save states
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(false);
  };

  // Only reset form when modal is first opened (not when reopening)
  useEffect(() => {
    if (isOpen && currentStep === 1 && !memberCount && !industry) {
      // Only reset if form is completely empty (first time opening)
      resetForm();
    }
  }, [isOpen, currentStep, memberCount, industry]);

  // Create all role buttons upfront when memberCount is set (only for different roles)
  useEffect(() => {
    if (memberCount && memberCount > 1 && !sameRoles) {
      // Only create new roles if we currently have exactly 1 role (the default)
      setRoles(prevRoles => {
        if (prevRoles.length === 1) {
          return Array.from({ length: memberCount }, (_, index) => ({
            id: (index + 1).toString(),
            title: '',
            description: '',
            level: (index === 0 ? 'entry' : index === 1 ? 'mid' : 'senior') as 'entry' | 'mid' | 'senior',
            count: 1,
            workspace: 'wfh' as const,
            isCompleted: false
          }));
        }
        return prevRoles;
      });
    }
  }, [memberCount, sameRoles]);

  // Handle same roles toggle
  useEffect(() => {
    if (memberCount && memberCount > 1) {
      // Always create the correct number of role objects for workplace setup
      // But handle form display differently based on sameRoles
      const newRoles = Array.from({ length: memberCount }, (_, index) => ({
        id: (index + 1).toString(),
        title: '',
        description: '',
        level: (index === 0 ? 'entry' : index === 1 ? 'mid' : 'senior') as 'entry' | 'mid' | 'senior',
        count: 1,
        workspace: 'wfh' as const,
        isCompleted: false
      }));
      setRoles(newRoles);
    }
  }, [sameRoles, memberCount]);

  // Set first role as active when entering Step 2
  useEffect(() => {
    if (currentStep === 2 && !activeRoleId && roles.length > 0) {
      const firstIncompleteRole = roles.find(role => !role.isCompleted);
      if (firstIncompleteRole) {
        setActiveRoleId(firstIncompleteRole.id);
      }
    }
  }, [currentStep, activeRoleId, roles]);

  // Helper functions
  const addRole = () => {
    const newId = (roles.length + 1).toString();
    // Cycle through levels: entry -> mid -> senior -> entry...
    const levels: ('entry' | 'mid' | 'senior')[] = ['entry', 'mid', 'senior'];
    const nextLevel = levels[roles.length % 3];
    
    setRoles([...roles, { 
      id: newId, 
      title: '', 
      description: '',
      level: nextLevel, 
      count: 1, 
      workspace: 'wfh', 
      isCompleted: false 
    }]);
  };

  const removeRole = (id: string) => {
    if (roles.length > 1) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const updateRole = (id: string, field: keyof RoleDetail, value: string | number | boolean) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, [field]: value } : role
    ));
  };

  // Function to select all roles for a specific workspace type
  const selectAllWorkspace = (workspaceType: 'wfh' | 'hybrid' | 'office') => {
    setRoles(roles.map(role => ({
      ...role,
      workspace: workspaceType
    })));
  };

  // Function to check if all roles have the same workspace type
  const isAllRolesSameWorkspace = (workspaceType: 'wfh' | 'hybrid' | 'office') => {
    return roles.length > 0 && roles.every(role => role.workspace === workspaceType);
  };

  const handleRoleEditingChange = (roleId: string, isEditing: boolean) => {
    setEditingRoles(prev => {
      const newSet = new Set(prev);
      if (isEditing) {
        newSet.add(roleId);
      } else {
        newSet.delete(roleId);
      }
      return newSet;
    });
  };

  const handleRoleSave = (id: string) => {
    // Start fade-out animation
    setFadingOutRole(id);
    
    // Wait for fade-out animation to complete, then mark as completed
    setTimeout(() => {
      const currentRole = roles.find(role => role.id === id);
      if (!currentRole) return;
      
      // If sameRoles is true, update all roles with the same details but keep individual workspace
      if (sameRoles) {
        setRoles(roles.map(role => ({
          ...role,
            title: currentRole.title,
          description: currentRole.description || '',
            level: currentRole.level,
            isCompleted: true
        })));
      } else {
        // For different roles, just mark this role as completed
        updateRole(id, 'isCompleted', true);
        
        // Find the next incomplete role and set it as active
        const nextIncompleteRole = roles.find(role => 
          role.id !== id && !role.isCompleted
        );
        if (nextIncompleteRole) {
          setActiveRoleId(nextIncompleteRole.id);
        }
      }
      
      setFadingOutRole(null);
      if (!sameRoles) {
        // For different roles, don't clear activeRoleId if there's a next role
        const nextIncompleteRole = roles.find(role => 
          role.id !== id && !role.isCompleted
        );
        if (!nextIncompleteRole) {
          setActiveRoleId(null);
        }
      } else {
        setActiveRoleId(null); // Clear active role when all are completed
      }
    }, 400); // Match animation duration
  };

  const handleRoleEdit = (id: string) => {
    // Set this role as the active role to edit
    setActiveRoleId(id);
    
    // Start expand animation
    setExpandingRole(id);
    
    // Wait for animation to complete, then mark as not completed
    setTimeout(() => {
      if (sameRoles) {
        // For same roles, mark all roles as not completed so they all show the same form
        setRoles(roles.map(role => ({ ...role, isCompleted: false })));
      } else {
        // For different roles, only mark the clicked role as not completed
    updateRole(id, 'isCompleted', false);
      }
      setExpandingRole(null);
    }, 300); // Match animation duration
  };

  const handleRoleDelete = (id: string) => {
    if (roles.length > 1) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const formatPriceDisplay = (amount: number) => {
    return formatCurrency(amount, selectedCurrency.code);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return memberCount !== null;
      case 2: 
        return industry.trim() !== '' && 
               roles.every(role => role.title.trim() !== '' && role.description && role.description.trim() !== '') &&
               (sameRoles ? roles.some(role => role.isCompleted) : roles.every(role => role.isCompleted));
      case 3: return roles.every(role => role.workspace !== undefined);
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // If only 1 member, skip the roles alert and go directly to step 2
      if (memberCount === 1) {
        setSameRoles(true); // For single member, we can assume same role
        setSlideDirection('right');
        setCurrentStep(currentStep + 1);
      } else {
        // Show alert dialog asking if all roles are the same (only for multiple members)
        setShowRolesAlert(true);
      }
      } else if (currentStep === 3) {
        // Move to step 4 first to show loading animation, then start processing
        setSlideDirection('right');
        setCurrentStep(4);
        // Start processing after a short delay to ensure step transition is visible
        setTimeout(() => {
      processQuote();
        }, 150);
    } else {
      setSlideDirection('right');
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRolesAlertResponse = (allRolesSame: boolean) => {
    setSameRoles(allRolesSame);
    setShowRolesAlert(false);
    setSlideDirection('right');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setSlideDirection('left');
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop ${
          isVisible ? 'modal-backdrop-enter' : 'modal-backdrop-exit'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl w-full max-h-[95vh] overflow-hidden modal-content ${
          isVisible ? 'modal-content-enter' : 'modal-content-exit'
        } ${
          currentStep === 1 ? 'max-w-3xl' :
          currentStep === 2 ? 'max-w-4xl' :
          currentStep === 3 ? 'max-w-5xl' :
          currentStep === 4 ? 'max-w-6xl' :
          currentStep === 5 ? 'max-w-6xl' :
          'max-w-4xl'
        }`}
        style={{
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-lime-600">{currentStep === 5 ? '5/5' : `${currentStep}/5`}</span>
            <Calculator className="w-5 h-5 text-lime-600" />
            <h2 className="text-lg font-semibold text-gray-900">Quick Pricing Quote</h2>
            <span className="text-sm text-gray-500">:</span>
            <span className="text-sm font-medium text-gray-700">
              {currentStep === 1 && 'Team Size'}
              {currentStep === 2 && 'Industry & Roles'}
              {currentStep === 3 && 'Workplace Setup'}
              {currentStep === 4 && 'Quote Summary'}
              {currentStep === 5 && 'Final Quote'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Progress Bar */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <Progress value={currentStep === 5 ? 100 : (currentStep / 5) * 100} className="h-1" />
        </div>

        {/* Step Content */}
        <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto scrollbar-hide relative transition-all duration-500 ease-in-out">
          <div 
            key={currentStep}
            className={slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
            style={{
              animation: slideDirection === 'right' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out'
            }}
          >
          {currentStep === 1 && (
            <div className="max-w-3xl mx-auto transition-all duration-500 ease-in-out">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-lime-600 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">How many team members do you need?</p>
              </div>
              
              {/* Custom Input at Top */}
              <div className="mb-6 flex justify-center">
                  <Input
                    id="memberCount"
                    type="number"
                    min="1"
                    max="100"
                    value={memberCount || ''}
                    onChange={(e) => setMemberCount(parseInt(e.target.value) || null)}
                  placeholder="Enter number of members"
                  className="w-64 h-16 text-center text-2xl font-medium placeholder-gray-400 !text-2xl placeholder:text-sm"
                  style={{ fontSize: '24px' }}
                  />
                </div>
                
                {/* Quick Response Buttons */}
              <div className="flex justify-center space-x-3">
                {[1, 3, 5, 10, 20].map((count) => (
                  <button
                        key={count}
                        onClick={() => setMemberCount(count)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all text-sm font-medium flex items-center justify-center ${
                          memberCount === count 
                        ? 'border-lime-500 bg-lime-500 text-white'
                        : 'border-gray-300 hover:border-lime-400 hover:bg-lime-50 text-gray-700'
                        }`}
                      >
                    {count}
                  </button>
                    ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto transition-all duration-500 ease-in-out">
              <div className="text-center mb-6">
                <Building className="w-12 h-12 text-lime-600 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">What industry and roles do you need?</p>
              </div>
              
              <div className="space-y-4">
                <AIIndustryAutocomplete
                  value={industry}
                  onChange={setIndustry}
                  label="Industry"
                  placeholder="Select industry..."
                  id="industry"
                />

                {/* Role Configuration Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${sameRoles ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {sameRoles 
                        ? `All ${memberCount || 0} team members will have the same role` 
                        : `Each team member will have a different role`
                      }
                    </span>
                </div>
                  </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-semibold">Role Details</Label>
                      <div className="flex items-center gap-2">
                        {/* Circular role buttons - show all roles */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: memberCount || 0 }, (_, index) => {
                            const role = roles[index];
                            const roleNumber = index + 1;
                            const isCompleted = role?.isCompleted || false;
                            const isActive = activeRoleId === role?.id;
                            
                            return (
                              <button
                                key={role?.id || `role-${index}`}
                                onClick={() => role && handleRoleEdit(role.id)}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  if (role?.isCompleted && roles.length > 1) {
                                    handleRoleDelete(role.id);
                                  }
                                }}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                  isActive
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer ring-2 ring-blue-300'
                                    : isCompleted 
                                      ? 'bg-lime-600 text-white hover:bg-lime-700 cursor-pointer' 
                                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-pointer'
                                }`}
                                title={isActive
                                  ? `Currently editing Role ${roleNumber}` 
                                  : isCompleted 
                                    ? `Edit ${role?.title || `Role ${roleNumber}`} (Right-click to delete)` 
                                    : `Edit Role ${roleNumber}`
                                }
                              >
                                {roleNumber}
                              </button>
                            );
                          })}
                       </div>
                     </div>
                    </div>
                    <Button
                      onClick={addRole}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      + Add Role
                    </Button>
                   </div>
                   
                  <div className="space-y-1">
                    {roles.map((role, index) => {
                       // Show the form if this is the active role or if no active role is set and this is the first incomplete role
                       const isActiveRole = activeRoleId === role.id;
                       const isFirstIncomplete = !activeRoleId && !role.isCompleted && roles.slice(0, index).every(r => r.isCompleted);
                       const isExpanding = expandingRole === role.id;
                       
                       if (!isActiveRole && !isFirstIncomplete && !isExpanding) {
                         return null; // Hide this role form
                       }

                       return (
                          <Card key={role.id} className={`p-3 border border-gray-200 ${
                            fadingOutRole === role.id ? 'role-form-fade-out' : ''
                          } ${
                            fadeInNextRole === role.id ? 'role-form-fade-in' : ''
                          } ${
                            expandingRole === role.id ? 'role-form-expand' : ''
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs">{index + 1}</span>
                             </div>
                                <h4 className="text-sm font-semibold text-gray-900">
                               {sameRoles ? "All Roles" : `Role ${index + 1}`}
                             </h4>
                           </div>
                           
                            </div>
                            
                            <div className="space-y-1 -mt-5">
                             <AIRoleAutocomplete
                               value={role.title}
                               onChange={(value) => {
                                 // Limit title to 50 characters
                                 const limitedValue = value.length > 50 ? value.substring(0, 50) : value;
                                 updateRole(role.id, 'title', limitedValue);
                               }}
                               industry={industry}
                               placeholder="Enter role..."
                               id={`title-${role.id}`}
                             />
                             
                             {/* Experience Level Selector */}
                             <div className="space-y-2">
                               <Label className="text-sm font-medium text-gray-700">Experience Level</Label>
                               <div className="flex space-x-2">
                                 {[
                                   { value: 'entry', label: 'Entry Level', description: '0-2 years experience' },
                                   { value: 'mid', label: 'Mid Level', description: '3-5 years experience' },
                                   { value: 'senior', label: 'Senior Level', description: '6+ years experience' }
                                 ].map((level) => (
                                   <button
                                     key={level.value}
                                     type="button"
                                     onClick={() => updateRole(role.id, 'level', level.value)}
                                     className={`flex-1 p-3 border-2 rounded-lg text-left transition-all ${
                                       role.level === level.value
                                         ? 'border-lime-500 bg-lime-50 text-lime-700'
                                         : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                     }`}
                                   >
                                     <div className="font-medium text-sm">{level.label}</div>
                                     <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                                   </button>
                                 ))}
                               </div>
                             </div>
                             
                             <AIDescriptionGenerator
                               value={role.description || ''}
                                onChange={(value) => {
                                  updateRole(role.id, 'description', value);
                                }}
                               roleTitle={role.title}
                               industry={industry}
                               label="Role Description"
                               id={`description-${role.id}`}
                               onSave={() => handleRoleSave(role.id)}
                               onEditingChange={(isEditing) => handleRoleEditingChange(role.id, isEditing)}
                                className="min-h-[200px]"
                             />
                             
                             {/* Dynamic Button - positioned below role description */}
                             <div className="flex justify-end pt-2">
                               {role.title && role.title.trim() !== '' && role.description && role.description.trim() !== '' && !editingRoles.has(role.id) ? (
                                 <Button
                                   onClick={() => handleRoleSave(role.id)}
                                   size="sm"
                                   className="bg-lime-600 hover:bg-lime-700 text-white"
                                 >
                                    {(() => {
                                      // Single role: always "Done"
                                      if ((memberCount || 0) === 1) return 'Done';
                                      
                                      // Multiple roles: "Done" for same roles, "Next" for different roles
                                      if (sameRoles) return 'Done';
                                      
                                      // For different roles: "Done" if this is the last incomplete role, "Next" otherwise
                                      const incompleteRoles = roles.filter(r => !r.isCompleted);
                                      const isLastIncompleteRole = incompleteRoles.length === 1 && incompleteRoles[0].id === role.id;
                                      return isLastIncompleteRole ? 'Done' : 'Next';
                                    })()}
                                 </Button>
                               ) : (
                                 <div className="text-xs text-gray-400">
                                   {editingRoles.has(role.id) ? 'Finish editing' : 
                                    !role.title || role.title.trim() === '' ? 'Add role title' : 'Add role description'}
                                 </div>
                               )}
                             </div>
                           </div>
                         </Card>
                       );
                    })}
                  </div>

                        </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto transition-all duration-500 ease-in-out">
              <div className="text-center mb-6">
                <Building className="w-12 h-12 text-lime-600 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Choose workspace arrangement for each role</p>
              </div>
              
              <div className="space-y-4">
                {/* Roles Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                          <th className="px-4 py-3 text-center">
                            <button
                              onClick={() => selectAllWorkspace('wfh')}
                              className={`text-sm font-semibold transition-colors duration-200 cursor-pointer relative group ${
                                isAllRolesSameWorkspace('wfh')
                                  ? 'text-lime-600'
                                  : 'text-gray-900 hover:text-lime-600'
                              }`}
                              title="Click to select Work from Home for all roles"
                            >
                              <span className="relative inline-block">
                                Work from Home
                                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${
                                  isAllRolesSameWorkspace('wfh') ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                              </span>
                            </button>
                          </th>
                          <th className="px-4 py-3 text-center">
                            <button
                              onClick={() => selectAllWorkspace('hybrid')}
                              className={`text-sm font-semibold transition-colors duration-200 cursor-pointer relative group ${
                                isAllRolesSameWorkspace('hybrid')
                                  ? 'text-lime-600'
                                  : 'text-gray-900 hover:text-lime-600'
                              }`}
                              title="Click to select Hybrid for all roles"
                            >
                              <span className="relative inline-block">
                                Hybrid
                                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${
                                  isAllRolesSameWorkspace('hybrid') ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                              </span>
                            </button>
                          </th>
                          <th className="px-4 py-3 text-center">
                            <button
                              onClick={() => selectAllWorkspace('office')}
                              className={`text-sm font-semibold transition-colors duration-200 cursor-pointer relative group ${
                                isAllRolesSameWorkspace('office')
                                  ? 'text-lime-600'
                                  : 'text-gray-900 hover:text-lime-600'
                              }`}
                              title="Click to select Full Office for all roles"
                            >
                              <span className="relative inline-block">
                                Full Office
                                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${
                                  isAllRolesSameWorkspace('office') ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                              </span>
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {roles.map((role, index) => (
                          <tr key={role.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs">{index + 1}</span>
                      </div>
                      <div>
                                  <div className="font-medium text-gray-900">
                                    {role.title || `Role ${index + 1}`}
                      </div>
                                  <div className="text-sm text-gray-500 capitalize">
                                    {role.level} level
                    </div>
                      </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => updateRole(role.id, 'workspace', 'wfh')}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                  role.workspace === 'wfh'
                                    ? 'bg-lime-600 border-lime-600 text-white'
                                    : 'border-gray-300 hover:border-lime-400 hover:bg-lime-50'
                                }`}
                              >
                                {role.workspace === 'wfh' && '✓'}
                              </button>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => updateRole(role.id, 'workspace', 'hybrid')}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                  role.workspace === 'hybrid'
                                    ? 'bg-lime-600 border-lime-600 text-white'
                                    : 'border-gray-300 hover:border-lime-400 hover:bg-lime-50'
                                }`}
                              >
                                {role.workspace === 'hybrid' && '✓'}
                              </button>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => updateRole(role.id, 'workspace', 'office')}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                  role.workspace === 'office'
                                    ? 'bg-lime-600 border-lime-600 text-white'
                                    : 'border-gray-300 hover:border-lime-400 hover:bg-lime-50'
                                }`}
                              >
                                {role.workspace === 'office' && '✓'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                     </table>
                       </div>
                     </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
              <div className="max-w-6xl mx-auto transition-all duration-500 ease-in-out">
                {isProcessing ? (
                 // Enhanced Loading Animation
                 <div className="text-center mb-6 py-12">
                    <div className="relative">
                     {/* Main Spinner */}
                     <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-3 border-lime-200"></div>
                        <div className="absolute inset-0 rounded-full border-3 border-lime-600 border-t-transparent animate-spin" style={{ animationDuration: '0.8s' }}></div>
                       <Brain className="w-6 h-6 text-lime-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDuration: '1.2s' }} />
              </div>
                     
                     {/* Loading Text */}
                     <div className="space-y-3">
                       <h3 className="text-xl font-bold text-gray-900">AI is computing your quote...</h3>
                       <p className="text-gray-600 text-base">Analyzing market rates and candidate data</p>
                       
                       {/* Progress Steps */}
                       <div className="mt-4 space-y-1">
                         <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                           <Sparkles className="w-4 h-4 text-lime-600 animate-pulse" style={{ animationDuration: '1s' }} />
                           <span>Fetching realistic salary data</span>
              </div>
                         <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                           <Zap className="w-4 h-4 text-lime-600 animate-pulse" style={{ animationDuration: '1s' }} />
                           <span>Calculating workspace costs</span>
              </div>
                         <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                           <Calculator className="w-4 h-4 text-lime-600 animate-pulse" style={{ animationDuration: '1s' }} />
                           <span>Generating final quote</span>
                         </div>
                       </div>
                       
                       {/* Bouncing Dots */}
                       <div className="flex items-center justify-center space-x-2 mt-4">
                         <div className="flex space-x-1">
                           <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                           <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }}></div>
                           <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Quote Summary
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-lime-600 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Your personalized pricing breakdown</p>
                </div>
              )}
              
              {!isProcessing && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quote Summary */}
                <Card className="p-4">
                  <CardHeader className="pb-3">
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Members:</span>
                      <span className="font-semibold">{quoteData?.totalMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Industry:</span>
                      <span className="font-semibold">{quoteData?.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Setup:</span>
                      <span className="font-semibold text-sm">{quoteData?.workplaceBreakdown}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Monthly Cost:</span>
                        <span className="text-lime-600">{formatPriceDisplay(quoteData?.totalMonthlyCost || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card className="p-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quoteData?.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.role} ({item.level})</span>
                        <span>{formatPriceDisplay(item.totalCost)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

                  <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setCurrentStep(5)}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 flex items-center space-x-2"
                >
                  <span>View Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
                </>
              )}
            </div>
          )}

          {currentStep === 5 && quoteData && (
            <div className="max-w-6xl mx-auto transition-all duration-500 ease-in-out">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-lime-600 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Personalized recommendations for your team</p>
              </div>
              
              <div className="space-y-6">
                {/* Quote Summary */}
                <Card className="bg-lime-50 border-lime-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-lime-600">{formatPriceDisplay(quoteData.totalMonthlyCost)}</div>
                        <div className="text-sm text-gray-600">per month</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{quoteData.totalMembers}</div>
                        <div className="text-sm text-gray-600">team members</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Candidate Recommendations */}
                <div className="space-y-4">
                  {/* BPOC Candidate Recommendations */}
                {quoteData.roles.some(role => role.isBPOCIntegrated && role.candidateMatch?.recommendedCandidates.length) && (
                 <Card>
                   <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-lime-600" />
                        Recommended Candidates
                      </CardTitle>
                      <CardDescription>
                        Top candidates from our talent pool for your requirements
                      </CardDescription>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
                          <span className="text-gray-600">Top Pick</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">Highly Recommended</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">Recommended</span>
                        </div>
                      </div>
                   </CardHeader>
                    <CardContent className="space-y-4">
                      {(() => {
                        // Collect all unique candidates from all roles to prevent duplication
                        const allCandidates = new Map<string, { candidate: CandidateRecommendation, role: RoleDetail, rank: number }>();
                        
                        quoteData.roles
                          .filter(role => role.isBPOCIntegrated && role.candidateMatch?.recommendedCandidates.length)
                          .forEach(role => {
                            const rankedCandidates = rankEmployeesByScore((role.candidateMatch?.recommendedCandidates as CandidateRecommendation[]) || []);
                            const topCandidates = rankedCandidates.slice(0, 5); // Show top 5 per role
                            
                            topCandidates.forEach(rankedCandidate => {
                              const originalCandidate = (role.candidateMatch?.recommendedCandidates as CandidateRecommendation[])?.find((c: CandidateRecommendation) => c.id === rankedCandidate.id);
                              if (originalCandidate && !allCandidates.has(originalCandidate.id)) {
                                allCandidates.set(originalCandidate.id, {
                                  candidate: originalCandidate,
                                  role: role,
                                  rank: rankedCandidate.rank
                                });
                              }
                            });
                          });
                        
                        // Convert to array and sort by rank
                        const uniqueCandidates = Array.from(allCandidates.values())
                          .sort((a, b) => a.rank - b.rank)
                          .slice(0, 12); // Show max 12 unique candidates
                        
                        if (uniqueCandidates.length === 0) {
                          return (
                            <div className="text-center py-8 text-gray-500">
                              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>No candidates found for the selected roles.</p>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {uniqueCandidates.map(({ candidate, role, rank }) => {
                              const employeeData = convertToEmployeeCardData(candidate, rank);
                              
                              return (
                                <TalentCard
                                  key={`${candidate.id}-${role.id}`} // Unique key to prevent duplication
                                  data={employeeData}
                                  onAskForInterview={() => {
                                    // Handle interview request for this candidate
                                    console.log('Interview requested for:', candidate.name);
                                    // You can add modal opening logic here if needed
                                  }}
                                />
                              );
                            })}
                          </div>
                        );
                      })()}
                   </CardContent>
                 </Card>
                )}

                {/* Fallback when no BPOC candidates */}
                {!quoteData.roles.some(role => role.isBPOCIntegrated && role.candidateMatch?.recommendedCandidates.length) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-lime-600" />
                        Candidate Recommendations
                      </CardTitle>
                      <CardDescription>
                        We're building our talent pool. Contact us to find the perfect candidates for your team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-lime-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Perfect Team</h3>
                        <p className="text-gray-600 mb-4">
                          Our recruitment team can help you find qualified candidates for your specific requirements.
                        </p>
                        <Button 
                          size="lg" 
                          className="bg-lime-600 hover:bg-lime-700 text-white"
                        >
                          Ask Maya
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Save Status */}
                {isAuthenticated && (
                  <div className="mb-6">
                    {isSaving && (
                      <div className="flex items-center justify-center space-x-2 text-lime-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Saving quote to your account...</span>
                      </div>
                    )}
                    {saveSuccess && (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Quote saved successfully!</span>
                      </div>
                    )}
                    {saveError && (
                      <div className="flex items-center justify-center space-x-2 text-red-600">
                        <X className="w-4 h-4" />
                        <span className="text-sm">Failed to save quote: {saveError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-lime-600 hover:bg-lime-700 text-white px-8"
                  >
                    Book Consultation
                  </Button>
                  {isAuthenticated && !saveSuccess && !isSaving && (
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={() => quoteData && saveQuoteToDatabase(quoteData)}
                      className="border-lime-300 text-lime-700 hover:bg-lime-50"
                    >
                      Save Quote
                    </Button>
                  )}
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
            </div>
          )}
          </div>
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                  size="sm"
                onClick={prevStep}
                  className="flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
              </Button>
            )}
            </div>
            
              <Button
                onClick={nextStep}
                disabled={!canProceed() || isProcessing}
              size="sm"
                className="flex items-center space-x-2 bg-lime-600 hover:bg-lime-700"
              >
                <span>
                  {currentStep === 2 ? (
                    <>
                      {sameRoles ? 
                        (roles.some(role => role.isCompleted) ? 1 : 0) : 
                        roles.filter(role => role.isCompleted).length
                      }/{sameRoles ? 1 : (memberCount || 0)} completed - Proceed
                    </>
                  ) : currentStep === 3 ? 'Get Quote' : 'Proceed'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
          </div>
        )}
      </div>

      {/* Roles Alert Dialog */}
      <AlertDialog open={showRolesAlert} onOpenChange={setShowRolesAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Team Role Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are all team members going to have the same role, or will each person have a different position?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleRolesAlertResponse(false)}>
              Different Roles
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRolesAlertResponse(true)}>
              Same Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
