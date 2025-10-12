require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection with different keys...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Anon Key: ${anonKey ? anonKey.substring(0, 20) + '...' : 'NOT SET'}`)
  console.log(`✅ Service Key: ${serviceKey ? serviceKey.substring(0, 20) + '...' : 'NOT SET'}`)
  console.log('')
  
  // Test with anon key
  console.log('🔍 Testing with ANON key...')
  const supabaseAnon = createClient(supabaseUrl, anonKey)
  
  try {
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (anonError) {
      console.log(`❌ Anon key error: ${anonError.message}`)
    } else {
      console.log(`✅ Anon key works - ${anonData} records`)
    }
  } catch (error) {
    console.log(`❌ Anon key error: ${error.message}`)
  }
  
  // Test with service key
  console.log('\n🔍 Testing with SERVICE key...')
  const supabaseService = createClient(supabaseUrl, serviceKey)
  
  try {
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (serviceError) {
      console.log(`❌ Service key error: ${serviceError.message}`)
    } else {
      console.log(`✅ Service key works - ${serviceData} records`)
    }
  } catch (error) {
    console.log(`❌ Service key error: ${error.message}`)
  }
  
  // Test database connection with a simple query
  console.log('\n🔍 Testing database connection...')
  try {
    const { data: connectionTest, error: connectionError } = await supabaseService
      .rpc('version')
    
    if (connectionError) {
      console.log(`❌ Connection test error: ${connectionError.message}`)
    } else {
      console.log(`✅ Database connection successful`)
    }
  } catch (error) {
    console.log(`❌ Connection test error: ${error.message}`)
  }
  
  // Try to get table information using a different approach
  console.log('\n🔍 Trying to get table information...')
  try {
    // Try to get table names using a custom RPC function
    const { data: tables, error: tablesError } = await supabaseService
      .rpc('get_table_names')
    
    if (tablesError) {
      console.log(`❌ Table info error: ${tablesError.message}`)
      console.log('This is expected - the RPC function might not exist')
    } else {
      console.log(`✅ Table info: ${JSON.stringify(tables)}`)
    }
  } catch (error) {
    console.log(`❌ Table info error: ${error.message}`)
  }
  
  console.log('\n✅ Connection test completed!')
  console.log('\n💡 If you see permission errors, you may need to:')
  console.log('   1. Check your Supabase project settings')
  console.log('   2. Verify the service role key is correct')
  console.log('   3. Check if RLS (Row Level Security) is enabled')
  console.log('   4. Ensure the tables exist in your database')
}

testSupabaseConnection()


