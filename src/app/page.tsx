import Image from "next/image";
import { SideNav } from "@/components/layout/SideNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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

      {/* Process Overview Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-4">
            <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Our Proven Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">Actually Works</span>
          </h2>
          <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto italic">
            "I've done all the dumb things, so you don't have to. Here's the systematic approach that actually works."
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex h-14 items-center px-6 py-2 bg-lime-100 border border-lime-300 rounded-xl shadow-sm">
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
      </section>
    </div>
  );
}
