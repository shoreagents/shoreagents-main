'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { colors } from '@/lib/colors';
import { renderChatComponent } from './chat-components';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  components?: Array<{
    type: string;
    id: string;
    [key: string]: any;
  }>;
  relatedContent?: Array<{
    title: string;
    content: string;
    url?: string;
  }>;
}

interface ChatConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatConsole: React.FC<ChatConsoleProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Generate dynamic initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greetings = [
        "Hi there! I'm here to help with ShoreAgents information. What would you like to know?",
        "Hello! I can share details about our services, team, pricing, and processes. What interests you?",
        "Welcome! I'm ready to help with ShoreAgents details. What would you like to explore?",
        "Hi! I can provide information about our outsourcing services and team. What questions do you have?"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: randomGreeting,
        timestamp: new Date(),
      }]);
    }
  }, []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      // Call the Claude API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude API');
      }

      const data = await response.json();
      
      // Extract related content from the knowledge base for display
      const { searchKnowledge } = await import('@/lib/knowledge-base');
      const relevantContent = searchKnowledge(userMessage);
      
      const relatedContent = relevantContent.slice(1).map(item => ({
        title: item.title,
        content: item.content.substring(0, 150) + '...',
        url: item.url
      }));

      return { 
        response: data.content, 
        relatedContent: relatedContent.length > 0 ? relatedContent : undefined,
        components: data.components
      };
    } catch (error) {
      console.error('API call failed, falling back to local response:', error);
      
      // Fallback to local knowledge base if API fails
      const { searchKnowledge } = await import('@/lib/knowledge-base');
      const relevantContent = searchKnowledge(userMessage);
      
      let response = '';
      let relatedContent: Array<{ title: string; content: string; url?: string }> = [];
      
      if (relevantContent.length > 0) {
        const primaryContent = relevantContent[0];
        response = `${primaryContent.content}\n\n`;
        
        if (relevantContent.length > 1) {
          const otherItems = relevantContent.slice(1).map(item => item.title);
          response += `I also found information about: ${otherItems.join(', ')}. `;
        }
        
        response += `What would you like to know more about?`;
        
        relatedContent = relevantContent.slice(1).map(item => ({
          title: item.title,
          content: item.content.substring(0, 150) + '...',
          url: item.url
        }));
      } else {
        response = `I can help you with information about ShoreAgents' services, team, pricing, or processes. What would you like to explore?`;
      }
      
      return { response, relatedContent };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { response, relatedContent, components } = await generateAIResponse(inputValue, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        relatedContent: relatedContent && relatedContent.length > 0 ? relatedContent : undefined,
        components: components,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or contact our support team.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-gradient-to-br from-lime-400 to-lime-600 text-white' 
              : 'bg-gradient-to-br from-ocean-400 to-ocean-600 text-white'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          <div className={`rounded-2xl px-4 py-3 shadow-lg ${
            isUser 
              ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-white' 
              : 'bg-white text-gray-800 border border-gray-200'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
            
            {message.components && message.components.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Interactive Elements:</div>
                {message.components.map((componentData: any, index: number) => (
                  <div key={componentData.id || index}>
                    {renderChatComponent(componentData)}
                  </div>
                ))}
              </div>
            )}
            
            {message.relatedContent && message.relatedContent.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Related Information:</div>
                {message.relatedContent.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-medium text-sm text-gray-800 mb-1">{item.title}</div>
                    <div className="text-xs text-gray-600 mb-2">{item.content}</div>
                    {item.url && (
                      <a 
                        href={item.url}
                        className="inline-flex items-center gap-1 text-xs text-ocean-600 hover:text-ocean-800 transition-colors"
                      >
                        Learn More <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className={`text-xs mt-2 opacity-70 ${
              isUser ? 'text-lime-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot size={20} />
          <div>
            <h3 className="font-semibold text-lg">ShoreAgents AI</h3>
            <p className="text-lime-100 text-sm">Your virtual assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-lime-400 rounded transition-colors"
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-lime-400 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-ocean-500" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about ShoreAgents..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-3 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-xl hover:from-lime-600 hover:to-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatConsole;
