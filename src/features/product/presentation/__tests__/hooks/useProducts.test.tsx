import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts, useProduct, useInfiniteProducts, PRODUCT_QUERY_KEYS } from '../../hooks/useProducts';
import { right, left } from '@core/either';
import { networkError } from '@core/errors';
import { Product, Category } from '../../../domain/entities/Product';
import React from 'react';

// Mock the product container
const mockExecuteGetProducts = jest.fn();
const mockExecuteGetProductById = jest.fn();

jest.mock('../../../injection/ProductContainer', () => ({
  productContainer: {
    getProductsUseCase: {
      execute: (...args: unknown[]) => mockExecuteGetProducts(...args),
    },
    getProductByIdUseCase: {
      execute: (...args: unknown[]) => mockExecuteGetProductById(...args),
    },
  },
}));

describe('Product Hooks', () => {
  let queryClient: QueryClient;

  const mockCategory: Category = {
    id: 1,
    name: 'Electronics',
    imageUrl: 'https://example.com/category.jpg',
  };

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    description: 'A test product',
    images: ['https://example.com/image.jpg'],
    category: mockCategory,
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      id: 2,
      title: 'Another Product',
      price: 49.99,
      description: 'Another product',
      images: ['https://example.com/image2.jpg'],
      category: mockCategory,
    },
  ];

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('PRODUCT_QUERY_KEYS', () => {
    it('should generate correct query keys', () => {
      expect(PRODUCT_QUERY_KEYS.all).toEqual(['products']);
      expect(PRODUCT_QUERY_KEYS.lists()).toEqual(['products', 'list']);
      expect(PRODUCT_QUERY_KEYS.list({ limit: 10 })).toEqual(['products', 'list', { limit: 10 }]);
      expect(PRODUCT_QUERY_KEYS.details()).toEqual(['products', 'detail']);
      expect(PRODUCT_QUERY_KEYS.detail(1)).toEqual(['products', 'detail', 1]);
      expect(PRODUCT_QUERY_KEYS.infinite()).toEqual(['products', 'infinite']);
    });
  });

  describe('useProducts', () => {
    it('should return products on success', async () => {
      mockExecuteGetProducts.mockResolvedValue(right(mockProducts));

      const { result } = renderHook(() => useProducts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].id).toBe(1);
    });

    it('should pass params to use case', async () => {
      mockExecuteGetProducts.mockResolvedValue(right([]));

      const params = { limit: 20, offset: 10 };
      renderHook(() => useProducts(params), { wrapper });

      await waitFor(() => {
        expect(mockExecuteGetProducts).toHaveBeenCalledWith(params);
      });
    });

    it('should call use case and handle error response', async () => {
      const error = networkError('Network error');
      mockExecuteGetProducts.mockResolvedValue(left(error));

      const { result } = renderHook(() => useProducts(), { wrapper });

      // Wait for the query to be called at least once
      await waitFor(() => {
        expect(mockExecuteGetProducts).toHaveBeenCalled();
      });

      // Verify the hook is not in success state when error occurs
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should start in loading state', () => {
      mockExecuteGetProducts.mockResolvedValue(right(mockProducts));

      const { result } = renderHook(() => useProducts(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useProduct', () => {
    it('should return product on success', async () => {
      mockExecuteGetProductById.mockResolvedValue(right(mockProduct));

      const { result } = renderHook(() => useProduct(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe(1);
      expect(result.current.data?.title).toBe('Test Product');
    });

    it('should call use case with correct id', async () => {
      mockExecuteGetProductById.mockResolvedValue(right(mockProduct));

      renderHook(() => useProduct(42), { wrapper });

      await waitFor(() => {
        expect(mockExecuteGetProductById).toHaveBeenCalledWith(42);
      });
    });

    it('should not fetch when id is 0 or negative', () => {
      mockExecuteGetProductById.mockResolvedValue(right(mockProduct));

      const { result } = renderHook(() => useProduct(0), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockExecuteGetProductById).not.toHaveBeenCalled();
    });

    it('should call use case and handle error response', async () => {
      const error = networkError('Failed to fetch product');
      mockExecuteGetProductById.mockResolvedValue(left(error));

      const { result } = renderHook(() => useProduct(1), { wrapper });

      // Wait for the query to be called at least once
      await waitFor(() => {
        expect(mockExecuteGetProductById).toHaveBeenCalledWith(1);
      });

      // Verify the hook is not in success state when error occurs
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useInfiniteProducts', () => {
    it('should return first page of products on success', async () => {
      mockExecuteGetProducts.mockResolvedValue(right(mockProducts));

      const { result } = renderHook(() => useInfiniteProducts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toHaveLength(2);
    });

    it('should call use case with limit 10 and offset 0 for first page', async () => {
      mockExecuteGetProducts.mockResolvedValue(right(mockProducts));

      renderHook(() => useInfiniteProducts(), { wrapper });

      await waitFor(() => {
        expect(mockExecuteGetProducts).toHaveBeenCalledWith({
          limit: 10,
          offset: 0,
        });
      });
    });

    it('should start in loading state', () => {
      mockExecuteGetProducts.mockResolvedValue(right(mockProducts));

      const { result } = renderHook(() => useInfiniteProducts(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should have hasNextPage true when page is full', async () => {
      // Return exactly 10 products (PAGE_SIZE) to indicate there might be more
      const fullPage = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        price: 100,
        description: 'Description',
        images: ['https://example.com/image.jpg'],
        category: mockCategory,
      }));
      mockExecuteGetProducts.mockResolvedValue(right(fullPage));

      const { result } = renderHook(() => useInfiniteProducts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should have hasNextPage false when page is not full', async () => {
      // Return less than 10 products to indicate end of data
      mockExecuteGetProducts.mockResolvedValue(right(mockProducts)); // 2 products

      const { result } = renderHook(() => useInfiniteProducts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('should call use case and handle error response', async () => {
      const error = networkError('Network error');
      mockExecuteGetProducts.mockResolvedValue(left(error));

      const { result } = renderHook(() => useInfiniteProducts(), { wrapper });

      await waitFor(() => {
        expect(mockExecuteGetProducts).toHaveBeenCalled();
      });

      expect(result.current.isSuccess).toBe(false);
    });
  });
});
