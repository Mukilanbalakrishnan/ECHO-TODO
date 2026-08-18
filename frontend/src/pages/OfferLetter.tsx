import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { OfferLetterModal } from '../components/offer-letter/OfferLetterModal';


export const OfferLetter: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Offer Letters</h2>
          <p className="text-slate-500 mt-1">Generate official offer letters for new candidates.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Create Offer Letter
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 mb-6 text-indigo-500">
          <FileText size={40} />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Offer Letters Generated</h3>
        <p className="text-slate-500 max-w-md mb-8">
          Click the button above to generate a new offer letter. It will be automatically downloaded as a PDF matching the official company template.
        </p>
        <Button onClick={() => setIsModalOpen(true)}>
          Create Offer Letter
        </Button>
      </div>

      <OfferLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
