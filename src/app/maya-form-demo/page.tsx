'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Play,
  Sparkles,
  Zap,
  Target,
  Brain,
  FormInput,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Calculator,
  Users,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Briefcase
} from 'lucide-react';

import { MayaFormBuilder, FORM_TEMPLATES } from '@/components/ui/maya-form-builder';

export default function MayaFormDemoPage() {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);

  const formTypes = [
    {
      id: '45_seconds_anonymous',
      name: 'Contact Form',
      description: 'Basic contact information and message',
      icon: MessageSquare,
      color: 'bg-blue-500',
      fields: FORM_TEMPLATES['45_seconds_anonymous']?.length || 0,
      trigger: 'contact_form_modal'
    },
    {
      id: 'pricing_calculator',
      name: 'Pricing Calculator',
      description: 'Team size, budget, and project requirements',
      icon: Calculator,
      color: 'bg-green-500',
      fields: FORM_TEMPLATES.pricing_calculator?.length || 0,
      trigger: 'pricing_calculator_modal'
    },
    {
      id: 'interview_request',
      name: 'Interview Request',
      description: 'Schedule interviews with candidates',
      icon: Users,
      color: 'bg-purple-500',
      fields: FORM_TEMPLATES.interview_request?.length || 0,
      trigger: 'interview_request_modal'
    },
    {
      id: 'employee_details',
      name: 'Employee Details',
      description: 'View employee information',
      icon: Target,
      color: 'bg-orange-500',
      fields: FORM_TEMPLATES.employee_details?.length || 0,
      trigger: 'employee_details_modal'
    }
  ];

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    setSubmittedData(data);
    setActiveForm(null);
  };

  const handleCloseForm = () => {
    setActiveForm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center mr-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Maya's Dynamic Form Builder</h1>
              <p className="text-lg text-gray-600">Step-by-Step Forms Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-sm">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Dynamic
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Step-by-Step
            </Badge>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Maya can now create dynamic, step-by-step forms that adapt to user input. 
            Each form field is shown one at a time, making the experience more conversational and less overwhelming.
          </p>
        </div>

        {/* Form Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {formTypes.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${form.color} rounded-lg flex items-center justify-center`}>
                    <form.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {form.fields} fields
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {form.description}
                </CardDescription>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setActiveForm(form.id)}
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Test Form
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    Trigger: {form.trigger}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FormInput className="w-6 h-6 mr-2 text-lime-600" />
              How Maya's Dynamic Forms Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Step-by-Step Process:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-lime-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">User asks Maya for something</p>
                      <p className="text-xs text-gray-600">"I need a pricing quote" or "I want to contact you"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-lime-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Maya analyzes the request</p>
                      <p className="text-xs text-gray-600">AI determines which form template to use</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-lime-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Form appears step-by-step</p>
                      <p className="text-xs text-gray-600">One field at a time, like a conversation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-lime-600">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data is collected and processed</p>
                      <p className="text-xs text-gray-600">Form submission triggers the appropriate action</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    <span><strong>Progressive Disclosure:</strong> One field at a time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    <span><strong>Smart Validation:</strong> Real-time error checking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    <span><strong>Visual Progress:</strong> Clear progress indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    <span><strong>Flexible Navigation:</strong> Go back and forth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    <span><strong>Multiple Field Types:</strong> Text, email, select, etc.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-600 flex-shrink-0" />
                    <span><strong>AI Integration:</strong> Triggered by conversation analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Field Types Showcase */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Supported Field Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'Text', icon: FormInput, color: 'bg-blue-100 text-blue-600' },
                { type: 'Email', icon: Mail, color: 'bg-green-100 text-green-600' },
                { type: 'Phone', icon: Phone, color: 'bg-purple-100 text-purple-600' },
                { type: 'Number', icon: Calculator, color: 'bg-orange-100 text-orange-600' },
                { type: 'Date', icon: Calendar, color: 'bg-pink-100 text-pink-600' },
                { type: 'Select', icon: Target, color: 'bg-indigo-100 text-indigo-600' },
                { type: 'Textarea', icon: MessageSquare, color: 'bg-teal-100 text-teal-600' },
                { type: 'Checkbox', icon: CheckCircle, color: 'bg-lime-100 text-lime-600' }
              ].map((field, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 ${field.color} rounded-lg flex items-center justify-center`}>
                    <field.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{field.type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submitted Data Display */}
        {submittedData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Form Submitted Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </div>
              <Button 
                onClick={() => setSubmittedData(null)}
                variant="outline" 
                className="mt-4"
              >
                Clear Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dynamic Forms */}
      {formTypes.map((form) => (
        <MayaFormBuilder
          key={form.id}
          formType={form.id}
          isOpen={activeForm === form.id}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          title={`Maya's ${form.name}`}
          description={`Let's collect your ${form.name.toLowerCase()} information step by step.`}
        />
      ))}
    </div>
  );
}
