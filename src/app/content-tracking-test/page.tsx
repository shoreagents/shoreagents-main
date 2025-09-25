'use client';

import { useState } from 'react';
import { SideNav } from '@/components/layout/SideNav';
import { ContentTracker } from '@/components/ContentTracker';
import { useContentTracking } from '@/hooks/useContentTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointer, FileText, TrendingUp } from 'lucide-react';
import { ContentTrackingDebug } from '@/components/ContentTrackingDebug';

export default function ContentTrackingTestPage() {
  const [interactionCount, setInteractionCount] = useState(0);
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);

  const { trackSectionView, trackFormSubmission, trackInteraction } = useContentTracking({
    contentType: 'test_page',
    contentId: 'content-tracking-test',
    contentTitle: 'Content Tracking Test Page',
    autoTrack: true
  });

  const handleSectionClick = async (section: string) => {
    await trackSectionView(section);
    alert(`Tracked section view: ${section}`);
  };

  const handleInteractionClick = async () => {
    setInteractionCount(prev => prev + 1);
    await trackInteraction('button_click');
    alert(`Tracked interaction! Total: ${interactionCount + 1}`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmissionCount(prev => prev + 1);
    await trackFormSubmission('test_form');
    alert(`Tracked form submission! Total: ${formSubmissionCount + 1}`);
  };

  return (
    <ContentTracker 
      contentType="test_page" 
      contentId="content-tracking-test" 
      contentTitle="Content Tracking Test Page"
      pageSection="main"
    >
      <div className="min-h-screen bg-gray-50 py-12">
        <SideNav />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Content Tracking Test Page
            </h1>
            <p className="text-lg text-gray-600">
              This page demonstrates the content tracking functionality. Check your database to see the tracked data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tracking Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-lime-600" />
                  Tracking Stats
                </CardTitle>
                <CardDescription>
                  Current session tracking data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interactions:</span>
                    <Badge variant="secondary">{interactionCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Form Submissions:</span>
                    <Badge variant="secondary">{formSubmissionCount}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-lime-600" />
                  Test Actions
                </CardTitle>
                <CardDescription>
                  Click these buttons to test tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={handleInteractionClick}
                    className="w-full"
                    variant="outline"
                  >
                    Track Interaction
                  </Button>
                  <Button 
                    onClick={() => handleSectionClick('hero')}
                    className="w-full"
                    variant="outline"
                  >
                    Track Hero Section
                  </Button>
                  <Button 
                    onClick={() => handleSectionClick('features')}
                    className="w-full"
                    variant="outline"
                  >
                    Track Features Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-lime-600" />
                Test Form
              </CardTitle>
              <CardDescription>
                Submit this form to test form submission tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Form (Track Submission)
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-lime-600" />
                How to Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>1. <strong>Page View:</strong> This page automatically tracks when you visit it</p>
                <p>2. <strong>Scroll Tracking:</strong> Scroll down to see scroll depth tracking</p>
                <p>3. <strong>Interaction Tracking:</strong> Click the "Track Interaction" button</p>
                <p>4. <strong>Section Tracking:</strong> Click the section tracking buttons</p>
                <p>5. <strong>Form Tracking:</strong> Submit the test form</p>
                <p>6. <strong>Duration Tracking:</strong> Stay on the page to see duration tracking</p>
                <p>7. <strong>Check Database:</strong> Query your content_views table to see the data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Debug Component */}
      <ContentTrackingDebug />
    </ContentTracker>
  );
}
