// Test file to demonstrate BPOC integration console logging
import { getCandidateRecommendations, getSalaryRange } from './bpocPricingService'

export async function testBpocIntegration() {
  console.log('🧪 Testing BPOC Integration...')
  
  // Test different roles and levels
  const testCases = [
    { role: 'Web Developer', level: 'senior' as const },
    { role: 'Content Writer', level: 'entry' as const },
    { role: 'Graphic Designer', level: 'mid' as const },
    { role: 'Customer Support', level: 'entry' as const },
    { role: 'Project Manager', level: 'senior' as const }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.role} (${testCase.level})`)
    
    try {
      const recommendations = await getCandidateRecommendations(
        testCase.role, 
        testCase.level, 
        'Technology'
      )
      
      const salaryRange = await getSalaryRange(testCase.role, testCase.level)
      
      console.log(`📊 Results for ${testCase.role}:`, {
        totalCandidates: recommendations.totalCandidates,
        recommendedCandidates: recommendations.recommendedCandidates.length,
        averageSalary: recommendations.averageSalary,
        salaryRange: salaryRange,
        isMatched: recommendations.totalCandidates > 0
      })
      
    } catch (error) {
      console.error(`❌ Error testing ${testCase.role}:`, error)
    }
  }
  
  console.log('\n✅ BPOC Integration test completed!')
}

// Uncomment to run test
// testBpocIntegration()
