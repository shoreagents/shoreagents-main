import { SideNav } from "@/components/layout/SideNav";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, Building, Target, Zap, Shield, Clock } from "lucide-react";
import { ContentTracker } from "@/components/ContentTracker";

const caseStudies = [
  {
    id: "business-referral-partnerships",
    title: "Business Referral Partnerships",
    description: "How we built successful business referral partnerships that drive mutual growth and success.",
    category: "Partnerships",
    icon: Users,
    featured: true
  },
  {
    id: "construction-cost-reduction",
    title: "Construction Cost Reduction",
    description: "How we helped construction companies reduce costs through strategic offshore staffing solutions.",
    category: "Cost Reduction",
    icon: TrendingUp,
    featured: true
  },
  {
    id: "team-expansion-success",
    title: "Team Expansion Success",
    description: "This case study showcases how we successfully helped a client expand their team through our offshore staffing solutions.",
    category: "Growth",
    icon: Users,
    featured: false
  },
  {
    id: "customer-service-scaling",
    title: "Customer Service Scaling",
    description: "Learn how we helped a client scale their customer service operations efficiently through our offshore team solutions.",
    category: "Scaling",
    icon: Building,
    featured: false
  },
  {
    id: "business-growth-through-offshore-staffing",
    title: "Business Growth Through Offshore Staffing",
    description: "Discover how offshore staffing solutions drove significant business growth for our clients.",
    category: "Growth",
    icon: TrendingUp,
    featured: false
  },
  {
    id: "gradual-team-scaling-success",
    title: "Gradual Team Scaling Success",
    description: "A detailed look at how gradual team scaling helped our client achieve sustainable growth.",
    category: "Scaling",
    icon: Target,
    featured: false
  },
  {
    id: "long-term-partnership-success",
    title: "Long-Term Partnership Success",
    description: "Explore the benefits and results of long-term partnerships with ShoreAgents.",
    category: "Partnerships",
    icon: Shield,
    featured: false
  },
  {
    id: "exceptional-team-performance",
    title: "Exceptional Team Performance",
    description: "Learn how our teams deliver exceptional performance that exceeds client expectations.",
    category: "Performance",
    icon: Zap,
    featured: false
  },
  {
    id: "hiring-success-after-failures",
    title: "Hiring Success After Failures",
    description: "How we helped a client achieve hiring success after previous recruitment failures.",
    category: "Recruitment",
    icon: Users,
    featured: false
  },
  {
    id: "reliable-recruitment-partner",
    title: "Reliable Recruitment Partner",
    description: "Discover why clients choose ShoreAgents as their reliable recruitment partner.",
    category: "Recruitment",
    icon: Shield,
    featured: false
  },
  {
    id: "mortgage-industry-transformation",
    title: "Mortgage Industry Transformation",
    description: "How we helped transform a mortgage company's operations through strategic offshore staffing.",
    category: "Transformation",
    icon: Building,
    featured: false
  },
  {
    id: "immediate-business-transformation",
    title: "Immediate Business Transformation",
    description: "A case study showing how rapid implementation of offshore solutions transformed a business immediately.",
    category: "Transformation",
    icon: Zap,
    featured: false
  },
  {
    id: "offshore-staffing-success",
    title: "Offshore Staffing Success",
    description: "Comprehensive case study showcasing the success of our offshore staffing solutions.",
    category: "Success",
    icon: TrendingUp,
    featured: false
  },
  {
    id: "smooth-recruitment-process",
    title: "Smooth Recruitment Process",
    description: "How we streamlined the recruitment process for our clients, making it smooth and efficient.",
    category: "Process",
    icon: Clock,
    featured: false
  },
  {
    id: "successful-trial-hiring",
    title: "Successful Trial Hiring",
    description: "Learn about our successful trial hiring process and how it benefits our clients.",
    category: "Recruitment",
    icon: Users,
    featured: false
  },
  {
    id: "streamline-back-office",
    title: "Streamline Back Office",
    description: "How we helped streamline back office operations for improved efficiency and cost savings.",
    category: "Efficiency",
    icon: Target,
    featured: false
  },
  {
    id: "quick-staff-onboarding",
    title: "Quick Staff Onboarding",
    description: "Our efficient onboarding process ensures new staff members are productive quickly.",
    category: "Process",
    icon: Clock,
    featured: false
  },
  {
    id: "appraisal-listings-volume-increase",
    title: "Appraisal Listings Volume Increase",
    description: "How our team helped increase appraisal listings volume for a real estate client.",
    category: "Growth",
    icon: TrendingUp,
    featured: false
  },
  {
    id: "business-systems-implementation-success",
    title: "Business Systems Implementation Success",
    description: "A detailed case study on successful business systems implementation with our offshore team.",
    category: "Implementation",
    icon: Building,
    featured: false
  },
  {
    id: "easy-business-process-implementation",
    title: "Easy Business Process Implementation",
    description: "How we made business process implementation easy and seamless for our clients.",
    category: "Implementation",
    icon: Target,
    featured: false
  },
  {
    id: "marketing-automation-implementation",
    title: "Marketing Automation Implementation",
    description: "Success story of implementing marketing automation solutions with our offshore team.",
    category: "Implementation",
    icon: Zap,
    featured: false
  },
  {
    id: "mobile-business-solutions",
    title: "Mobile Business Solutions",
    description: "How we developed and implemented mobile business solutions for our clients.",
    category: "Solutions",
    icon: Building,
    featured: false
  },
  {
    id: "hands-off-business-procedures",
    title: "Hands-Off Business Procedures",
    description: "How we implemented hands-off business procedures that allow clients to focus on growth.",
    category: "Efficiency",
    icon: Shield,
    featured: false
  },
  {
    id: "industry-expert-validation",
    title: "Industry Expert Validation",
    description: "How industry experts validate our offshore staffing solutions and client success stories.",
    category: "Validation",
    icon: Shield,
    featured: false
  }
];

