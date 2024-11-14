import React from 'react';
import { Download } from 'lucide-react';

interface ProductListProps {
  products: [string, string][];
  onSelect: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
  return (
    <div className="grid gap-4 max-w-4xl mx-auto">
      {products.map(([id, name]) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className="product-card group"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{name}</span>
            <Download className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
      ))}
    </div>
  );
};