'use client';

import { useState } from 'react';
import { AIIndustryAutocomplete } from '@/components/ui/ai-industry-autocomplete';
import { AIRoleAutocomplete } from '@/components/ui/ai-role-autocomplete';
import { AIDescriptionGenerator } from '@/components/ui/ai-description-generator';
import { DescriptionDebug } from '@/components/ui/description-debug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestIndustryDropdown() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered Industry, Role & Description Generator
          </h1>
          <p className="text-gray-600">
            Test the complete AI-powered workflow: industry selection, role suggestions, and automatic description generation
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Industry Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AIIndustryAutocomplete
                value={selectedIndustry}
                onChange={setSelectedIndustry}
                label="Select your industry"
                placeholder="Start typing your industry..."
              />
              
              {selectedIndustry && (
                <div className="p-4 bg-lime-50 border border-lime-200 rounded-lg">
                  <h3 className="font-semibold text-lime-800 mb-2">Selected Industry:</h3>
                  <p className="text-lime-700">{selectedIndustry}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Role Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AIRoleAutocomplete
                value={selectedRole}
                onChange={setSelectedRole}
                industry={selectedIndustry}
                label="Select a role"
                placeholder="Start typing your role..."
              />
              
              {selectedRole && (
                <div className="p-4 bg-lime-50 border border-lime-200 rounded-lg">
                  <h3 className="font-semibold text-lime-800 mb-2">Selected Role:</h3>
                  <p className="text-lime-700">{selectedRole}</p>
                </div>
              )}

              {!selectedIndustry && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 Select an industry first to see industry-specific role suggestions!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">AI Description Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AIDescriptionGenerator
                value={roleDescription}
                onChange={setRoleDescription}
                roleTitle={selectedRole}
                industry={selectedIndustry}
                label="Role Description"
              />
              
              {roleDescription && (
                <div className="p-4 bg-lime-50 border border-lime-200 rounded-lg">
                  <h3 className="font-semibold text-lime-800 mb-2">Generated Description:</h3>
                  <p className="text-lime-700 text-sm whitespace-pre-wrap">{roleDescription}</p>
                </div>
              )}

              {!selectedRole && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    ✨ Select a role above to enable the "Generate Description" button!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Debug Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionDebug />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 space-y-2">
                <h4 className="font-medium mb-2">🤖 AI-Powered Features:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Intelligent Anticipation:</strong> AI predicts what you're typing</li>
                  <li><strong>Dynamic Suggestions:</strong> No hardcoded lists - AI generates suggestions</li>
                  <li><strong>Context-Aware:</strong> Role suggestions adapt to selected industry</li>
                  <li><strong>Manual Description Generation:</strong> AI creates detailed job descriptions on demand</li>
                  <li><strong>Smart Caching:</strong> 5-minute cache for faster responses</li>
                  <li><strong>Debounced Search:</strong> 300ms delay to avoid excessive API calls</li>
                  <li><strong>Real-time Processing:</strong> Shows "AI is thinking..." indicator</li>
                </ul>
                
                <h4 className="font-medium mb-2 mt-4">🎯 User Experience:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Type 2+ characters to trigger AI suggestions</li>
                  <li>Keyboard navigation (arrow keys, enter, escape)</li>
                  <li>Click to select from AI-generated dropdown</li>
                  <li>Role levels with visual badges (⭐ Entry, ⭐⭐ Mid, ⭐⭐⭐ Senior)</li>
                  <li>Manual or AI-generated detailed job descriptions</li>
                  <li>Edit/regenerate descriptions as needed</li>
                  <li>Visual indicators for AI-generated vs manual content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