export default function CaseStudiesPage() {
  return (
    <ContentTracker 
      contentType="page" 
      contentId="case-studies" 
      contentTitle="Success Stories & Case Studies"
      pageSection="main"
    >
      <div className="min-h-screen bg-gray-50">
        <SideNav />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-lime-50 to-lime-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Title and Subtitle */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Success Stories & Case Studies
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Discover how ShoreAgents has helped businesses across various industries achieve remarkable growth, 
                cost savings, and operational excellence through our offshore staffing solutions.
              </p>
            </div>
            
            {/* Right Side - Featured Case Study Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md group hover:shadow-xl transition-all duration-300 border-lime-200 hover:border-lime-400">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Business team collaboration"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-lime-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-lime-600" />
                    </div>
                    <Badge variant="secondary" className="bg-lime-100 text-lime-700 border-lime-200">
                      Partnerships
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-lime-700 transition-colors">
                    Business Referral Partnerships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    How we built successful business referral partnerships that drive mutual growth and success.
                  </CardDescription>
                  <Link 
                    href="/case-studies/business-referral-partnerships"
                    className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium group-hover:gap-2 transition-all duration-200"
                  >
                    Read Case Study
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Case Studies */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More Featured Case Studies</h2>
            <p className="text-lg text-gray-600">Additional success stories from our clients</p>
          </div>
          
          <div className="flex justify-center mb-16">
            {caseStudies.filter(study => study.featured && study.id !== "business-referral-partnerships").map((study) => {
              const IconComponent = study.icon;
              return (
                <Card key={study.id} className="group hover:shadow-lg transition-all duration-300 border-lime-200 hover:border-lime-400 max-w-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center group-hover:bg-lime-200 transition-colors">
                        <IconComponent className="w-5 h-5 text-lime-600" />
                      </div>
                      <Badge variant="secondary" className="bg-lime-100 text-lime-700 border-lime-200">
                        {study.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-lime-700 transition-colors">
                      {study.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                      {study.description}
                    </CardDescription>
                    <Link 
                      href={`/case-studies/${study.id}`}
                      className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium group-hover:gap-2 transition-all duration-200"
                    >
                      Read Case Study
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Case Studies */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Case Studies</h2>
            <p className="text-lg text-gray-600">Explore our complete collection of success stories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => {
              const IconComponent = study.icon;
              return (
                <Card key={study.id} className="group hover:shadow-md transition-all duration-300 border-gray-200 hover:border-lime-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-lime-100 transition-colors">
                        <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-lime-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {study.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-lime-700 transition-colors line-clamp-2">
                      {study.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {study.description}
                    </CardDescription>
                    <Link 
                      href={`/case-studies/${study.id}`}
                      className="inline-flex items-center text-sm text-lime-600 hover:text-lime-700 font-medium group-hover:gap-1 transition-all duration-200"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-lime-600 to-lime-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Own Success Story?
          </h2>
          <p className="text-xl text-lime-100 mb-8">
            Join hundreds of businesses that have transformed their operations with ShoreAgents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-lime-700 font-semibold rounded-lg hover:bg-lime-50 transition-colors"
            >
              Get Started Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-lime-700 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
      </div>
    </ContentTracker>
  )
}
