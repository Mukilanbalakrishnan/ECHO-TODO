import React from 'react';
import { format, differenceInMonths, parseISO } from 'date-fns';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { OfferLetterData } from './types';

interface OfferLetterTemplateProps {
  data: OfferLetterData;
}

export const OfferLetterTemplate: React.FC<OfferLetterTemplateProps> = ({ data }) => {
  const getDuration = () => {
    if (!data.startDate || !data.endDate) return '0';
    try {
      const start = parseISO(data.startDate);
      const end = parseISO(data.endDate);
      const months = differenceInMonths(end, start);
      return months > 0 ? months.toString() : '1';
    } catch {
      return '0';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '[Date]';
    try {
      return format(parseISO(dateString), 'dd-MM-yyyy');
    } catch {
      return '[Date]';
    }
  };

  const today = format(new Date(), 'MMMM dd, yyyy');
  const duration = getDuration();

  return (
    <div 
      className="mx-auto relative overflow-hidden" 
      style={{ width: '794px', height: '1123px', fontFamily: 'Arial, sans-serif', color: '#1a1a1a', backgroundColor: '#ffffff' }}
    >
      {/* Header Graphics */}
      <div className="relative w-full h-[180px]">
        <svg width="100%" height="100%" viewBox="0 0 794 180" preserveAspectRatio="none">
          {/* Base white */}
          <rect width="794" height="180" fill="#ffffff" />
          
          {/* Main Orange Chevron and Bar */}
          <polygon points="386.7,30 436.7,75 420,90 487,150 794,150 794,180 420,180 320,90" fill="#f58a28" />

          {/* Top Right Dark Blue Shape */}
          <polygon points="386.7,30 420,0 520,0 436.7,75" fill="#1b2a47" />
          
          {/* Navy blue main polygon */}
          <polygon points="0,0 380,0 280,90 380,180 0,180" fill="#1b2a47" />
        </svg>

        {/* Logo */}
        <div className="absolute top-10 right-10 flex items-center">
          <img 
            src="/logo (1).png" 
            alt="Echo Digital Works Logo" 
            className="h-[80px] w-auto object-contain" 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-16 pt-8 pb-12 text-[15px] leading-relaxed">
        <p className="mb-6">{today}</p>
        
        <p className="font-bold mb-4 uppercase text-[16px]">Dear {data.name || '[Name]'},</p>
        
        <p className="mb-6 text-justify">
          We are pleased to offer you the position of {data.position || 'Intern'} with our organization for a period of {duration} months starting from [{formatDate(data.startDate)}]. During this internship, you will have the opportunity to work closely with our team, gain practical exposure, and contribute to ongoing projects.
        </p>

        <p className="mb-4">Details of Internship:</p>

        <div className="mb-8">
          <p>Position: {data.position || 'Intern'}</p>
          <p>Domain : {data.domain}</p>
          <p>Stipend: {data.stipend}</p>
          <p>Duration: {duration} Months</p>
          <p>Location: {data.location}</p>
          <p>Working Hours: {data.workingHours}</p>
        </div>

        <p className="mb-6 text-justify">
          We believe this internship will provide you with valuable learning and professional development opportunities in your career.
        </p>

        <p className="mb-10 text-justify">
          We look forward to welcoming you on board and wish you a successful internship journey with Echo Digital Works.
        </p>

        <div className="mb-6 italic">
          <p>Best Regards,</p>
          <p>BOOPATHY S,</p>
          <p>CEO</p>
          <p>Echo Digital Works.</p>
        </div>

        {/* Signature and Seal Area */}
        <div className="mt-8 flex justify-between items-end">
          {/* Signature */}
          <div>
            <div className="mb-2">
              <img 
                src="/CEO-Signature.png" 
                alt="Signature" 
                className="h-[80px] w-auto object-contain object-left" 
              />
            </div>
            <div className="font-bold text-[16px] ml-4">
              <p>Boopathy,</p>
              <p className="font-normal italic">Founder</p>
            </div>
          </div>

          {/* Seal */}
          <div className="mb-2">
            <img 
              src="/echo digital seal.png" 
              alt="Company Seal" 
              className="w-[120px] object-contain" 
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="absolute bottom-0 w-full h-[60px] flex items-center justify-around px-10 text-[13px]"
        style={{ backgroundColor: '#1b2a47', color: '#ffffff' }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full" style={{ border: '1px solid #ffffff' }}>
            <Phone size={14} color="#ffffff" />
          </div>
          <span>7904075373</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full" style={{ border: '1px solid #ffffff' }}>
            <Mail size={14} color="#ffffff" />
          </div>
          <span>echodigitalworks@gmail.com</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full" style={{ border: '1px solid #ffffff' }}>
            <MapPin size={14} color="#ffffff" />
          </div>
          <span>Porur, Chennai</span>
        </div>
      </div>
    </div>
  );
};
