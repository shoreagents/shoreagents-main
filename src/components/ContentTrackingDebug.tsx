'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { contentTracker } from '@/lib/contentTrackingService';
import { useAuth } from '@/lib/auth-context';

export function ContentTrackingDebug() {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [formSubmissions, setFormSubmissions] = useState(0);
  const { appUser } = useAuth();

  useEffect(() => {
    // Get current tracking data
    const updateStats = () => {
      setScrollDepth(Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100));
    };

    // Update scroll depth on scroll
    const handleScroll = () => {
      updateStats();
    };

    // Initial update
    updateStats();


    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTestInteraction = async () => {
    await contentTracker.trackInteraction('test_page', 'content-tracking-test');
    setInteractionCount(prev => prev + 1);
  };

  const handleTestFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await contentTracker.trackFormSubmission('test_page', 'content-tracking-test');
    setFormSubmissions(prev => prev + 1);
  };

  const handleTestUpdate = async () => {
    await contentTracker.updateContentView({
      content_type: 'test_page',
      content_id: 'content-tracking-test'
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white shadow-lg border-lime-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Content Tracking Debug</CardTitle>
          <CardDescription className="text-xs">
            Real-time tracking data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Scroll:</span>
              <Badge variant="outline" className="ml-1">{scrollDepth}%</Badge>
            </div>
            <div>
              <span className="text-gray-600">Interactions:</span>
              <Badge variant="outline" className="ml-1">{interactionCount}</Badge>
            </div>
            <div>
              <span className="text-gray-600">Forms:</span>
              <Badge variant="outline" className="ml-1">{formSubmissions}</Badge>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">User ID:</span>
              <Badge variant="outline" className="ml-1 text-xs truncate max-w-32">
                {appUser?.user_id ? appUser.user_id.slice(-12) : 'Anonymous'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              size="sm" 
              onClick={handleTestInteraction}
              className="w-full text-xs"
            >
              Test Interaction
            </Button>
            
            <form onSubmit={handleTestFormSubmit}>
              <Button 
                type="submit"
                size="sm" 
                variant="outline"
                className="w-full text-xs"
              >
                Test Form Submit
              </Button>
            </form>
            
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleTestUpdate}
              className="w-full text-xs"
            >
              Force Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
