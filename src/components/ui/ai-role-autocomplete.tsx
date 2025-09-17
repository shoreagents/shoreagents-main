'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, User, Loader2, Sparkles, Star } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';

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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced AI search function
  const searchWithAI = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

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
          type: 'role',
          industry: industry || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('AI search error:', err);
      setError('Unable to load suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [industry]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      searchWithAI(searchQuery);
    }, 300); // 300ms debounce

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

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-yellow-100 text-yellow-800';
      case 'senior': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get level icon
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'entry': return '⭐';
      case 'mid': return '⭐⭐';
      case 'senior': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

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
              <Loader2 className="w-4 h-4 animate-spin" />
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
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  AI is thinking...
                </div>
              ) : error ? (
                <div className="px-4 py-3 text-sm text-red-500 text-center">
                  {error}
                </div>
              ) : suggestions.length > 0 ? (
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
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="text-sm font-medium text-gray-900">
                                {suggestion.title}
                              </div>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getLevelBadgeColor(suggestion.level)}`}>
                                {getLevelIcon(suggestion.level)} {suggestion.level}
                              </span>
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
