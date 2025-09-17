'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Loader2, ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  components?: React.ReactNode[];
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Maya Santos, your ShoreAgents AI assistant. I can help you with information about our services, team, pricing, and more. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Add delay before hiding to allow closing animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        response: data.content || 'I apologize, but I encountered an error processing your request.',
        relatedContent: data.components || [],
      };
    } catch (error) {
      console.error('API call error:', error);
      throw error;
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
      const { response, relatedContent } = await generateAIResponse(inputValue, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        relatedContent: relatedContent.length > 0 ? relatedContent : undefined,
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
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
      >
        <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
            isUser 
              ? 'bg-gradient-to-br from-lime-400 to-lime-600 text-white' 
              : 'border-2 border-lime-200'
          }`}>
            {isUser ? <User size={12} /> : (
              <div className="relative w-full h-full">
                <Image 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=maya-santos&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=24"
                  alt="Maya Santos Avatar"
                  className="w-full h-full object-cover"
                  width={24}
                  height={24}
                />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-2 h-2 text-lime-500 animate-pulse" />
                </div>
              </div>
            )}
          </div>
          
          <div className={`rounded-xl px-3 py-2 shadow-lg ${
            isUser 
              ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-white' 
              : 'bg-white text-gray-800 border border-gray-200'
          }`}>
            <div className="text-xs leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
            
            {message.relatedContent && message.relatedContent.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">🔗 Related Links:</div>
                {message.relatedContent.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-lg p-3 border border-lime-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="font-medium text-sm text-gray-800 mb-1">{item.title}</div>
                    <div className="text-xs text-gray-600 mb-2 line-clamp-2">{item.content}</div>
                    {item.url && (
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-lime-700 hover:text-lime-800 hover:bg-lime-200 px-2 py-1 rounded-md transition-all duration-200"
                      >
                        Visit Page <ExternalLink size={12} />
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
    <div 
      className={`fixed bottom-16 right-4 z-[9999] w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-400 ease-out pointer-events-auto ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-90'
      }`}
      style={{ height: isMinimized ? '60px' : '450px' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white p-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Maya Santos Avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full shadow-lg border-2 border-white overflow-hidden">
              <Image 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=maya-santos&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=32"
                alt="Maya Santos Avatar"
                className="w-full h-full object-cover"
                width={32}
                height={32}
              />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            {/* Sparkle effect */}
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-2.5 h-2.5 text-lime-200 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Maya Santos</h3>
            <p className="text-lime-100 text-xs">Your ShoreAgents AI Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-lime-400 rounded transition-colors duration-300 ease-out"
            title={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={() => {
              setIsVisible(false);
              // Delay the actual close to allow animation to complete
              setTimeout(() => onClose(), 300);
            }}
            className="p-1 hover:bg-lime-400 rounded transition-colors duration-200"
            title="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 transition-all duration-300 ease-out">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-lime-200 overflow-hidden">
                    <Image 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=maya-santos&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=24"
                      alt="Maya Santos Avatar"
                      className="w-full h-full object-cover"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="bg-white rounded-xl px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin text-lime-500" />
                      <span className="text-xs text-gray-600">Maya is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 transition-all duration-300 ease-out">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Maya anything about ShoreAgents..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-xs transition-all duration-200 pointer-events-auto"
                disabled={isLoading}
                style={{ pointerEvents: 'auto' }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-3 py-2 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-lg hover:from-lime-600 hover:to-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatConsole;
