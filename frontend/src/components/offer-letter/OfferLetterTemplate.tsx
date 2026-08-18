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
          
          {/* Orange accent polygon */}
          <polygon points="0,0 794,0 794,180 0,180" fill="#ffffff" />
          <polygon points="350,180 794,180 794,150 450,150" fill="#f58a28" />
          <polygon points="450,150 250,0 200,0 350,180" fill="#f58a28" />
          
          {/* Navy blue main polygon */}
          <polygon points="0,0 380,0 250,180 0,180" fill="#1b2a47" />
        </svg>

        {/* Logo */}
        <div className="absolute top-10 right-10 flex items-center">
          <div className="flex items-center gap-1">
            <svg width="45" height="55" viewBox="0 0 50 60">
              <path d="M40 10 H20 A10 10 0 0 0 10 20 V40 A10 10 0 0 0 20 50 H40" fill="none" stroke="#1b2a47" strokeWidth="8" strokeLinecap="round" />
              <path d="M15 30 H35" fill="none" stroke="#1b2a47" strokeWidth="8" strokeLinecap="round" />
              <polygon points="30,22 42,30 30,38" fill="#f58a28" />
            </svg>
            <div className="flex flex-col justify-center ml-1">
              <span className="font-black text-[16px] leading-tight tracking-wide" style={{ color: '#1b2a47' }}>CHO DIGITAL</span>
              <span className="font-black text-[16px] leading-tight tracking-wide" style={{ color: '#1b2a47' }}>WORKS</span>
              <span className="text-[6px] tracking-widest mt-0.5 font-bold" style={{ color: '#1b2a47' }}>WHAT WE BUILD TODAY, ECHOES TOMORROW</span>
            </div>
          </div>
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

        {/* Signature */}
        <div className="mt-8 mb-2">
          <svg width="200" height="60" viewBox="0 0 200 60">
            <path d="M30 50 C 30 10, 45 5, 55 45 C 60 55, 65 30, 75 30 C 80 30, 85 45, 95 45 C 105 45, 115 35, 125 35 C 140 35, 160 45, 180 30" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <path d="M45 40 L 190 35" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeOpacity="0.5" />
          </svg>
        </div>
        
        <div className="font-bold text-[16px]">
          <p>Boopathy,</p>
          <p className="font-normal italic">Founder</p>
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
