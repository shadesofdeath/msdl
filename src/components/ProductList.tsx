import React from 'react';

interface ProductListProps {
  products: [string, string][];
  onSelect: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
  return (
    <div className="space-y-2">
      {products.map(([id, name]) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {name}
        </button>
      ))}
    </div>
  );
};