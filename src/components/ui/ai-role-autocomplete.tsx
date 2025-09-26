'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, User, Sparkles, Star } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { ButtonLoader } from './loader';

interface AIRoleSuggestion {
  title: string;
  description: string;
  level: 'entry' | 'mid' | 'senior';
}

interface AIRoleAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  industry: string;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

export function AIRoleAutocomplete({
  value,
  onChange,
  industry,
  placeholder = "Start typing your role...",
  label,
  className = "",
  id
}: AIRoleAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AIRoleSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Industry-specific roles for instant suggestions
  const getIndustrySpecificRoles = (industry: string): AIRoleSuggestion[] => {
    const industryLower = industry.toLowerCase();
    
    if (industryLower.includes('technology') || industryLower.includes('software') || industryLower.includes('it')) {
      return [
        { title: 'Software Developer', description: 'Develops software applications and systems', level: 'mid' },
        { title: 'DevOps Engineer', description: 'Manages infrastructure and deployment pipelines', level: 'senior' },
        { title: 'Product Manager', description: 'Defines product strategy and roadmap', level: 'senior' },
        { title: 'UX Designer', description: 'Designs user experiences and interfaces', level: 'mid' },
        { title: 'Data Scientist', description: 'Analyzes complex data to drive business decisions', level: 'senior' },
        { title: 'QA Engineer', description: 'Tests software quality and functionality', level: 'mid' },
        { title: 'Technical Writer', description: 'Creates technical documentation and guides', level: 'mid' },
        { title: 'System Administrator', description: 'Manages IT infrastructure and systems', level: 'mid' }
      ];
    } else if (industryLower.includes('healthcare') || industryLower.includes('medical')) {
      return [
        { title: 'Medical Assistant', description: 'Supports healthcare providers with patient care', level: 'entry' },
        { title: 'Nurse', description: 'Provides direct patient care and medical support', level: 'mid' },
        { title: 'Medical Records Specialist', description: 'Manages patient health information', level: 'entry' },
        { title: 'Healthcare Administrator', description: 'Oversees healthcare facility operations', level: 'senior' },
        { title: 'Medical Billing Specialist', description: 'Handles insurance claims and billing', level: 'mid' },
        { title: 'Patient Care Coordinator', description: 'Coordinates patient care and scheduling', level: 'mid' },
        { title: 'Medical Receptionist', description: 'Manages front desk and patient check-in', level: 'entry' },
        { title: 'Healthcare Data Analyst', description: 'Analyzes healthcare data and outcomes', level: 'mid' }
      ];
    } else if (industryLower.includes('finance') || industryLower.includes('banking')) {
      return [
        { title: 'Financial Analyst', description: 'Analyzes financial data and market trends', level: 'mid' },
        { title: 'Accountant', description: 'Manages financial records and reporting', level: 'mid' },
        { title: 'Loan Officer', description: 'Evaluates and processes loan applications', level: 'mid' },
        { title: 'Investment Advisor', description: 'Provides investment guidance to clients', level: 'senior' },
        { title: 'Credit Analyst', description: 'Assesses creditworthiness of borrowers', level: 'mid' },
        { title: 'Financial Planner', description: 'Helps clients plan their financial future', level: 'senior' },
        { title: 'Bank Teller', description: 'Handles customer transactions and banking services', level: 'entry' },
        { title: 'Risk Manager', description: 'Identifies and manages financial risks', level: 'senior' }
      ];
    } else if (industryLower.includes('real estate') || industryLower.includes('property')) {
      return [
        { title: 'Real Estate Agent', description: 'Helps clients buy and sell properties', level: 'mid' },
        { title: 'Property Manager', description: 'Manages rental properties and tenants', level: 'mid' },
        { title: 'Real Estate Appraiser', description: 'Evaluates property values for transactions', level: 'senior' },
        { title: 'Leasing Consultant', description: 'Shows properties and handles lease agreements', level: 'entry' },
        { title: 'Real Estate Broker', description: 'Oversees real estate transactions and agents', level: 'senior' },
        { title: 'Property Coordinator', description: 'Coordinates property maintenance and services', level: 'mid' },
        { title: 'Real Estate Assistant', description: 'Supports real estate professionals', level: 'entry' },
        { title: 'Commercial Real Estate Agent', description: 'Specializes in commercial property transactions', level: 'senior' }
      ];
    } else if (industryLower.includes('construction') || industryLower.includes('building')) {
      return [
        { title: 'Construction Manager', description: 'Oversees construction projects and teams', level: 'senior' },
        { title: 'Project Engineer', description: 'Manages technical aspects of construction projects', level: 'mid' },
        { title: 'Site Supervisor', description: 'Supervises construction site operations', level: 'mid' },
        { title: 'Construction Coordinator', description: 'Coordinates project schedules and resources', level: 'mid' },
        { title: 'Safety Manager', description: 'Ensures workplace safety compliance', level: 'senior' },
        { title: 'Construction Assistant', description: 'Supports construction management activities', level: 'entry' },
        { title: 'Quality Control Inspector', description: 'Inspects construction quality and standards', level: 'mid' },
        { title: 'Construction Administrator', description: 'Handles administrative tasks for projects', level: 'mid' }
      ];
    } else if (industryLower.includes('retail') || industryLower.includes('commerce')) {
      return [
        { title: 'Store Manager', description: 'Oversees retail store operations', level: 'senior' },
        { title: 'Sales Associate', description: 'Assists customers and processes sales', level: 'entry' },
        { title: 'Inventory Manager', description: 'Manages product inventory and stock levels', level: 'mid' },
        { title: 'Customer Service Representative', description: 'Provides customer support and assistance', level: 'entry' },
        { title: 'Visual Merchandiser', description: 'Creates attractive product displays', level: 'mid' },
        { title: 'Retail Buyer', description: 'Selects and purchases products for stores', level: 'senior' },
        { title: 'Loss Prevention Specialist', description: 'Prevents theft and ensures security', level: 'mid' },
        { title: 'Retail Coordinator', description: 'Coordinates retail operations and activities', level: 'mid' }
      ];
    } else if (industryLower.includes('education') || industryLower.includes('learning')) {
      return [
        { title: 'Teacher', description: 'Educates students in various subjects', level: 'mid' },
        { title: 'Administrative Assistant', description: 'Supports educational administration', level: 'entry' },
        { title: 'Student Services Coordinator', description: 'Coordinates student support services', level: 'mid' },
        { title: 'Curriculum Developer', description: 'Develops educational programs and materials', level: 'senior' },
        { title: 'Academic Advisor', description: 'Guides students in academic planning', level: 'mid' },
        { title: 'Education Administrator', description: 'Manages educational institution operations', level: 'senior' },
        { title: 'Librarian', description: 'Manages library resources and services', level: 'mid' },
        { title: 'Education Coordinator', description: 'Coordinates educational programs and events', level: 'mid' }
      ];
    } else if (industryLower.includes('manufacturing') || industryLower.includes('production')) {
      return [
        { title: 'Production Manager', description: 'Oversees manufacturing production processes', level: 'senior' },
        { title: 'Quality Assurance Manager', description: 'Ensures product quality standards', level: 'senior' },
        { title: 'Manufacturing Engineer', description: 'Optimizes manufacturing processes', level: 'mid' },
        { title: 'Production Supervisor', description: 'Supervises production line operations', level: 'mid' },
        { title: 'Inventory Coordinator', description: 'Manages raw materials and finished goods', level: 'mid' },
        { title: 'Safety Coordinator', description: 'Ensures workplace safety in manufacturing', level: 'mid' },
        { title: 'Production Planner', description: 'Plans and schedules production activities', level: 'mid' },
        { title: 'Manufacturing Assistant', description: 'Supports manufacturing operations', level: 'entry' }
      ];
    } else {
      // Generic roles for unspecified industries
      return [
        { title: 'Project Manager', description: 'Manages projects and coordinates team activities', level: 'senior' },
        { title: 'Administrative Assistant', description: 'Provides administrative support', level: 'entry' },
        { title: 'Customer Service Representative', description: 'Provides customer support and assistance', level: 'entry' },
        { title: 'Sales Representative', description: 'Handles customer sales and relationship building', level: 'entry' },
        { title: 'Marketing Coordinator', description: 'Coordinates marketing activities and campaigns', level: 'mid' },
        { title: 'Data Analyst', description: 'Analyzes data to provide business insights', level: 'mid' },
        { title: 'Operations Manager', description: 'Oversees daily business operations', level: 'senior' },
        { title: 'Business Analyst', description: 'Analyzes business processes and requirements', level: 'mid' }
      ];
    }
  };
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced AI search function with proper request cancellation
  const searchWithAI = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Check if current query matches existing suggestions to avoid unnecessary API calls
    const queryLower = query.toLowerCase().trim();
    const hasMatchingSuggestion = suggestions.some(suggestion => 
      suggestion.title.toLowerCase().includes(queryLower) ||
      suggestion.description.toLowerCase().includes(queryLower)
    );

    if (hasMatchingSuggestion) {
      // Filter existing suggestions instead of making API call
      const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(queryLower) ||
        suggestion.description.toLowerCase().includes(queryLower)
      );
      setSuggestions(filteredSuggestions);
      setIsLoading(false);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      // Add timeout to fetch request (3 seconds - faster timeout)
      const fetchPromise = fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          type: 'role',
          industry: industry || undefined
        }),
        signal: controller.signal
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 8000)
      );
      
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      // Only handle errors if request wasn't aborted
      if (!controller.signal.aborted) {
        console.error('AI search error:', err);
        setError('Unable to load suggestions');
        setSuggestions([]);
      }
    } finally {
      // Only update loading state if this is still the current request
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [industry, suggestions]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only search if there's a query and it's not just whitespace
    if (searchQuery.trim() && searchQuery.length >= 2) {
      debounceTimeoutRef.current = setTimeout(() => {
        searchWithAI(searchQuery);
      }, 300); // 300ms debounce - more reasonable to prevent excessive calls
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]); // Removed searchWithAI from dependencies to prevent loop

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);

    // Show instant suggestions for industry-specific queries
    if (newValue.length >= 2) {
      const industryRoles = getIndustrySpecificRoles(industry);
      const filteredIndustry = industryRoles.filter(role =>
        role.title.toLowerCase().includes(newValue.toLowerCase()) ||
        role.description.toLowerCase().includes(newValue.toLowerCase())
      );
      
      if (filteredIndustry.length > 0) {
        setSuggestions(filteredIndustry);
        setIsLoading(false);
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AIRoleSuggestion) => {
    onChange(suggestion.title);
    setSearchQuery(suggestion.title);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    if (searchQuery.trim()) {
      searchWithAI(searchQuery);
    } else {
      // Show industry-specific role suggestions immediately when clicked
      const industryRoles = getIndustrySpecificRoles(industry);
      setSuggestions(industryRoles);
      setIsLoading(false);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowDropdown = isOpen && (suggestions.length > 0 || isLoading || error);


  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
      )}
      
      <div className="relative mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={inputRef}
            id={id}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="pl-10 pr-10"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isLoading ? (
              <ButtonLoader size={16} />
            ) : (
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>

        {/* AI Indicator */}
        {searchQuery.length >= 2 && (
          <div className="mt-2 text-xs text-lime-600 bg-lime-50 px-3 py-1 rounded-full inline-block">
            <Sparkles className="w-3 h-3 inline mr-1" />
            AI-powered suggestions
            {industry && (
              <span className="ml-2 text-lime-500">
                for {industry}
              </span>
            )}
          </div>
        )}

        {/* Dropdown */}
        {shouldShowDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="max-h-60 overflow-y-auto" ref={listRef}>
              {isLoading ? (
                 <div className="px-4 py-3 text-sm text-gray-500 text-center">
                   <div className="flex items-center space-x-2">
                     <ButtonLoader size={20} />
                     <span className="text-sm text-gray-600">AI is finding the best suggestions...</span>
                   </div>
                 </div>
              ) : error ? (
                <div className="px-4 py-3 text-sm text-red-500 text-center">
                  {error}
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  {/* Show header for common suggestions when no search query */}
                  {!searchQuery.trim() && (
                    <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {industry ? `${industry} roles` : 'Popular roles'}
                    </div>
                  )}
                  <ul className="py-1">
                    {suggestions.map((suggestion, index) => (
                    <li key={`${suggestion.title}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`w-full px-4 py-3 text-left hover:bg-lime-50 transition-colors ${
                          index === selectedIndex ? 'bg-lime-100' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <User className="w-4 h-4 text-lime-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="mb-1">
                              <div className="text-sm font-medium text-gray-900">
                                {suggestion.title}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {suggestion.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                </>
              ) : searchQuery.length >= 2 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No roles found matching "{searchQuery}"
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
