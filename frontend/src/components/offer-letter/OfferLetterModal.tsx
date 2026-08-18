import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { OfferLetterData } from './types';
import { OfferLetterTemplate } from './OfferLetterTemplate';
import { useToast } from '../../contexts/ToastContext';

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState<OfferLetterData>({
    name: '',
    position: 'Intern',
    startDate: '',
    endDate: '',
    domain: 'UI&UX Development, Full Stack Development',
    stipend: 'Based on performance',
    location: 'KSR College of Technology, Namakkal',
    workingHours: '9:00 A.M - 5:00 P.M'
  });

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

  const generatePDF = async () => {
    if (!validate()) return;
    
    if (!templateRef.current) {
      toast('Template reference not found', 'error');
      return;
    }

    setIsGenerating(true);
    toast('Generating Offer Letter...', 'info');

    try {
      // Temporarily make the template visible for html2canvas to capture it accurately
      const element = templateRef.current;
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.top = '-9999px';
      element.style.left = '-9999px';

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      element.style.display = 'none'; // Hide it again

      const imgData = canvas.toDataURL('image/png');
      
      // A4 size: 210 x 297 mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Offer_Letter_${formData.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      
      toast(`Offer Letter for ${formData.name} generated successfully!`, 'success');
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast('Failed to generate Offer Letter', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Generate Offer Letter" maxWidth="xl">
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
            <Button onClick={generatePDF} isLoading={isGenerating}>
              Generate & Download PDF
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hidden template for PDF generation */}
      <div style={{ display: 'none' }}>
        <div ref={templateRef}>
          <OfferLetterTemplate data={formData} />
        </div>
      </div>
    </>
  );
};
