"use client";

import Image from "next/image";
import { SideNav } from "@/components/layout/SideNav";
import { Carousel } from "@/components/ui/carousel";
import { useEffect } from "react";

export default function Home() {
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
    const observer = new IntersectionObserver((entries) => {
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
                <div className="flex justify-center">
                  <button className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 text-white px-8 py-4 rounded-3xl font-semibold hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">
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
              "I've done all the dumb things, so you don't have to. Here's the systematic approach that actually works."
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
                        <span className="text-gray-700">Government compliance & contracts</span>
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
                <div className="max-w-4xl mx-auto p-8 border-2 border-lime-200 rounded-2xl bg-white/50">
                  <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                    "The thing is, most people overcomplicate outsourcing. We've simplified it down to what actually works: find good people, give them proper infrastructure, let you train them your way."
                  </blockquote>
                  <cite className="text-lg font-semibold text-gray-900">
                    — Stephen Atcheler, CEO & Founder
                  </cite>
                </div>
                
                {/* CTA Button */}
                <div className="mt-8">
                  <button className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 text-white px-8 py-4 rounded-3xl font-semibold hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">
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
                <div className="relative overflow-hidden bg-white/50 rounded-2xl w-full max-w-7xl mx-auto">
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
            </section>
          </div>
        );
      }
