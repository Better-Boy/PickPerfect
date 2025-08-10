import React from 'react';
import { Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { sendEvent } from '../utils/api';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {

  const handleClick = async (product: Product) => {
    await sendEvent(product.id, product.category, "click");
    onViewDetails(product);
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => handleClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Out of Stock
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick(product);
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;