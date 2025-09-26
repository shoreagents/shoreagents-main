'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Calendar, User } from 'lucide-react';
import { LoginModal } from '@/components/ui/login-modal';

interface InterviewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidatePosition: string;
  onSubmit: (data: InterviewRequestData) => Promise<void>;
}

export interface InterviewRequestData {
  firstName: string;
  lastName: string;
  email: string;
}

export function InterviewRequestModal({
  isOpen,
  onClose,
  candidateName,
  candidatePosition,
  onSubmit
}: InterviewRequestModalProps) {
  const [formData, setFormData] = useState<InterviewRequestData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleInputChange = (field: keyof InterviewRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    // Close the interview modal and open the login modal with pre-filled data
    onClose();
    setShowLoginModal(true);
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: '',
        lastName: '',
        email: ''
      });
      setError('');
      onClose();
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    // Reset form when login modal is closed
    setFormData({
      firstName: '',
      lastName: '',
      email: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Request Interview
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Schedule an interview with {candidateName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-lime-600" />
              Your Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>


          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-lime-600 hover:bg-lime-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Request Interview
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      {/* Login Modal with pre-filled data */}
      {showLoginModal && (
        <LoginModal 
          onSuccess={handleLoginModalClose}
          prefillData={{
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email
          }}
        >
          <div style={{ display: 'none' }} />
        </LoginModal>
      )}
    </Dialog>
  );
}
