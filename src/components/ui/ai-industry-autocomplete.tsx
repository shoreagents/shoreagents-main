'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, Building2, Loader2, Sparkles } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';

interface AISuggestion {
  name: string;
  category: string;
  description: string;
}

interface AIIndustryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

export function AIIndustryAutocomplete({
  value,
  onChange,
  placeholder = "Start typing your industry...",
  label,
  className = "",
  id
}: AIIndustryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common industries for instant suggestions
  const commonIndustries: AISuggestion[] = [
    { name: 'Technology', category: 'IT & Software', description: 'Software development, IT services, and technology solutions' },
    { name: 'Real Estate', category: 'Property', description: 'Property management, real estate services, and construction' },
    { name: 'Healthcare', category: 'Medical', description: 'Healthcare services, medical practices, and wellness' },
    { name: 'Finance', category: 'Financial Services', description: 'Banking, accounting, and financial advisory services' },
    { name: 'Marketing', category: 'Digital Marketing', description: 'Digital marketing, advertising, and brand management' },
    { name: 'E-commerce', category: 'Online Retail', description: 'Online stores, marketplaces, and digital commerce' },
    { name: 'Education', category: 'Learning', description: 'Educational institutions, training, and e-learning' },
    { name: 'Legal', category: 'Legal Services', description: 'Law firms, legal consulting, and compliance services' }
  ];
  
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
      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          type: 'industry'
        }),
        signal: controller.signal
      });

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
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      searchWithAI(searchQuery);
    }, 150); // 150ms debounce - faster response

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, searchWithAI]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);

    // Show instant suggestions for common queries
    if (newValue.length >= 2) {
      const filteredCommon = commonIndustries.filter(industry =>
        industry.name.toLowerCase().includes(newValue.toLowerCase()) ||
        industry.category.toLowerCase().includes(newValue.toLowerCase())
      );
      
      if (filteredCommon.length > 0) {
        setSuggestions(filteredCommon);
        setIsLoading(false);
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    onChange(suggestion.name);
    setSearchQuery(suggestion.name);
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
      // Show instant suggestions first
      const filteredCommon = commonIndustries.filter(industry =>
        industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredCommon.length > 0) {
        setSuggestions(filteredCommon);
        setIsLoading(false);
      } else {
        searchWithAI(searchQuery);
      }
    } else {
      // Show all common industries when focused with empty input
      setSuggestions(commonIndustries);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 100); // Faster blur response
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

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
              <Loader2 className="w-4 h-4 animate-spin" style={{ animationDuration: '0.8s' }} />
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
          </div>
        )}

        {/* Dropdown */}
        {shouldShowDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="max-h-60 overflow-y-auto" ref={listRef}>
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" style={{ animationDuration: '0.8s' }} />
                  AI is thinking...
                </div>
              ) : error ? (
                <div className="px-4 py-3 text-sm text-red-500 text-center">
                  {error}
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={`${suggestion.name}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`w-full px-4 py-3 text-left hover:bg-lime-50 transition-colors ${
                          index === selectedIndex ? 'bg-lime-100' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-lime-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {suggestion.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {suggestion.category}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {suggestion.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length >= 2 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No industries found matching "{searchQuery}"
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
