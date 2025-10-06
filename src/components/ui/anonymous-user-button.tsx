'use client';

import { useState, useEffect } from 'react';
import { AnonymousUserModal } from './anonymous-user-modal';
import { useAuth } from '@/lib/auth-context';
import { generateUserId } from '@/lib/userEngagementService';

export function AnonymousUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Auto-open modal after 45 seconds
  useEffect(() => {
    // Only start timer for anonymous users
    if (isAuthenticated) {
      return;
    }

    let timer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const startCountdown = () => {
      console.log('🚀 Anonymous user modal timer started - 45 seconds countdown');
      
      // Countdown timer for logging
      let countdown = 45;
      countdownInterval = setInterval(() => {
        countdown--;
        console.log(`⏰ Modal will open in ${countdown} seconds...`);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      timer = setTimeout(() => {
        console.log('🎉 Opening anonymous user modal after 45 seconds!');
        setIsModalOpen(true);
      }, 45000); // 45 seconds
    };

    const checkUserFormStatus = async () => {
      try {
        console.log('🔍 Checking user form status in database...');
        const userId = generateUserId();
        console.log('👤 Generated user ID:', userId);
        
        const response = await fetch(`/api/check-user-form-status?user_id=${userId}`);
        const data = await response.json();

        console.log('📊 Database check result:', data);

        if (data.hasFilledForm) {
          console.log('🚫 User has already filled out the form (database check):', {
            company: data.company,
            industry: data.industry,
            hasFilledForm: data.hasFilledForm
          });
          return;
        }

        console.log('✅ User has not filled out the form, starting countdown in 2 seconds...');
        // Add a small delay to make sure the database check is complete
        setTimeout(() => {
          startCountdown();
        }, 2000);
      } catch (error) {
        console.error('Error checking user form status:', error);
        console.log('⚠️ Database check failed, starting countdown anyway');
        startCountdown();
      }
    };

    // Start the database check
    checkUserFormStatus();

    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
      console.log('🧹 Anonymous user modal timer cleaned up');
    };
  }, [isAuthenticated]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Only show for anonymous users
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Modal - no floating button */}
      <AnonymousUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

