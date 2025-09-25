'use client';

import { PricingCard } from '@/components/ui/ai-recommendation-cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPricingCard() {
  const handlePricingClick = () => {
    console.log('Pricing card clicked!');
    // You can add navigation logic here
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Pricing Card</h1>
      <p className="text-gray-600">This page tests the Pricing AI recommendation card with real quote data.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Pricing Card Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Pricing Card</h3>
              <PricingCard onClick={handlePricingClick} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm"><strong>If user has quotes:</strong> Shows most recent quote with total cost, member count, industry, and role preview</p>
          <p className="text-sm"><strong>If user has no quotes:</strong> Shows "No recent quotes" message</p>
          <p className="text-sm"><strong>Loading state:</strong> Shows loading spinner while fetching data</p>
          <p className="text-sm"><strong>Click action:</strong> Triggers onClick handler (can navigate to pricing page)</p>
        </CardContent>
      </Card>
    </div>
  );
}
