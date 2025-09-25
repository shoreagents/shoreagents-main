// Debug script to test content tracking
// Run this in the browser console to test the tracking service

async function testContentTracking() {
  console.log('=== Testing Content Tracking ===');
  
  try {
    // Import the content tracker
    const { contentTracker } = await import('/src/lib/contentTrackingService.ts');
    
    console.log('Content tracker imported successfully');
    
    // Test basic tracking
    const testData = {
      content_type: 'test_page',
      content_id: 'debug-test',
      content_title: 'Debug Test Page',
      page_section: 'main'
    };
    
    console.log('Testing with data:', testData);
    
    const result = await contentTracker.trackContentView(testData);
    console.log('Tracking result:', result);
    
  } catch (error) {
    console.error('Error testing content tracking:', error);
  }
}

// Also test Supabase connection
async function testSupabaseConnection() {
  console.log('=== Testing Supabase Connection ===');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Supabase Key:', supabaseKey ? 'Set' : 'Missing');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('content_views')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful');
    }
    
  } catch (error) {
    console.error('Error testing Supabase:', error);
  }
}

// Run tests
testSupabaseConnection();
testContentTracking();
