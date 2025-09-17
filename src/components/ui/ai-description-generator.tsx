'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, RefreshCw, Edit3 } from 'lucide-react';
import { Label } from './label';

interface AIDescriptionGeneratorProps {
  value: string;
  onChange: (value: string) => void;
  roleTitle: string;
  industry: string;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  onSave?: () => void;
}

export function AIDescriptionGenerator({
  value,
  onChange,
  roleTitle,
  industry,
  label = "Role Description",
  placeholder = "AI will generate a description based on the role title...",
  className = "",
  id,
  onSave
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastGeneratedRef = useRef<string>('');

  // Remove auto-generation - user will manually trigger generation

  const generateDescription = async (isAnother = false) => {
    if (!roleTitle.trim()) {
      setError('Please enter a role title first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    if (!isAnother) {
      lastGeneratedRef.current = roleTitle;
    }

    try {
      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'generate',
          type: 'description',
          industry: industry || undefined,
          roleTitle: roleTitle.trim(),
          generateAnother: isAnother,
          generationCount: isAnother ? generationCount + 1 : 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const description = data.suggestions;
      
      if (description && typeof description === 'string' && description.trim()) {
        onChange(description);
        setHasGenerated(true);
        setIsEditing(false);
        if (isAnother) {
          setGenerationCount(prev => prev + 1);
        } else {
          setGenerationCount(1);
        }
      } else {
        throw new Error('Invalid or empty description received');
      }
    } catch (err) {
      console.error('Description generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Unable to generate description: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setIsEditing(false);
    if (onSave) {
      onSave();
    }
  };

  const handleGenerateClick = () => {
    generateDescription();
  };

  const handleRegenerate = () => {
    generateDescription();
  };

  const handleGenerateAnother = () => {
    generateDescription(true);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setIsSaved(false);
    // Don't change hasGenerated state when user types manually
  };

  const handleTextareaBlur = () => {
    if (value.trim()) {
      setIsEditing(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Action Buttons in one compact row */}
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <div className="flex items-center space-x-1">
          {roleTitle.trim() && (
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="text-xs bg-lime-600 hover:bg-lime-700 text-white px-2 py-1.5 rounded-md flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
          )}
          {value.trim() && hasGenerated && !isEditing && (
            <button
              type="button"
              onClick={handleGenerateAnother}
              disabled={isGenerating}
              className="text-xs bg-lime-600 hover:bg-lime-700 text-white px-2 py-1.5 rounded-md flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Another'}</span>
            </button>
          )}
          {value.trim() && !isEditing && (
            <button
              type="button"
              onClick={handleManualEdit}
              className="text-xs text-gray-600 hover:text-gray-700 flex items-center space-x-1 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-50"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={handleTextareaChange}
          onBlur={handleTextareaBlur}
          placeholder="Enter role description manually or click 'Generate Description' to use AI..."
          className={`w-full px-3 py-2 pr-20 border rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none transition-all ${
            isGenerating ? 'bg-gray-50' : 'bg-white'
          } ${error ? 'border-red-300' : 'border-gray-300'} ${className}`}
          disabled={isGenerating}
        />
        
        {/* Save button in lower right */}
        {value.trim() && isEditing && (
          <button
            type="button"
            onClick={handleSave}
            className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
          >
            <span>💾</span>
            <span>Save</span>
          </button>
        )}
        
        {isGenerating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
            <div className="flex items-center space-x-2 text-lime-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is generating description...</span>
            </div>
          </div>
        )}
      </div>

      {/* Compact Status Indicators */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {hasGenerated && !isEditing && (
            <span className="text-lime-600 bg-lime-50 px-2 py-1 rounded-full">✨ AI Generated</span>
          )}
          {isEditing && (
            <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full">✏️ Editing</span>
          )}
          {isSaved && !hasGenerated && (
            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full">💾 Saved</span>
          )}
          {value.trim() && !hasGenerated && !isEditing && (
            <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded-full">✏️ Manual</span>
          )}
        </div>
        
        {value.trim() && hasGenerated && !isEditing && (
          <span className="text-lime-600 bg-lime-50 px-2 py-1 rounded-full">
            🔄 Try "Another" for variations
            {generationCount > 1 && <span className="ml-1">(#{generationCount})</span>}
          </span>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-xs bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
