"use client";

import Image from "next/image";
import { SideNav } from "@/components/layout/SideNav";
import { Carousel } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useCurrency } from "@/lib/currencyContext";
import { EmployeeCard } from "@/components/ui/employee-card";
import { ResumeModal } from "@/components/ui/resume-modal";
import { EmployeeCardData, ResumeGenerated } from "@/types/api";
import { getEmployeeCardData } from "@/lib/api";

export default function Home() {
  const [isShoreAgentsWay, setIsShoreAgentsWay] = useState(true);
  const { selectedCurrency, convertPrice, formatPrice } = useCurrency();
  
  // State for top employees
  const [topEmployees, setTopEmployees] = useState<EmployeeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<ResumeGenerated | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const brandLogos = [
    { name: 'Gallery Homes', logo: '/Global Brands/Gallery-Homes.webp' },
    { name: 'BoxBrownie', logo: '/Global Brands/BoxBrownie.webp' },
    { name: 'Ballast', logo: '/Global Brands/Ballast.webp' },
    { name: 'Harcourts', logo: '/Global Brands/Harcourts.webp' },
    { name: 'Compass', logo: '/Global Brands/Compass.webp' },
    { name: 'Arizto', logo: '/Global Brands/Arizto.webp' },
    { name: 'McGrath', logo: '/Global Brands/McGrath.webp' },
    { name: 'Barry Plant', logo: '/Global Brands/BarryPlant.webp' },
    { name: 'Bayleys', logo: '/Global Brands/Bayleys.webp' },
    { name: 'Bellarine', logo: '/Global Brands/Bellarine.webp' },
    { name: 'Charles Lloyd Property Group', logo: '/Global Brands/Charles-Lloyd-Property-Group.webp' },
    { name: 'Crowdcopia', logo: '/Global Brands/Crowdcopia.webp' },
    { name: 'EVES Realty', logo: '/Global Brands/EVES-Realty-Ltd.webp' },
    { name: 'Gateway Property Management', logo: '/Global Brands/Gateway-Property-Management.webp' },
    { name: 'Glide', logo: '/Global Brands/Glide.webp' },
    { name: 'Granite Peak Multifamily', logo: '/Global Brands/Granite-Peak-Multifamily-Logo.webp' },
    { name: 'Legali Law', logo: '/Global Brands/Legali-Law.webp' },
    { name: 'Princeton International Properties', logo: '/Global Brands/Princeton-International-Properties.webp' },
    { name: 'Proofreading LLC', logo: '/Global Brands/Proofreading-LLC.webp' },
    { name: 'Property Partner 365', logo: '/Global Brands/Property-Partner-365.webp' },
    { name: 'PTLA Real Estate Group', logo: '/Global Brands/PTLA-Real-Estate-Group.webp' },
    { name: 'Schultz Realty', logo: '/Global Brands/Schultz-Realty-Ltd-Maungaturoto.webp' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const div = entry.target as HTMLElement;
          div.style.opacity = '1';
          
          // Animate header
          const header = div.querySelector('#responsibilities-header') as HTMLElement;
          if (header) {
            setTimeout(() => {
              header.style.opacity = '1';
            }, 200);
          }
          
          // Animate cards
          const weHandleCard = div.querySelector('#we-handle-card') as HTMLElement;
          const youHandleCard = div.querySelector('#you-handle-card') as HTMLElement;
          
          if (weHandleCard) {
            setTimeout(() => {
              weHandleCard.style.opacity = '1';
            }, 400);
          }
          
          if (youHandleCard) {
            setTimeout(() => {
              youHandleCard.style.opacity = '1';
            }, 600);
          }
          
          observer.unobserve(div);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    const responsibilitiesDiv = document.getElementById('responsibilities-div');
    if (responsibilitiesDiv) {
      observer.observe(responsibilitiesDiv);
    }
    
    return () => observer.disconnect();
  }, []);

  // Fetch top employees
  useEffect(() => {
    const fetchTopEmployees = async () => {
      try {
        const data = await getEmployeeCardData();
        // Get top 3 employees (you can modify this logic based on your criteria)
        const top3 = data.slice(0, 3);
        setTopEmployees(top3);
      } catch (error) {
        console.error('Error fetching top employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEmployees();
  }, []);

  const handleViewDetails = (employee: EmployeeCardData) => {
    console.log('View details for:', employee.user.full_name);
  };

  const handleViewResume = (resume: ResumeGenerated) => {
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
  };

  return (
            <div className="min-h-screen bg-gray-50">
          <SideNav />
                      {/* Hero Section - Full Viewport Height */}
            <section className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Philippines Got TALENT!
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  University-educated, office-based Filipino professionals with transparent pricing. AI-powered recruitment finds perfect matches in 7 days.
                </p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => window.location.href = '/employees'}
                    className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer"
                  >
                    View Our Talent Pool
                  </button>
                  <button className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-sm font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer">
                    Discover Your Perfect Match
                  </button>
                </div>
              </div>
            </section>

                        {/* Main Content Section */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-3">
              <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Our Proven Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">Actually Works</span>
            </h2>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto italic">
              &quot;I&apos;ve done all the dumb things, so you don&apos;t have to. Here&apos;s the systematic approach that actually works.&quot;
            </p>
            
            {/* Key Features */}
            <div className="inline-flex h-14 items-center px-6 py-2 bg-lime-100 border border-lime-300 rounded-xl shadow-sm mb-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    <span className="font-medium">7 days to hire</span>
                    <span className="font-normal text-gray-600"> (not 4 weeks)</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    <span className="font-medium">Office-based</span>
                    <span className="font-normal text-gray-600"> (not home-based)</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    <span className="font-medium">Staff leasing</span>
                    <span className="font-normal text-gray-600"> (we handle infrastructure)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Process Cards Carousel */}
          <Carousel itemsPerSlide={3} className="flex-1 -pt-20">
            {/* Card 1: Initial Consultation */}
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 group relative h-full flex flex-col">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
              </div>
              <div className="flex items-start mb-4 pt-12">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">Initial Consultation</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-1">
                We dive deep into your business needs, challenges, and growth objectives to understand exactly what you need.
              </p>
              <div className="relative bg-lime-50 rounded-xl p-3 border border-lime-200 mt-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-600 rounded-l-xl"></div>
                <p className="text-gray-700 italic text-xs font-medium">
                  Reality: Typically 45-60 minutes - we ask the tough questions upfront
                </p>
              </div>
            </div>

            {/* Card 2: AI-Powered Candidate Sourcing */}
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 group relative h-full flex flex-col">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
              </div>
              <div className="flex items-start mb-4 pt-12">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">AI-Powered Candidate Sourcing</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-1">
                Our recruitment system searches 25,000+ candidate database using AI matching to find your perfect fit.
              </p>
              <div className="relative bg-lime-50 rounded-xl p-3 border border-lime-200 mt-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-600 rounded-l-xl"></div>
                <p className="text-gray-700 italic text-xs font-medium">
                  Reality: We cast the net wide, then filter hard
                </p>
              </div>
            </div>

            {/* Card 3: Video Interview Process */}
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 group relative h-full flex flex-col">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
              </div>
              <div className="flex items-start mb-4 pt-12">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">Video Interview Process</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-1">
                You interview 2-3 pre-screened candidates via video call. We handle all the tough questions beforehand.
              </p>
              <div className="relative bg-lime-50 rounded-xl p-3 border border-lime-200 mt-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-600 rounded-l-xl"></div>
                <p className="text-gray-700 italic text-xs font-medium">
                  Reality: Save time - you only meet the best matches
                </p>
              </div>
            </div>

            {/* Card 4: Selection & Setup */}
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 group relative h-full flex flex-col">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
              </div>
              <div className="flex items-start mb-4 pt-12">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">Selection & Setup</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-1">
                Choose your preferred candidate, we handle contracts, workspace setup, and infrastructure.
              </p>
              <div className="relative bg-lime-50 rounded-xl p-3 border border-lime-200 mt-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-600 rounded-l-xl"></div>
                <p className="text-gray-700 italic text-xs font-medium">
                  Reality: We do the paperwork, you focus on business
                </p>
              </div>
            </div>

            {/* Card 5: Training & Integration */}
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 group relative h-full flex flex-col">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  5
                </div>
              </div>
              <div className="flex items-start mb-4 pt-12">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">Training & Integration</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-1">
                You train them your way. We provide the office, tech, and ongoing support structure.
              </p>
              <div className="relative bg-lime-50 rounded-xl p-3 border border-lime-200 mt-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-600 rounded-l-xl"></div>
                <p className="text-gray-700 italic text-xs font-medium">
                  Reality: YOU train, WE provide infrastructure
                </p>
              </div>
            </div>

            {/* Card 6: Scale Your Team */}
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 group relative h-full flex flex-col">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  6
                </div>
              </div>
              <div className="flex items-start mb-4 pt-12">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">Scale Your Team</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-1">
                Add more specialists as you grow. Our proven process makes expansion seamless.
              </p>
              <div className="relative bg-lime-50 rounded-xl p-3 border border-lime-200 mt-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-600 rounded-l-xl"></div>
                <p className="text-gray-700 italic text-xs font-medium">
                  Reality: From 1 person to full departments
                </p>
              </div>
            </div>
                          </Carousel>
              </div>

              {/* Responsibilities Cards */}
              <div className="mt-16 opacity-0 transition-all duration-700 ease-out" id="responsibilities-div">
                <div className="text-center mb-12 opacity-0 transition-all duration-700 ease-out delay-200" id="responsibilities-header">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Clear <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Responsibilities</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We handle the infrastructure, you focus on your business growth.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* What We Handle Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 opacity-0 transition-all duration-700 ease-out delay-400" id="we-handle-card">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">What We Handle</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Recruitment & candidate screening</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Office space & infrastructure</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Computers, internet, backup power</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Government compliance &amp; contracts</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">HR management & payroll</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Performance monitoring systems</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">24/7 IT support & security</span>
                      </li>
                    </ul>
                  </div>

                  {/* What You Handle Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-[4px_4px_0px_#4d7c0f] hover:shadow-[6px_6px_0px_#4d7c0f] transition-all duration-300 border border-lime-200 hover:border-lime-300 opacity-0 transition-all duration-700 ease-out delay-600" id="you-handle-card">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">What You Handle</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Training your team members</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Daily task assignment & management</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Quality control & feedback</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Business process development</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Team communication & culture</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Performance goals & KPIs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Strategic direction & growth</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quote Section */}
              <div className="mt-16 text-center">
                <div className="max-w-4xl mx-auto p-8 border-2 border-lime-200 rounded-2xl bg-lime-50 shadow-lg">
                  <blockquote className="text-lg md:text-xl text-gray-800 italic mb-6 leading-relaxed">
                    "The thing is, most people overcomplicate outsourcing. We've simplified it down to what actually works: find good people, give them proper infrastructure, let you train them your way."
                  </blockquote>
                  <cite className="text-base font-semibold text-gray-900">
                    — Stephen Atcheler, CEO & Founder
                  </cite>
                </div>
                
                {/* CTA Button */}
                <div className="mt-8">
                  <button className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer">
                    START YOUR PROCESS TODAY
                  </button>
                </div>
              </div>

              {/* Brand Logos Section */}
              <div className="mt-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Trusted by <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Global Brands</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Trusted by industry leaders across 5 countries
                  </p>
                </div>

                {/* Infinite Scroll Container */}
                <div className="relative overflow-hidden bg-gray/50 rounded-2xl w-full max-w-7xl mx-auto">
                  <div className="flex animate-scroll">
                    {/* First set of logos */}
                    {brandLogos.map((brand, index) => (
                      <div key={index} className="flex-shrink-0 px-8 py-6 flex items-center justify-center">
                        <div className="w-32 h-16 flex items-center justify-center">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={128}
                            height={64}
                            className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                          />
                        </div>
                      </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {brandLogos.map((brand, index) => (
                      <div key={`duplicate-${index}`} className="flex-shrink-0 px-8 py-6 flex items-center justify-center">
                        <div className="w-32 h-16 flex items-center justify-center">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={128}
                            height={64}
                            className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Transparency Section */}
              <div className="mt-20 py-8">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-6">
                    <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Pricing Transparency
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                    The <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Transparent</span> vs <span className="text-red-600">Hidden Fees</span> Difference
                  </h2>
                  <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto italic leading-relaxed">
                    "After getting burned by hidden fees in my own business, I swore our pricing would be crystal clear. Here's exactly what you pay and why."
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex justify-center mb-12">
                  <div className="relative flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
                    {/* Animated Background Slider */}
                    <div 
                      className={`absolute top-1 bottom-1 rounded-full transition-all duration-500 ease-in-out ${
                        isShoreAgentsWay 
                          ? 'left-1 bg-lime-500 w-[calc(50%-2px)]' 
                          : 'left-[calc(50%+1px)] bg-red-500 w-[calc(50%-2px)]'
                      }`}
                    />
                    
                    <button
                      onClick={() => setIsShoreAgentsWay(true)}
                      className={`relative flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 z-10 cursor-pointer hover:scale-105 active:scale-95 ${
                        isShoreAgentsWay
                          ? 'text-white'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className={`w-5 h-5 mr-2 transition-colors duration-300 ${isShoreAgentsWay ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Shore Agents Way
                    </button>
                    <button
                      onClick={() => setIsShoreAgentsWay(false)}
                      className={`relative flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 z-10 cursor-pointer hover:scale-105 active:scale-95 ${
                        !isShoreAgentsWay
                          ? 'text-white'
                          : 'text-gray-800'
                      }`}
                    >
                      <svg className={`w-5 h-5 mr-2 transition-colors duration-300 ${!isShoreAgentsWay ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Competitor Way
                    </button>
                  </div>
                </div>

                {/* Pricing Content */}
                <div className="max-w-6xl mx-auto relative">
                  <div 
                    className={`transition-all duration-700 ease-in-out ${
                      isShoreAgentsWay 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-8 absolute inset-0'
                    }`}
                  >
                    {/* Shore Agents Way Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Panel: Transparent Pricing Details */}
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-lime-200 h-[500px] flex flex-col">
                        <h3 className="text-2xl font-bold text-lime-600 mb-6">Transparent Pricing</h3>
                        
                        <div className="space-y-4 flex-1">
                          {/* Salary Multipliers */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Salary Multipliers Explained</h4>
                              <p className="text-gray-700 mb-1">Entry: 1.43x • Mid: 1.33x • Senior: 1.25x</p>
                              <p className="text-sm text-gray-600">Lower multipliers for higher salaries - you save more on senior talent</p>
                            </div>
                          </div>

                          {/* Benefits */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Benefits at Exact Cost</h4>
                              <p className="text-gray-700 mb-1">SSS, PhilHealth, PagIBIG, 13th Month - no markup</p>
                              <p className="text-sm text-gray-600">We show you the government rates, charge exactly that amount</p>
                            </div>
                          </div>

                          {/* Workspace Options */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Workspace Options Clear</h4>
                              <p className="text-gray-700 mb-1">Work from Home: {formatPrice(convertPrice(144))} • Office: {formatPrice(convertPrice(288))}</p>
                              <p className="text-sm text-gray-600">Choose what fits your business, know the exact cost upfront</p>
                            </div>
                          </div>

                          {/* Setup Fees */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Setup Fees Disclosed</h4>
                              <p className="text-gray-700 mb-1">WFH: {formatPrice(convertPrice(1081))} setup • Office: {formatPrice(convertPrice(541))} setup</p>
                              <p className="text-sm text-gray-600">6-month payment plans available, no interest charges</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Panel: Pricing Example */}
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-lime-200 h-[500px] flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Shore Agents Pricing Example</h3>
                        <p className="text-gray-600 mb-6">Mid-Level VA ({formatPrice(convertPrice(901))} salary)</p>
                        
                        <div className="space-y-2 mb-6 flex-1">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Base Salary:</span>
                            <span className="font-medium">{formatPrice(convertPrice(1210))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Multiplier (1.33x):</span>
                            <span className="font-medium">{formatPrice(convertPrice(1609))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Benefits (exact cost):</span>
                            <span className="font-medium">{formatPrice(convertPrice(239))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Office Workspace:</span>
                            <span className="font-medium">{formatPrice(convertPrice(387))}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between">
                            <span className="font-bold text-lg">Total Monthly:</span>
                            <span className="font-bold text-lg text-lime-600">{formatPrice(convertPrice(2235))}</span>
                          </div>
                        </div>

                        <div className="flex items-center bg-lime-50 rounded-xl p-4 border border-lime-200">
                          <svg className="w-5 h-5 text-lime-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Everything included, nothing hidden.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`transition-all duration-700 ease-in-out ${
                      !isShoreAgentsWay 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-8 absolute inset-0'
                    }`}
                  >
                    {/* Competitor Way Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Panel: Hidden Fee Structure */}
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200 h-[500px] flex flex-col">
                        <h3 className="text-2xl font-bold text-red-600 mb-6">Hidden Fee Structure</h3>
                        
                        <div className="space-y-4 flex-1">
                          {/* Management Fees */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Management Fees</h4>
                              <p className="text-gray-700 mb-1">20-40% hidden markup on everything</p>
                              <p className="text-sm text-gray-600">Competitors add mysterious fees they don't explain.</p>
                            </div>
                          </div>

                          {/* Service Charges */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Service Charges</h4>
                              <p className="text-gray-700 mb-1">Extra monthly fees for basic services</p>
                              <p className="text-sm text-gray-600">Suddenly your $500 VA costs $800.</p>
                            </div>
                          </div>

                          {/* Platform Fees */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Platform Fees</h4>
                              <p className="text-gray-700 mb-1">Additional charges for using their system</p>
                              <p className="text-sm text-gray-600">More fees appear after you've already committed.</p>
                            </div>
                          </div>

                          {/* Premium Support */}
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Premium Support</h4>
                              <p className="text-gray-700 mb-1">Basic support costs extra</p>
                              <p className="text-sm text-gray-600">Want to talk to someone? That'll be another fee.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Panel: Competitor Example */}
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200 h-[500px] flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Competitor &apos;Hidden Fees&apos; Example</h3>
                        <p className="text-gray-600 mb-6">Mid-Level VA (advertised price)</p>
                        
                        <div className="space-y-2 mb-6 flex-1">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Advertised Rate:</span>
                            <span className="font-medium">{formatPrice(convertPrice(800))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">+ Management Fee (25%):</span>
                            <span className="font-medium">{formatPrice(convertPrice(200))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">+ Platform Fee:</span>
                            <span className="font-medium">{formatPrice(convertPrice(99))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">+ Setup Fee:</span>
                            <span className="font-medium">{formatPrice(convertPrice(500))} one-time</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">+ Premium Support:</span>
                            <span className="font-medium">{formatPrice(convertPrice(150))}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between">
                            <span className="font-bold text-lg">Actual Monthly:</span>
                            <span className="font-bold text-lg text-red-600">{formatPrice(convertPrice(1249))}</span>
                          </div>
                        </div>

                        <div className="flex items-center bg-red-50 rounded-xl p-4 border border-red-200">
                          <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">56% more than advertised!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transparency Promise Box */}
                <div className="max-w-4xl mx-auto p-8 border-2 border-lime-200 rounded-2xl bg-lime-50 shadow-lg mt-12">
                  <blockquote className="text-lg md:text-xl text-gray-800 italic mb-6 leading-relaxed">
                    &quot;No hidden fees. Benefits at exact cost. If you can&apos;t understand our pricing in 5 minutes, we&apos;ve failed.&quot;
                  </blockquote>
                  <cite className="text-base font-semibold text-gray-900">
                    — Stephen's Transparency Promise
                  </cite>
                </div>

                {/* Stephen's Hidden Fee Horror Story Card */}
                <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-lg">
                  {/* Header */}
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Stephen&apos;s Hidden Fee Horror Story</h3>
                  </div>

                  {/* Stephen's Quote */}
                  <blockquote className="text-lg text-gray-700 italic mb-8 leading-relaxed border-l-4 border-lime-200 pl-6">
                    &quot;I hired a &apos;bookkeeper&apos; for $30/hour. After all the fees, contractors, and markups, I was paying $70/hour for someone I&apos;d never met. That&apos;s when I knew there had to be a better way.&quot;
                  </blockquote>

                  {/* Comparison Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* The Old Way */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h4 className="text-xl font-bold text-red-600 mb-4">The Old Way (Stephen&apos;s Pain)</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Advertised at $30/hour</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Hidden agency fees</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Contractor markups</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Platform charges</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <p className="text-lg font-bold text-red-600">= $70/hour actual cost</p>
                      </div>
                    </div>

                    {/* Shore Agents Way */}
                    <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
                      <h4 className="text-xl font-bold text-lime-600 mb-4">Shore Agents Way</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Clear salary range</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Transparent multiplier</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Exact benefit costs</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-lime-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">No hidden fees</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-lime-200">
                        <p className="text-lg font-bold text-lime-600">= Know exact cost upfront</p>
                      </div>
                    </div>
                                     </div>
                 </div>

                 {/* See Your Exact Savings Card */}
                 <div className="max-w-4xl mx-auto mt-12 bg-lime-50 rounded-2xl p-8 shadow-lg">
                   <div className="text-center">
                     {/* Icon */}
                     <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                       <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                       </svg>
                     </div>

                     {/* Heading */}
                     <h3 className="text-3xl font-bold text-gray-900 mb-4">See Your Exact Savings</h3>

                     {/* Description */}
                     <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                       Use our transparent pricing calculator to see exactly what you&apos;ll pay - no surprises, no hidden fees.
                     </p>

                     {/* Button */}
                     <button 
                       onClick={() => window.location.href = '/pricing'}
                       className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center mx-auto cursor-pointer"
                     >
                       Calculate Your Real Costs
                       <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                       </svg>
                     </button>
                   </div>
                 </div>

                 {/* Horizontal Rule */}
                 <hr className="max-w-4xl mx-auto mt-16 border-gray-300" />

                 {/* Meet Your Next Team Member Section */}
                 <div className="max-w-4xl mx-auto mt-16">
                   <div className="text-center mb-12">
                     {/* Ready to Hire Button */}
                     <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-6">
                       <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                       </svg>
                       READY TO HIRE
                     </div>

                     {/* Main Heading */}
                     <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                       Meet Your Next{" "}
                       <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Team Member</span>
                     </h2>

                     {/* Description */}
                     <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                       University-educated professionals working from our Clark office. No home-based workers, no time wasters - just results.
                     </p>
                   </div>

                   {/* Feature Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                     {/* Card 1: 7 Days */}
                     <div className="text-center">
                       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                         <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </div>
                       <h3 className="text-3xl font-bold text-gray-900 mb-2">7 Days</h3>
                       <p className="text-gray-600">Average Hire Time</p>
                     </div>

                     {/* Card 2: 100% University Educated */}
                     <div className="text-center">
                       <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                         <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                         </svg>
                       </div>
                       <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
                       <p className="text-gray-600">University Educated</p>
                     </div>

                     {/* Card 3: Office Based */}
                     <div className="text-center">
                       <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                         <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                       </div>
                       <h3 className="text-3xl font-bold text-gray-900 mb-2">Office Based</h3>
                       <p className="text-gray-600">Clark, Philippines</p>
                     </div>
                   </div>
                 </div>

                 {/* Top 3 Employees Section */}
                 <div className="max-w-6xl mx-auto mt-16">

                   {/* Employee Cards Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {loading ? (
                       <div className="col-span-3 text-center py-12">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-4"></div>
                         <p className="text-gray-600">Loading top talent...</p>
                       </div>
                     ) : (
                       <>
                         {topEmployees.map((employee) => (
                           <EmployeeCard
                             key={employee.user.id}
                             data={employee}
                             onViewDetails={handleViewDetails}
                             onViewResume={handleViewResume}
                           />
                         ))}
                       </>
                     )}
                   </div>

                   {/* View All Talent Button */}
                   <div className="text-center mt-12">
                     <button 
                       onClick={() => window.location.href = '/employees'}
                       className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer"
                     >
                       View All Talent Pool
                     </button>
                   </div>

                   {/* Resume Modal */}
                   <ResumeModal
                     resume={selectedResume}
                     isOpen={isResumeModalOpen}
                     onClose={() => {
                       setIsResumeModalOpen(false);
                       setSelectedResume(null);
                     }}
                   />
                 </div>

                
                 {/* Interview Intelligence Section */}
                 <div className="mt-20 bg-lime-800 py-16">
                   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                       <div className="inline-flex items-center px-4 py-2 bg-lime-700 border border-lime-600 rounded-full text-sm font-medium text-lime-100 mb-6">
                         <svg className="w-4 h-4 mr-2 text-lime-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                         </svg>
                         AI-POWERED INTERVIEWS
                       </div>
                       
                       <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                         Interview <span className="bg-gradient-to-r from-lime-300 via-lime-100 to-lime-300 bg-clip-text text-transparent">Intelligence</span>
                       </h2>
                       
                       <p className="text-xl text-lime-100 mb-12 max-w-3xl mx-auto">
                         AI provides personalized interview questions and evaluation frameworks for each candidate, ensuring better hiring decisions.
                       </p>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       {/* Card 1: Personalized Questions */}
                       <div className="bg-lime-700 rounded-2xl p-8 shadow-lg border border-lime-600 hover:shadow-xl transition-all duration-300">
                         <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-4">Personalized Questions</h3>
                         <p className="text-lime-100 mb-6 leading-relaxed">
                           Our AI analyzes each candidate&apos;s background, skills, and experience to generate tailored interview questions that reveal their true capabilities.
                         </p>
                         <div className="bg-lime-600 rounded-lg p-3">
                           <p className="text-sm font-medium text-white">Targeted insights for each candidate</p>
                         </div>
                       </div>

                       {/* Card 2: Evaluation Frameworks */}
                       <div className="bg-lime-700 rounded-2xl p-8 shadow-lg border border-lime-600 hover:shadow-xl transition-all duration-300">
                         <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                           </svg>
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-4">Evaluation Frameworks</h3>
                         <p className="text-lime-100 mb-6 leading-relaxed">
                           Structured assessment criteria based on role requirements, ensuring consistent and objective candidate evaluation across all interviews.
                         </p>
                         <div className="bg-lime-600 rounded-lg p-3">
                           <p className="text-sm font-medium text-white">Consistent evaluation standards</p>
                         </div>
                       </div>

                       {/* Card 3: Better Hiring Decisions */}
                       <div className="bg-lime-700 rounded-2xl p-8 shadow-lg border border-lime-600 hover:shadow-xl transition-all duration-300">
                         <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-4">Better Hiring Decisions</h3>
                         <p className="text-lime-100 mb-6 leading-relaxed">
                           Data-driven insights and AI-powered analysis help you make informed decisions, reducing hiring risks and improving team performance.
                         </p>
                         <div className="bg-lime-600 rounded-lg p-3">
                           <p className="text-sm font-medium text-white">Data-driven hiring success</p>
                         </div>
                       </div>
                     </div>

                     {/* CTA Section */}
                     <div className="text-center mt-12">
                       <button className="bg-white text-lime-800 px-8 py-4 rounded-sm font-semibold hover:bg-lime-100 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer">
                         Experience AI-Powered Interviews
                       </button>
                     </div>
                   </div>
                                   </div>
                </div>
                {/* How Our AI System Works Section */}
               <div className="bg-lime-900 py-16">
                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
                       <div className="inline-flex items-center px-4 py-2 bg-lime-600 border border-lime-500 rounded-full text-sm font-medium text-white mb-6">
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                         </svg>
                         Simple Process
                       </div>
                       
                       <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                         How Our AI System <span className="bg-gradient-to-r from-lime-400 via-lime-300 to-lime-400 bg-clip-text text-transparent">Works</span>
                       </h2>
                       
                       <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                         Four intelligent steps that revolutionize how you find and hire top Filipino talent
                       </p>
                     </div>

                                           {/* Process Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Step 1: AI Analysis */}
                        <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              1
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            Submit your requirements and our AI analyzes them against our database
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Machine learning identifies the perfect candidate profile for your business
                          </p>
                          {/* Arrow */}
                          <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                            <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Step 2: Smart Matching */}
                        <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              2
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Smart Matching</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            AI ranks and matches candidates based on skills, experience, and cultural fit
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Advanced algorithms consider 200+ factors for optimal matching
                          </p>
                          {/* Arrow */}
                          <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                            <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Step 3: Automated Screening */}
                        <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              3
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Automated Screening</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            AI conducts initial assessments and verifies qualifications
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Comprehensive evaluation including technical skills and English proficiency
                          </p>
                          {/* Arrow */}
                          <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                            <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Step 4: Human Review */}
                        <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              4
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Human Review</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            Our team validates AI recommendations and prepares your shortlist
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Expert recruiters ensure quality and add personal insights
                          </p>
                        </div>
                      </div>

                     {/* CTA Section */}
                     <div className="text-center mt-12">
                       <button className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer">
                         Start Your AI-Powered Hiring Process
                       </button>
                     </div>
                   </div>
                 </div>
              </section>
               

           </div>
         );
       }
