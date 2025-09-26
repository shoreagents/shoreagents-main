"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InterviewRequestModal, InterviewRequestData } from '@/components/ui/interview-request-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestInterviewModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submittedData, setSubmittedData] = useState<InterviewRequestData | null>(null)

  const handleSubmit = async (data: InterviewRequestData) => {
    // This will now trigger the login modal with pre-filled data
    console.log('Interview request data:', data)
    setSubmittedData(data)
    // The modal will close and open the login modal automatically
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Interview Request Modal</h1>
      <p className="mb-6">This page demonstrates the simplified interview request modal with only First Name, Last Name, and Email fields.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-lime-600 hover:bg-lime-700 text-white"
            >
              Open Interview Request Modal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Submitted Data</CardTitle>
          </CardHeader>
          <CardContent>
            {submittedData ? (
              <div className="space-y-2">
                <p><strong>First Name:</strong> {submittedData.firstName}</p>
                <p><strong>Last Name:</strong> {submittedData.lastName}</p>
                <p><strong>Email:</strong> {submittedData.email}</p>
              </div>
            ) : (
              <p className="text-gray-500">No data submitted yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enhanced Interview Request Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Fields:</strong> Only First Name, Last Name, and Email Address</p>
              <p><strong>Validation:</strong> All three fields are required</p>
              <p><strong>Design:</strong> Clean Shadcn components with lime accent color</p>
              <p><strong>Size:</strong> Compact modal (500px max width)</p>
              <p><strong>Icons:</strong> Calendar icon in header, User icon for section</p>
              <p><strong>New Feature:</strong> After filling out the form, clicking "Request Interview" will:</p>
              <ul className="ml-4 list-disc">
                <li>Close the interview modal</li>
                <li>Open the sign-up modal automatically</li>
                <li>Pre-fill the First Name, Last Name, and Email fields</li>
                <li>Switch to signup mode (not login mode)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <InterviewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidateName="R M"
        candidatePosition="Software Developer"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
