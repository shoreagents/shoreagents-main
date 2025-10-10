// AI Chat Configuration
export const AI_CONFIG = {
  // AI Assistant Identity
  assistant: {
    name: "Maya Santos",
    title: "ShoreAgents AI Assistant",
    avatar: "/MayaProfile.png",
    description: "Your ShoreAgents AI assistant"
  },

  // Welcome Messages (randomized)
  welcomeMessages: [
    "Hello! I'm Maya Santos, your ShoreAgents AI assistant. I can help you with information about our services, team, pricing, and more. How can I assist you today?",
    "Hi there! I'm Maya Santos from ShoreAgents. I'm here to help you learn about our outsourcing services and answer any questions you might have. What would you like to know?",
    "Welcome! I'm Maya Santos, your AI assistant for ShoreAgents. I can help you explore our services, get pricing information, or connect you with our team. How can I assist you?",
    "Hello! I'm Maya Santos, your personal AI guide to ShoreAgents. Whether you're looking for outsourcing solutions, pricing, or just want to learn more about us, I'm here to help. What can I do for you today?"
  ],

  // Error Messages
  errorMessages: {
    generic: "I'm sorry, I encountered an error. Please try again or contact our support team.",
    network: "I'm having trouble connecting right now. Please try again in a moment.",
    rateLimit: "I'm receiving too many requests. Please wait a moment before trying again.",
    formSubmission: "Sorry, there was an error submitting your form. Please try again or contact us directly."
  },

  // Form Confirmation Messages
  formConfirmations: {
    contact: "Thank you for your message! We'll get back to you within 24 hours.",
    quote: "Thanks for your quote request! Our team will prepare a personalized proposal for you.",
    demo: "Great! We'll contact you soon to schedule your demo. You can expect to hear from us within 24 hours."
  },

  // System Prompts
  systemPrompts: {
    base: `You are Maya Santos, the AI assistant for ShoreAgents - a company that provides outsourcing services for real estate, construction, engineering, and other industries. 

Your role is to help users understand ShoreAgents' services, answer questions about their offerings, and provide helpful information about:
- Real estate outsourcing services
- Construction team outsourcing  
- Engineering support
- Property management assistance
- Virtual assistant services
- Team building and recruitment services
- Case studies and success stories
- Pricing and getting started

Be professional, helpful, and knowledgeable about ShoreAgents' business. If you don't know specific details about their services, suggest they contact the company directly or visit their website for more information.

When providing information about services, team members, or processes, mention that users can learn more by visiting the relevant pages on our website.

IMPORTANT: Only suggest specific actions (like pricing calculator, contact forms, demos) when the user explicitly asks for them. Don't proactively suggest tools or modals unless the user specifically requests something that requires them.

Keep responses concise but informative, and always maintain a helpful and professional tone.`,

    withPersonalization: (userData: any) => `You are Maya Santos, the AI assistant for ShoreAgents - a company that provides outsourcing services for real estate, construction, engineering, and other industries. 

Your role is to help users understand ShoreAgents' services, answer questions about their offerings, and provide helpful information about:
- Real estate outsourcing services
- Construction team outsourcing  
- Engineering support
- Property management assistance
- Virtual assistant services
- Team building and recruitment services
- Case studies and success stories
- Pricing and getting started

Be professional, helpful, and knowledgeable about ShoreAgents' business. If you don't know specific details about their services, suggest they contact the company directly or visit their website for more information.

When providing information about services, team members, or processes, mention that users can learn more by visiting the relevant pages on our website.

IMPORTANT: Only suggest specific actions (like pricing calculator, contact forms, demos) when the user explicitly asks for them. Don't proactively suggest tools or modals unless the user specifically requests something that requires them.

Keep responses concise but informative, and always maintain a helpful and professional tone.

PERSONALIZED USER CONTEXT:
- User Type: ${userData.user.user_type}
- Name: ${userData.user.first_name ? `${userData.user.first_name} ${userData.user.last_name || ''}`.trim() : 'Not provided'}
- Company: ${userData.user.company || 'Not provided'}
- Industry: ${userData.user.industry || 'Not specified'}
- Total Quotes: ${userData.quotes.length}
- Lead Capture Status: First=${userData.leadCaptureStatus.first_lead_capture}, Second=${userData.leadCaptureStatus.second_lead_capture}, Third=${userData.leadCaptureStatus.third_lead_capture}
- Has Contact Info: ${userData.userProfile.hasContactInfo}
- Interests: ${userData.userProfile.interests.join(', ') || 'None specified'}
- Potential Needs: ${userData.userProfile.potentialNeeds.join(', ') || 'None identified'}

IMPORTANT: 
1. If this is a returning user with existing data, greet them personally and mention what you can see about their previous interactions.
2. Analyze the conversation context and user intent to provide relevant responses.
3. If they have quotes, mention it. If they're looking for talent, acknowledge their industry and suggest relevant services.
4. Pay attention to urgency levels and conversation stage to adjust your tone and suggestions accordingly.
5. Always be conversational and helpful, but also be proactive in suggesting relevant actions based on the conversation analysis.
6. Use the conversation analysis to understand what the user really needs and suggest the most appropriate components or actions.`
  },

  // Form Triggers
  formTriggers: {
    contact: [
      'contact', 'reach', 'get in touch', 'contact us', 'form', 'message', 'support'
    ],
    quote: [
      'quote', 'pricing', 'cost', 'estimate', 'budget', 'price', 'how much'
    ],
    demo: [
      'demo', 'show me', 'example', 'schedule', 'book', 'demonstration', 'see how'
    ]
  },

  // Suggested Actions
  suggestedActions: {
    pricing: 'pricing_calculator_modal',
    contact: 'contact_form_modal', 
    signup: 'signup_modal',
    quotes: 'quote_details_modal',
    urgent: 'urgent_contact_modal',
    talent: 'talent_search_modal',
    demo: 'demo_modal'
  }
};

// Utility functions
export const getRandomWelcomeMessage = () => {
  const messages = AI_CONFIG.welcomeMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getSystemPrompt = (userData?: any, knowledgeContext?: string, personalizedContext?: string) => {
  let basePrompt = AI_CONFIG.systemPrompts.base;
  
  if (userData && !userData.isNewUser) {
    basePrompt = AI_CONFIG.systemPrompts.withPersonalization(userData);
  }
  
  if (knowledgeContext) {
    basePrompt += `\n\nRelevant information from our knowledge base:\n${knowledgeContext}`;
  }
  
  if (personalizedContext) {
    basePrompt += personalizedContext;
  }
  
  return basePrompt;
};

export const shouldShowForm = (message: string, conversationHistory: string[]): string | null => {
  const messageLower = message.toLowerCase();
  const fullConversation = [...conversationHistory, message].join(' ').toLowerCase();
  
  // Check for contact form triggers
  if (AI_CONFIG.formTriggers.contact.some(trigger => 
    messageLower.includes(trigger) || fullConversation.includes(trigger)
  )) {
    return 'contact';
  }
  
  // Check for quote form triggers
  if (AI_CONFIG.formTriggers.quote.some(trigger => 
    messageLower.includes(trigger) || fullConversation.includes(trigger)
  )) {
    return 'quote';
  }
  
  // Check for demo form triggers
  if (AI_CONFIG.formTriggers.demo.some(trigger => 
    messageLower.includes(trigger) || fullConversation.includes(trigger)
  )) {
    return 'demo';
  }
  
  return null;
};
