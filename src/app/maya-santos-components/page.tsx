'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Calculator, 
  MessageCircle, 
  Users, 
  Eye, 
  Play,
  Sparkles,
  Zap,
  Target,
  Brain,
  CheckCircle,
  Briefcase,
  FileText
} from 'lucide-react';

// Import the new dynamic form builder
import { MayaFormBuilder, FORM_TEMPLATES } from '@/components/ui/maya-form-builder';


export default function MayaSantosComponentsPage() {
  // Dynamic form states
  const [isDynamicFormOpen, setIsDynamicFormOpen] = useState(false);
  const [dynamicFormType, setDynamicFormType] = useState<string>('');
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any> | null>(null);

  const handleDynamicFormSubmit = (data: Record<string, any>) => {
    console.log('Dynamic form submitted:', data);
    setSubmittedFormData(data);
    setIsDynamicFormOpen(false);
  };

  const openDynamicForm = (formType: string) => {
    setDynamicFormType(formType);
    setIsDynamicFormOpen(true);
  };

  const components = [
    {
      id: '45_seconds_anonymous',
      name: '45 Seconds Anonymous',
      description: 'Quick anonymous user information collection',
      icon: Users,
      color: 'bg-blue-600',
      trigger: '45_seconds_anonymous_modal',
      action: () => openDynamicForm('45_seconds_anonymous'),
      fields: FORM_TEMPLATES['45_seconds_anonymous'].length,
      type: 'dynamic'
    },
    {
      id: 'pricing_calculator',
      name: 'Pricing Calculator',
      description: 'Comprehensive pricing information gathering',
      icon: Calculator,
      color: 'bg-green-600',
      trigger: 'pricing_calculator_modal',
      action: () => openDynamicForm('pricing_calculator'),
      fields: FORM_TEMPLATES.pricing_calculator.length,
      type: 'dynamic'
    },
    {
      id: 'interview_request',
      name: 'Interview Request',
      description: 'Schedule interviews with candidates',
      icon: MessageCircle,
      color: 'bg-purple-600',
      trigger: 'interview_request_modal',
      action: () => openDynamicForm('interview_request'),
      fields: FORM_TEMPLATES.interview_request.length,
      type: 'dynamic'
    },
    {
      id: 'login_modal',
      name: 'Login Modal',
      description: 'User authentication and login',
      icon: Eye,
      color: 'bg-orange-600',
      trigger: 'login_modal',
      action: () => openDynamicForm('login_modal'),
      fields: FORM_TEMPLATES.login_modal.length,
      type: 'dynamic'
    },
    {
      id: 'quote_summary',
      name: 'Quote Summary',
      description: 'View detailed quote information',
      icon: Target,
      color: 'bg-lime-600',
      trigger: 'quote_summary_modal',
      action: () => openDynamicForm('quote_summary'),
      fields: FORM_TEMPLATES.quote_summary.length,
      type: 'dynamic'
    },
    {
      id: 'employee_details',
      name: 'Employee Details',
      description: 'Access employee information and details',
      icon: Users,
      color: 'bg-indigo-600',
      trigger: 'employee_details_modal',
      action: () => openDynamicForm('employee_details'),
      fields: FORM_TEMPLATES.employee_details.length,
      type: 'dynamic'
    },
    {
      id: 'applications_modal',
      name: 'Applications Modal',
      description: 'Manage job applications and status',
      icon: Briefcase,
      color: 'bg-pink-600',
      trigger: 'applications_modal',
      action: () => openDynamicForm('applications_modal'),
      fields: FORM_TEMPLATES.applications_modal.length,
      type: 'dynamic'
    },
    {
      id: 'resume_modal',
      name: 'Resume Modal',
      description: 'Generate and manage candidate resumes',
      icon: FileText,
      color: 'bg-teal-600',
      trigger: 'resume_modal',
      action: () => openDynamicForm('resume_modal'),
      fields: FORM_TEMPLATES.resume_modal.length,
      type: 'dynamic'
    }
  ];

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
              <h1 className="text-4xl font-bold text-gray-900">Maya Santos Components</h1>
              <p className="text-lg text-gray-600">Interactive Modals & AI Chat Integration</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-sm">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Interactive
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Real-time
            </Badge>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            This page showcases Maya's new dynamic form builder system. These step-by-step forms provide a conversational 
            experience where users answer one question at a time, making data collection feel natural and engaging.
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {components.map((component) => (
            <Card key={component.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${component.color} rounded-lg flex items-center justify-center`}>
                    <component.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {component.trigger}
                      </Badge>
                      {component.fields && (
                        <Badge variant="secondary" className="text-xs">
                          {component.fields} fields
                        </Badge>
                      )}
                      {component.type === 'dynamic' && (
                        <Badge variant="default" className="text-xs bg-lime-100 text-lime-700">
                          Dynamic
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {component.description}
                </CardDescription>
                <Button 
                  onClick={component.action}
                  className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Component
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Chat Integration Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-6 h-6 mr-2 text-lime-600" />
              AI Chat Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How Maya Triggers These Dynamic Forms:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>45 Seconds Anonymous:</strong> "I want to get started" or "Quick signup"</li>
                  <li>• <strong>Pricing Calculator:</strong> "I need a pricing quote" or "Calculate costs"</li>
                  <li>• <strong>Interview Request:</strong> "I want to schedule an interview" or "Meet a candidate"</li>
                  <li>• <strong>Login Modal:</strong> "I need to log in" or "Sign in"</li>
                  <li>• <strong>Quote Summary:</strong> "I want to see my quote" or "View quote details"</li>
                  <li>• <strong>Employee Details:</strong> "I want to see employee info" or "View candidate details"</li>
                  <li>• <strong>Applications Modal:</strong> "I want to check applications" or "View job applications"</li>
                  <li>• <strong>Resume Modal:</strong> "I want to generate a resume" or "Create a resume"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Conversation Analysis:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Intent Detection:</strong> Analyzes user messages for specific needs</li>
                  <li>• <strong>Context Awareness:</strong> Considers conversation history</li>
                  <li>• <strong>Smart Suggestions:</strong> Proactively recommends relevant actions</li>
                  <li>• <strong>Personalization:</strong> Adapts to user type and previous interactions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Forms Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Dynamic Forms Are Better</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-lime-600" />
                  Conversational Experience
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Step-by-Step:</strong> One field at a time, like talking to a person</li>
                  <li>• <strong>User-Friendly:</strong> Less overwhelming, more engaging</li>
                  <li>• <strong>Natural Flow:</strong> Feels like a conversation with Maya</li>
                  <li>• <strong>Progress Tracking:</strong> Clear visual progress indicators</li>
                  <li>• <strong>Flexible Navigation:</strong> Go back and change answers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Developer Benefits
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Template-Based:</strong> Easy to create new forms</li>
                  <li>• <strong>Highly Flexible:</strong> Simple to modify and extend</li>
                  <li>• <strong>Reusable:</strong> One component handles all form types</li>
                  <li>• <strong>Maintainable:</strong> No need for separate modal components</li>
                  <li>• <strong>Scalable:</strong> Add new forms without code changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Test Individual Components</h4>
                <p className="text-sm text-gray-600">
                  Click any "Test Component" button above to open the modal/form and see how it works.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Test AI Chat Integration</h4>
                <p className="text-sm text-gray-600">
                  Go to the chat interface and try these phrases to trigger the components:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• "I want to get started" → 45 Seconds Anonymous</li>
                  <li>• "I need a pricing quote" → Pricing Calculator</li>
                  <li>• "I want to schedule an interview" → Interview Request</li>
                  <li>• "I need to log in" → Login Modal</li>
                  <li>• "I want to see my quote" → Quote Summary</li>
                  <li>• "I want to see employee info" → Employee Details</li>
                  <li>• "I want to check applications" → Applications Modal</li>
                  <li>• "I want to generate a resume" → Resume Modal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Dynamic Form Builder */}
      <MayaFormBuilder
        formType={dynamicFormType}
        isOpen={isDynamicFormOpen}
        onClose={() => setIsDynamicFormOpen(false)}
        onSubmit={handleDynamicFormSubmit}
        title={`Maya's ${dynamicFormType.charAt(0).toUpperCase() + dynamicFormType.slice(1)} Form`}
        description={`Let's collect your ${dynamicFormType} information step by step.`}
      />

      {/* Submitted Form Data Display */}
      {submittedFormData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Form Submitted Successfully!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {dynamicFormType.charAt(0).toUpperCase() + dynamicFormType.slice(1)} form data collected
              </p>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(submittedFormData, null, 2)}
                </pre>
              </div>
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={() => setSubmittedFormData(null)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setSubmittedFormData(null);
                    openDynamicForm(dynamicFormType);
                  }}
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  Test Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
