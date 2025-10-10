require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Anon Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NOT SET'}`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    console.log('\n📋 Testing table access...')
    
    // Test users table
    const { data: users, error: usersError, count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1)
    
    if (usersError) {
      console.log(`❌ Users table error: ${usersError.message}`)
    } else {
      console.log(`✅ Users table accessible - ${usersCount} total records`)
    }
    
    // Test pricing_quotes table
    const { data: quotes, error: quotesError, count: quotesCount } = await supabase
      .from('pricing_quotes')
      .select('*', { count: 'exact' })
      .limit(1)
    
    if (quotesError) {
      console.log(`❌ Pricing quotes table error: ${quotesError.message}`)
    } else {
      console.log(`✅ Pricing quotes table accessible - ${quotesCount} total records`)
    }
    
    console.log('\n✅ Database connection test completed!')
    console.log('💡 If this works but Prisma Studio doesn\'t, the issue is with Prisma Studio configuration.')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testDatabaseConnection()
