import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-blue-400 hover:text-blue-300 mb-8 -ml-2 px-4"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      <span className="font-medium">Back to Products</span>
    </button>
  );
};