import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { OfferLetterData } from './types';

import { useToast } from '../../contexts/ToastContext';

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: OfferLetterData;
  onSubmit: (data: OfferLetterData) => Promise<boolean>;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const defaultData: OfferLetterData = {
    name: '',
    position: 'Intern',
    startDate: '',
    endDate: '',
    domain: 'UI&UX Development, Full Stack Development',
    stipend: 'Based on performance',
    location: 'KSR College of Technology, Namakkal',
    workingHours: '9:00 A.M - 5:00 P.M'
  };

  const [formData, setFormData] = useState<OfferLetterData>(initialData || defaultData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const [errors, setErrors] = useState<Partial<Record<keyof OfferLetterData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof OfferLetterData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof OfferLetterData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsGenerating(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        toast(`Offer Letter ${initialData ? 'updated' : 'created'} successfully!`, 'success');
        onClose();
      } else {
        toast('Failed to save offer letter', 'error');
      }
    } catch (error) {
      toast('Failed to save offer letter', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Offer Letter" : "Create Offer Letter"} maxWidth="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Candidate Name"
              name="name"
              placeholder="e.g. MUKILAN B"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoFocus
            />
            <Input
              label="Position"
              name="position"
              placeholder="e.g. Intern"
              value={formData.position}
              onChange={handleChange}
              error={errors.position}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
            />
            <Input
              label="Stipend"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <Input
              label="Working Hours"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isGenerating}>
              {initialData ? 'Save Changes' : 'Create Offer Letter'}
            </Button>
          </div>
        </div>
      </Modal>
  );
};
