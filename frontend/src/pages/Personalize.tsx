import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { fetchFeaturedDeals, getRecommendations } from '../utils/api';

const Personlize: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featureDeals, setFeaturedDeals] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const fetchFD =  async () => {
      try {
        const products = await fetchFeaturedDeals();
        setFeaturedDeals(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

  const fetchReco =  async () => {
      try {
        const products = await getRecommendations();
        setRecommendations(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

  useEffect(() => {
    fetchFD();
    fetchReco();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== Section 1: Featured Products ===== */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-3">Featured Deals</h2>
          <p className="text-center text-gray-600 mb-8">
            Discover our hand-picked selection of trending products at unbeatable prices.
          </p>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">

            {featureDeals.length === 0 ? (
              <span>Loading...</span>
            ) : (
              <>
                {featureDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
                </>
            )}

          </div>
        </div>

        {/* ===== Section 2: Recommended for You ===== */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-3">Recommended for You</h2>
          <p className="text-center text-gray-600 mb-8">
            Based on your product clicks & cart items added before, here’s what we think you’ll love.
          </p>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {recommendations.length === 0 ? (
              <span>Loading...</span>
            ) : (
              <>
                {recommendations.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
                </>
            )}

          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Personlize;
