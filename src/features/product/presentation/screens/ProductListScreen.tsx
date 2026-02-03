import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useInfiniteProducts } from '../hooks/useProducts';
import { useCart } from '../../../cart/presentation/hooks/useCart';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner, ErrorDisplay, useToast } from '@shared/components';
import { theme } from '@design-system/theme';
import { Product } from '../../domain/entities/Product';
import { AppError, ErrorType } from '@core/errors';

export const ProductListScreen: React.FC = () => {
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useInfiniteProducts();

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

  const handleAddToCart = (product: Product): void => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.images[0] || '',
    });
    showToast('Produto adicionado ao carrinho', 'success');
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary.main} />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return <LoadingSpinner message="Carregando produtos..." />;
  }

  if (error) {
    return <ErrorDisplay error={error as AppError} onRetry={refetch} />;
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ErrorDisplay
          error={{
            type: ErrorType.NOT_FOUND,
            message: 'Nenhum produto encontrado',
            timestamp: new Date(),
          }}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={() => handleAddToCart(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },

  listContent: {
    padding: theme.spacing.md,
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },

  loadingFooter: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
});
