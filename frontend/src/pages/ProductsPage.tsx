import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { fetchAllProducts, fetchProductsWithFilter } from '../utils/api';
import { categories, brands } from '../data/mockData';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 500] as [number, number],
    rating: 0
  });

  // Fetch products from API
  const fetchProducts = async (query = '') => {
    try {
      const products = await fetchAllProducts(query);
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const applyFilters = async () => {
      try {
        const products = await fetchProductsWithFilter(filters);
        setProducts(products);
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };

  // Initial load
  useEffect(() => {
  const fetch = async () => {
    await fetchProducts();
  };
  fetch();
}, []);

const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.brands.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 500 || 
    filters.rating > 0;

    const clearFilters = () => {
        setFilters({
          categories: [],
          brands: [],
          priceRange: [0, 500],
          rating: 0
        });
      };

      const handleCategoryChange = (category: string) => {
          const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
          
          setFilters({ ...filters, categories: newCategories });
        };
      
        const handleBrandChange = (brand: string) => {
            const newBrands = filters.brands.includes(brand)
              ? filters.brands.filter(b => b !== brand)
              : [...filters.brands, brand];
            
            setFilters({ ...filters, brands: newBrands });
          };
        
          const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
            const newPriceRange: [number, number] = [...filters.priceRange];
            if (type === 'min') {
              newPriceRange[0] = value;
            } else {
              newPriceRange[1] = value;
            }
            setFilters({ ...filters, priceRange: newPriceRange });
          };
        
          const handleRatingChange = (rating: number) => {
            setFilters({ ...filters, rating });
          };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchProducts(searchInput);
              }
            }}
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">

            <div className="hidden lg:flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
            
            <div className="space-y-6">
              <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                            <div className="space-y-2">
                              {categories.map(category => (
                                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">{category}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                    <div>
                                  <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {brands.map(brand => (
                                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={filters.brands.includes(brand)}
                                          onChange={() => handleBrandChange(brand)}
                                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{brand}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

<div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                    placeholder="Min"
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                    placeholder="Max"
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
                                  <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: rating }, (_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      <span className="text-sm text-gray-700">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === 0}
                    onChange={() => handleRatingChange(0)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">All ratings</span>
                </label>
              </div>
            </div>

            </div>
            
            <div className="pt-4">
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading...</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;
