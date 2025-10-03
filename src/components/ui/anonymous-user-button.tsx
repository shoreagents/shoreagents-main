'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnonymousUserModal } from './anonymous-user-modal';
import { useAuth } from '@/lib/auth-context';
import { HelpCircle } from 'lucide-react';

export function AnonymousUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Only show for anonymous users
  if (isAuthenticated) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpenModal}
          className="bg-lime-600 hover:bg-lime-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full w-14 h-14 p-0"
          title="Tell us about your business"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal */}
      <AnonymousUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

