
import React from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onActivate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm m-4 transform transition-all text-center p-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent -mt-16 border-4 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M5 3a2 2 0 00-2 2v1h16V5a2 2 0 00-2-2H5zm14 14a2 2 0 01-2 2H5a2 2 0 01-2-2v-1h16v1z" />
            </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mt-4">Upgrade to Premium</h3>
        <p className="mt-2 text-gray-600">
          Unlock AI-powered meal recognition by simply taking a photo of your food.
        </p>
        
        <ul className="text-left my-6 space-y-2 text-gray-600">
            <li className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>Instant calorie and macro estimates.</span>
            </li>
            <li className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>Save time on manual entry.</span>
            </li>
            <li className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>More personalized AI feedback.</span>
            </li>
        </ul>

        <div className="mt-6">
          <button
            onClick={onActivate}
            className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-3 bg-primary text-base font-medium text-white hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Activate Premium (Free Demo)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
