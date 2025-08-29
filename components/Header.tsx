
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
        <div className="bg-primary p-2 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral">Kal AI</h1>
      </div>
    </header>
  );
};
