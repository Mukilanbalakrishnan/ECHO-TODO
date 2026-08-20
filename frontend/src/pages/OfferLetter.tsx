import React, { useState, useRef } from 'react';
import { FileText, Plus, Download, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/common/Button';
import { OfferLetterModal } from '../components/offer-letter/OfferLetterModal';
import { OfferLetterTemplate } from '../components/offer-letter/OfferLetterTemplate';
import { useOfferLetters } from '../hooks/useOfferLetters';
import type { OfferLetter as OfferLetterType } from '../types';
import { useToast } from '../contexts/ToastContext';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { format, parseISO } from 'date-fns';

export const OfferLetter: React.FC = () => {
  const { offerLetters, isLoading, addOfferLetter, updateOfferLetter, deleteOfferLetter } = useOfferLetters();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<OfferLetterType | undefined>();
  const [previewLetter, setPreviewLetter] = useState<OfferLetterType | null>(null);
  
  // For PDF Generation
  const [pdfData, setPdfData] = useState<OfferLetterType | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // ID of the letter being generated
  const templateRef = useRef<HTMLDivElement>(null);

  const handleOpenCreate = () => {
    setEditingLetter(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (letter: OfferLetterType) => {
    setEditingLetter(letter);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer letter?')) {
      const success = await deleteOfferLetter(id);
      if (success) {
        toast('Offer letter deleted', 'success');
      } else {
        toast('Failed to delete offer letter', 'error');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    let success = false;
    if (editingLetter) {
      success = await updateOfferLetter(editingLetter.id, data);
    } else {
      success = await addOfferLetter(data);
    }
    return success;
  };

  const handleDownload = async (letter: OfferLetterType) => {
    setPdfData(letter);
    setIsGenerating(letter.id);
    
    // Give React a tick to render the template with the new data
    setTimeout(async () => {
      try {
        if (!templateRef.current) throw new Error("Template not found");
        
        const element = templateRef.current;
        toast('Generating PDF...', 'info');
        
        const imgData = await toPng(element, {
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        });
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        const fileName = `Offer_Letter_${letter.name.replace(/\s+/g, '_')}.pdf`;
        pdf.save(fileName);
        
        toast('Downloaded successfully!', 'success');
      } catch (error) {
        console.error('PDF Error:', error);
        toast('Failed to generate PDF', 'error');
      } finally {
        setIsGenerating(null);
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Offer Letters</h2>
          <p className="text-slate-500 mt-1">Manage and generate official offer letters for candidates.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus size={18} />
          Create Offer Letter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : offerLetters.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 mb-6 text-indigo-500">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Offer Letters Yet</h3>
          <p className="text-slate-500 max-w-md mb-8">
            Click the button above to create a new offer letter. You can edit them later and download them as PDFs anytime.
          </p>
          <Button onClick={handleOpenCreate}>
            Create Offer Letter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offerLetters.map((letter) => (
            <div key={letter.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 pr-3">
                  <h3 className="font-semibold text-slate-800 truncate">{letter.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 truncate">{letter.position}</p>
                </div>
                <div className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded shrink-0">
                  {letter.domain}
                </div>
              </div>
              
              <div className="text-xs text-slate-400 mb-4 flex-1">
                Created on {letter.createdAt ? format(parseISO(letter.createdAt), 'MMM d, yyyy') : '-'}
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPreviewLetter(letter)} 
                  className="text-slate-600 hover:text-indigo-600 px-2 -ml-2"
                >
                  <Eye size={16} className="mr-1.5" /> Preview
                </Button>
                <div className="flex gap-1 -mr-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDownload(letter)} 
                    isLoading={isGenerating === letter.id} 
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2"
                    title="Download PDF"
                  >
                    <Download size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleOpenEdit(letter)} 
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(letter.id)} 
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 px-2"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OfferLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingLetter}
        onSubmit={handleSubmit}
      />

      {/* Hidden template for PDF generation */}
      {pdfData && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div id="pdf-template" ref={templateRef}>
            <OfferLetterTemplate data={pdfData} />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-slate-100 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Preview: {previewLetter.name}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleDownload(previewLetter)} isLoading={isGenerating === previewLetter.id}>
                  <Download size={16} className="mr-2" /> Download
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPreviewLetter(null)}>
                  Close
                </Button>
              </div>
            </div>
            
            <div className="overflow-auto p-8 flex justify-center items-start bg-slate-100">
              {/* Scaled down container so it fits nicely on most screens without massive scrolling */}
              <div style={{ transform: 'scale(0.7)', transformOrigin: 'top center', marginBottom: '-30%' }}>
                <div className="shadow-lg">
                  <OfferLetterTemplate data={previewLetter} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
