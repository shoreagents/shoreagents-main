'use client';

import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

export function DescriptionDebug() {
  const [roleTitle, setRoleTitle] = useState('Medical Virtual Assistant');
  const [industry, setIndustry] = useState('Healthcare');
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'generate',
          type: 'description',
          industry: industry,
          roleTitle: roleTitle
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testSimpleAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleTitle: roleTitle,
          industry: industry
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Description API Debug</h3>
      
      <div className="space-y-2">
        <Label>Role Title</Label>
        <Input
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Enter role title"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Industry</Label>
        <Input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Enter industry"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={testAPI} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test AI API'}
        </Button>
        <Button onClick={testSimpleAPI} disabled={isLoading} variant="outline">
          {isLoading ? 'Testing...' : 'Test Simple API'}
        </Button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result != null && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <strong>Result:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
