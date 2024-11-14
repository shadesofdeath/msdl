import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to Products
    </button>
  );
};