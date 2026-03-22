'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, MapPin, Phone, User } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shareLocation: boolean, description?: string) => void;
  isSubmitting?: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export function EmergencyModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  emergencyContact,
}: EmergencyModalProps) {
  const [shareLocation, setShareLocation] = useState(true);
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    onConfirm(shareLocation, description || undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Emergency Assistance" size="md">
      <div className="p-6 space-y-5">
        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Are you sure you need emergency help?
            </h4>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              This will alert nearby hospitals and emergency services. Only use this for genuine medical emergencies.
            </p>
          </div>
        </div>

        {/* Location Consent */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={shareLocation}
            onChange={(e) => setShareLocation(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Share my location
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Your GPS coordinates will be shared with emergency responders for faster assistance.
            </p>
          </div>
        </label>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Describe the emergency (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe your symptoms or situation..."
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        {/* Emergency Contact */}
        {emergencyContact && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Emergency Contact
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {emergencyContact.name} ({emergencyContact.relationship})
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {emergencyContact.phone}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} fullWidth disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} fullWidth isLoading={isSubmitting}>
            Confirm Emergency
          </Button>
        </div>
      </div>
    </Modal>
  );
}
