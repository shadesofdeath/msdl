import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative mb-8 max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
      <input
        type="text"
        placeholder="Search Windows versions..."
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};