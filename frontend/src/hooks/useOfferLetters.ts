import { useState, useEffect } from 'react';
import type { OfferLetter } from '../types';

export const useOfferLetters = () => {
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfferLetters = async () => {
    try {
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/offer-letters`);
      if (response.ok) {
        const data = await response.json();
        setOfferLetters(data);
      } else {
        throw new Error('Failed to fetch offer letters');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferLetters();
  }, []);

  const addOfferLetter = async (offerLetterData: Omit<OfferLetter, 'id' | 'createdAt'>) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/offer-letters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerLetterData)
      });
      if (response.ok) {
        fetchOfferLetters();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding offer letter:', error);
      return false;
    }
  };

  const updateOfferLetter = async (id: string, offerLetterData: Omit<OfferLetter, 'id' | 'createdAt'>) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/offer-letters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerLetterData)
      });
      if (response.ok) {
        fetchOfferLetters();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating offer letter:', error);
      return false;
    }
  };

  const deleteOfferLetter = async (id: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/offer-letters/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchOfferLetters();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting offer letter:', error);
      return false;
    }
  };

  return {
    offerLetters,
    isLoading,
    error,
    addOfferLetter,
    updateOfferLetter,
    deleteOfferLetter,
    refreshOfferLetters: fetchOfferLetters
  };
};
