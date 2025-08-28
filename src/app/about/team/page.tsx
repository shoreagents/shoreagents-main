"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, User, Building, Award } from 'lucide-react'
import Link from 'next/link'

export default function OurTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to About
              </Button>
            </Link>
          </div>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 p-4 bg-lime-100 rounded-xl">
              <Users className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Meet the dedicated professionals behind ShoreAgents who make it all possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Leadership Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stephen Atcheler</h3>
              <p className="text-lime-600 font-medium mb-3">CEO</p>
              <p className="text-gray-600 text-sm">
                Leading ShoreAgents with vision and strategic direction to deliver exceptional outsourcing solutions.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Charm Salas</h3>
              <p className="text-lime-600 font-medium mb-3">Chief Operating Officer</p>
              <p className="text-gray-600 text-sm">
                Overseeing day-to-day operations and ensuring seamless service delivery across all departments.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kath Macenas</h3>
              <p className="text-lime-600 font-medium mb-3">Head of Success</p>
              <p className="text-gray-600 text-sm">
                Ensuring client satisfaction and driving success through strategic partnerships and support.
              </p>
            </div>
          </div>
        </div>

        {/* Department Teams */}
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Department Teams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-lime-100 rounded-lg">
                    <Building className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Recruitment Team</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Our recruitment specialists ensure we find the perfect talent match for every client need.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Arelle Basco - Recruitment and Marketing Administrator</div>
                  <div>• Arra Magracia - Recruitment Team Lead</div>
                  <div>• Lady Paalisbo - Recruitment and Admin Support</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-lime-100 rounded-lg">
                    <Award className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Account Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Dedicated account managers ensuring smooth operations and client satisfaction.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Jineva Rosal - Account Management Administrator</div>
                  <div>• Naomi Nobleza - Account Management Administrator</div>
                  <div>• Thirdy Recede - Account Manager</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-lime-100 rounded-lg">
                    <Users className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Support Teams</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Comprehensive support across various business functions and operations.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Joshua Gutierrez - Admin Assistant</div>
                  <div>• Gelan Cingco - Housekeeper and Maintenance</div>
                  <div>• Mark Nobleza - Real Estate Support</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-lime-100 rounded-lg">
                    <Building className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Creative & Technical</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Skilled professionals delivering creative and technical solutions.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• James Dulinayan - Web Developer</div>
                  <div>• Lovell Siron - Graphic Designer</div>
                  <div>• Marc Matias - Graphic Designer</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-lime-100 rounded-lg">
                    <Award className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Operations & Finance</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Ensuring smooth operations and financial management across the organization.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Kevin Macabanti - Systems and Automations</div>
                  <div>• Klein Sundiam - Finance Coordinator</div>
                  <div>• Nica Manabat - HR Officer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Culture Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Team Culture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Values We Live By</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Excellence in everything we do</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Continuous learning and growth</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Collaboration and teamwork</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Client-focused approach</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Join Our Team</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Professional development opportunities</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Work with global clients</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Innovative and dynamic environment</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Competitive compensation and benefits</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Team</h2>
          <p className="text-xl text-lime-100 mb-6">
            Ready to be part of something amazing? Explore career opportunities with ShoreAgents.
          </p>
          <Link href="/about/careers">
            <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
              View Career Opportunities
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
