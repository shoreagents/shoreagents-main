"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dropdown, DropdownItem } from '@/components/ui/dropdown'
import { Carousel } from '@/components/ui/carousel'
import { ChevronDown, Star, ArrowRight, Menu } from 'lucide-react'

export default function TestingPage() {
  const [testInput, setTestInput] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">🧪 Component Testing Lab</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Experimental Zone</span>
              <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Component Examples */}
          <div className="space-y-8">
            
            {/* Basic Components Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                Basic Components
              </h2>
              
              <div className="space-y-4">
                {/* Button Examples */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Buttons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Default Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                {/* Input Examples */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Input Fields</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="test-input">Test Input</Label>
                      <Input
                        id="test-input"
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Type something here..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="disabled-input">Disabled Input</Label>
                      <Input
                        id="disabled-input"
                        disabled
                        placeholder="This input is disabled"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Dropdown Example */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Dropdown</h3>
                  <Dropdown
                    trigger={
                      <Button variant="outline" className="w-full justify-between">
                        {selectedOption || "Select an option"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem onClick={() => setSelectedOption("Option 1")}>
                      Option 1
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelectedOption("Option 2")}>
                      Option 2
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelectedOption("Option 3")}>
                      Option 3
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* Interactive Components Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                Interactive Components
              </h2>
              
              <div className="space-y-4">
                {/* Carousel Example */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Carousel</h3>
                  <Carousel className="w-full">
                    <div className="flex-shrink-0 w-full">
                      <div className="bg-lime-100 rounded-lg p-6 text-center">
                        <Star className="w-8 h-8 text-lime-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900">Slide 1</h4>
                        <p className="text-sm text-gray-600">This is the first slide</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-full">
                      <div className="bg-lime-100 rounded-lg p-6 text-center">
                        <ArrowRight className="w-8 h-8 text-lime-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900">Slide 2</h4>
                        <p className="text-sm text-gray-600">This is the second slide</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-full">
                      <div className="bg-lime-100 rounded-lg p-6 text-center">
                        <Menu className="w-8 h-8 text-lime-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900">Slide 3</h4>
                        <p className="text-sm text-gray-600">This is the third slide</p>
                      </div>
                    </div>
                  </Carousel>
                </div>

                {/* Custom Button Styles */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Button Styles</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-lime-100 border border-lime-600 rounded-lg px-4 py-3 shadow-[4px_4px_0px_#4d7c0f] flex items-center justify-between opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-lime-200 hover:shadow-[6px_6px_0px_#4d7c0f] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0 active:scale-95">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-lime-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">
                          <span className="font-normal">CUSTOM </span>
                          <span className="font-bold">BUTTON!</span>
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Component Development Area */}
          <div className="space-y-8">
            
            {/* Development Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Development Notes
              </h2>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 How to Use This Page</h4>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Test new components here before integrating</li>
                    <li>• Experiment with different styles and interactions</li>
                    <li>• Use the brand colors (lime, gray, white)</li>
                    <li>• Follow the project's design patterns</li>
                  </ul>
                </div>
                
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                  <h4 className="font-medium text-lime-900 mb-2">🎨 Brand Guidelines</h4>
                  <ul className="space-y-1 text-lime-800">
                    <li>• Primary: Lime (#84cc16, #4d7c0f)</li>
                    <li>• Text: Gray (#374151, #6b7280)</li>
                    <li>• Background: White, Gray-50</li>
                    <li>• Shadows: Subtle gray shadows</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Component Testing Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Component Testing Area
              </h2>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add your experimental components here. This is a safe space to test new ideas!
                </p>
                
                {/* Placeholder for new components */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Add your experimental components here</p>
                </div>
              </div>
            </div>

            {/* Current State Display */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Current State
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Input Value:</span>
                  <span className="font-mono text-gray-900">{testInput || 'empty'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Option:</span>
                  <span className="font-mono text-gray-900">{selectedOption || 'none'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
