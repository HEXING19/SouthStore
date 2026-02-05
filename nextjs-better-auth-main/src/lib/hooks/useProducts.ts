import { useState, useEffect, useCallback } from 'react';

interface UseProductsOptions {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'name' | 'price' | 'rating';
  order?: 'asc' | 'desc';
}

interface UseProductsResult {
  products: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (options.category && options.category !== 'All') {
        params.set('category', options.category);
      }

      if (options.search) {
        params.set('search', options.search);
      }

      if (options.limit) {
        params.set('limit', options.limit.toString());
      }

      if (options.offset) {
        params.set('offset', options.offset.toString());
      }

      if (options.sort) {
        params.set('sort', options.sort);
      }

      if (options.order) {
        params.set('order', options.order);
      }

      const queryString = params.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.search, options.limit, options.offset, options.sort, options.order]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
