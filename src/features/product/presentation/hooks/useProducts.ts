import { useQuery, useInfiniteQuery, UseQueryResult, UseInfiniteQueryResult } from '@tanstack/react-query';
import { productContainer } from '../../injection/ProductContainer';
import { Product } from '../../domain/entities/Product';
import { AppError } from '@core/errors';
import { isLeft } from '@core/either';
import { GetProductsParams } from '../../domain/repositories/ProductRepository';

const PAGE_SIZE = 10;

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetProductsParams) => [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  infinite: () => [...PRODUCT_QUERY_KEYS.all, 'infinite'] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
};

export const useProducts = (
  params: GetProductsParams = {}
): UseQueryResult<Product[], AppError> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: async () => {
      const result = await productContainer.getProductsUseCase.execute(params);

      if (isLeft(result)) {
        throw result.left;
      }

      return result.right;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useInfiniteProducts = (): UseInfiniteQueryResult<{ pages: Product[][]; pageParams: number[] }, AppError> => {
  return useInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEYS.infinite(),
    queryFn: async ({ pageParam = 0 }) => {
      console.log(`[InfiniteScroll] Fetching page with offset: ${pageParam}`);
      const result = await productContainer.getProductsUseCase.execute({
        limit: PAGE_SIZE,
        offset: pageParam,
      });

      if (isLeft(result)) {
        throw result.left;
      }

      return result.right;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length * PAGE_SIZE;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useProduct = (id: number): UseQueryResult<Product, AppError> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const result = await productContainer.getProductByIdUseCase.execute(id);

      if (isLeft(result)) {
        throw result.left;
      }

      return result.right;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: id > 0,
  });
};
