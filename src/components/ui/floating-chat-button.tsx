'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatConsole from './ai-chat-console';

const FloatingChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        aria-label="Open AI Chat"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Chat Console */}
      <ChatConsole 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default FloatingChatButton;
