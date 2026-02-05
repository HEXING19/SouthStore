'use client';

import { useView } from '@/contexts/ViewContext';
import { CATEGORIES } from '@/constants/products';
import { useProducts } from '@/lib/hooks/useProducts';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { searchQuery, selectedCategory } = useView();

  const { products, loading, error } = useProducts({
    category: selectedCategory,
    search: searchQuery,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory}`}
        </h2>

        {/* Filters */}
        <div className="mt-4 md:mt-0 flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {CATEGORIES.map(cat => (
            <a
              key={cat}
              href={`/shop?category=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found for your search.</p>
              <a
                href="/shop"
                className="mt-4 inline-flex px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Search
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
