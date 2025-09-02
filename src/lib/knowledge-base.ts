export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  category: 'service' | 'team' | 'company' | 'pricing' | 'process';
  url?: string;
  interestTags?: string[]; // Tags to identify user interests
  relatedServices?: string[]; // Related services that might interest the user
}

export const knowledgeBase: KnowledgeItem[] = [
  // Company Information
  {
    id: 'company-overview',
    title: 'About ShoreAgents',
    content: 'ShoreAgents is a leading outsourcing company that provides comprehensive business solutions. We help companies scale efficiently by offering expert teams and proven processes across various industries.',
    keywords: ['about', 'company', 'overview', 'who we are', 'shoreagents'],
    category: 'company',
    url: '/about'
  },
  
  // Services
  {
    id: 'real-estate-services',
    title: 'Real Estate Outsourcing',
    content: 'We provide comprehensive real estate support including property management, client relations, market research, lead generation, administrative tasks, and transaction support. Our team handles everything from initial client contact to closing deals.',
    keywords: ['real estate', 'property', 'realty', 'estate', 'property management', 'client relations'],
    category: 'service',
    url: '/services/real-estate-outsourcing',
    interestTags: ['realEstate'],
    relatedServices: ['property-management', 'customer-service', 'administrative-assistant']
  },
  
  {
    id: 'construction-services',
    title: 'Construction Outsourcing',
    content: 'Full-service construction support including project management, site supervision, quality control, safety compliance, administrative tasks, and vendor management. We help construction companies streamline operations and reduce costs.',
    keywords: ['construction', 'building', 'project management', 'site supervision', 'quality control'],
    category: 'service',
    url: '/services/construction-outsourcing',
    interestTags: ['construction'],
    relatedServices: ['engineering-support', 'project-management', 'administrative-assistant']
  },
  
  {
    id: 'legal-services',
    title: 'Legal Outsourcing',
    content: 'Professional legal support services including document preparation, legal research, case management, administrative assistance, and compliance support. Our legal teams are trained in various practice areas.',
    keywords: ['legal', 'law', 'legal support', 'document preparation', 'case management'],
    category: 'service',
    url: '/services/legal-outsourcing'
  },
  
  {
    id: 'finance-services',
    title: 'Finance & Accounting Outsourcing',
    content: 'Comprehensive financial services including bookkeeping, payroll processing, financial reporting, tax preparation, and accounting support. We help businesses maintain accurate financial records.',
    keywords: ['finance', 'accounting', 'bookkeeping', 'payroll', 'financial reporting', 'tax'],
    category: 'service',
    url: '/services/finance-accounting'
  },
  
  {
    id: 'marketing-services',
    title: 'Marketing Team Outsourcing',
    content: 'Full-service marketing support including digital marketing, content creation, social media management, SEO optimization, and campaign management. Our marketing teams help businesses grow their online presence.',
    keywords: ['marketing', 'digital marketing', 'social media', 'seo', 'content creation', 'campaigns'],
    category: 'service',
    url: '/services/marketing-team'
  },
  
  {
    id: 'graphic-design-services',
    title: 'Graphic Design Outsourcing',
    content: 'Professional graphic design services including logo design, marketing materials, website graphics, social media assets, and brand identity development. Our designers create visually appealing content that represents your brand.',
    keywords: ['graphic design', 'logo design', 'marketing materials', 'brand identity', 'visual content'],
    category: 'service',
    url: '/services/graphic-design-outsourcing'
  },
  
  // Team Information
  {
    id: 'stephen-atcheler',
    title: 'Stephen Atcheler - CEO',
    content: 'Stephen Atcheler is the CEO of ShoreAgents, leading the company with over 15 years of experience in business operations and outsourcing solutions. He has successfully built and scaled multiple businesses.',
    keywords: ['stephen atcheler', 'ceo', 'leadership', 'founder', 'executive'],
    category: 'team',
    url: '/about/leadership'
  },
  
  {
    id: 'charm-salas',
    title: 'Charm Salas - Chief Operating Officer',
    content: 'Charm Salas serves as our Chief Operating Officer, overseeing day-to-day operations and ensuring service quality. She has extensive experience in operations management and team leadership.',
    keywords: ['charm salas', 'coo', 'operations', 'chief operating officer'],
    category: 'team',
    url: '/about/team'
  },
  
  {
    id: 'kath-macenas',
    title: 'Kath Macenas - Head of Success',
    content: 'Kath Macenas leads our success team, ensuring client satisfaction and project success. She works closely with clients to understand their needs and deliver exceptional results.',
    keywords: ['kath macenas', 'head of success', 'client success', 'project management'],
    category: 'team',
    url: '/about/team'
  },
  
  // Pricing Information
  {
    id: 'pricing-overview',
    title: 'Pricing & Packages',
    content: 'We offer flexible pricing models including hourly rates, monthly packages, and custom solutions. Our pricing is competitive and transparent, with no hidden fees. Contact us for a personalized quote.',
    keywords: ['pricing', 'cost', 'rates', 'packages', 'prices', 'how much'],
    category: 'pricing',
    url: '/pricing'
  },
  
  // Process Information
  {
    id: 'how-it-works',
    title: 'How It Works',
    content: 'Our process is simple: 1) Initial consultation to understand your needs, 2) Team selection and onboarding, 3) Service delivery with regular updates, 4) Continuous improvement and optimization.',
    keywords: ['how it works', 'process', 'workflow', 'steps', 'procedure'],
    category: 'process',
    url: '/howItWorks'
  },
  
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'Getting started with ShoreAgents is easy. Simply contact us for a consultation, discuss your needs, and we\'ll create a customized solution. Our team will handle the rest while you focus on your core business.',
    keywords: ['getting started', 'start', 'begin', 'consultation', 'onboarding'],
    category: 'process',
    url: '/gettingstart'
  }
];

export function searchKnowledge(query: string): KnowledgeItem[] {
  const searchTerm = query.toLowerCase();
  
  return knowledgeBase
    .map(item => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm) ? 3 : 0;
      const contentMatch = item.content.toLowerCase().includes(searchTerm) ? 2 : 0;
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      ) ? 1 : 0;
      
      const score = titleMatch + contentMatch + keywordMatch;
      
      return { item, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item)
    .slice(0, 3); // Return top 3 matches
}
