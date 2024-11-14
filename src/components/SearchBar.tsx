import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search Windows versions..."
        className="w-full pl-10 p-2 bg-gray-800 rounded-lg border border-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};