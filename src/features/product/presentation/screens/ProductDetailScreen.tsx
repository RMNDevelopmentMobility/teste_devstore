import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../../../cart/presentation/hooks/useCart';
import { Typography, Button } from '@design-system';
import { LoadingSpinner, ErrorDisplay, useToast } from '@shared/components';
import { theme } from '@design-system/theme';
import { AppError, ErrorType } from '@core/errors';

const { width } = Dimensions.get('window');

const cleanImageUrl = (url: string): string | null => {
  if (!url) return null;
  let cleaned = url.replace(/^\[?"?|"?\]?$/g, '');
  cleaned = cleaned.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return null;
  }
  return cleaned;
};

const LargeImagePlaceholder: React.FC = () => (
  <View style={styles.mainImagePlaceholder}>
    <View style={placeholderStyles.icon}>
      <View style={placeholderStyles.mountain} />
      <View style={placeholderStyles.sun} />
    </View>
    <Text style={placeholderStyles.text}>Sem imagem</Text>
  </View>
);

const SmallImagePlaceholder: React.FC = () => (
  <View style={styles.thumbnailPlaceholder}>
    <View style={placeholderStyles.smallIcon}>
      <View style={placeholderStyles.smallMountain} />
      <View style={placeholderStyles.smallSun} />
    </View>
  </View>
);

const placeholderStyles = StyleSheet.create({
  icon: {
    width: 80,
    height: 56,
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  mountain: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.neutral.gray[300],
  },
  sun: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.neutral.gray[300],
  },
  text: {
    color: theme.colors.neutral.gray[400],
    fontSize: theme.typography.fontSize.md,
  },
  smallIcon: {
    width: 30,
    height: 22,
    position: 'relative',
  },
  smallMountain: {
    position: 'absolute',
    bottom: 0,
    left: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.neutral.gray[300],
  },
  smallSun: {
    position: 'absolute',
    top: 0,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral.gray[300],
  },
});

export const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);
  const { data: product, isLoading, error, refetch } = useProduct(productId);
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const handleImageError = (index: number): void => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  const getImageUrl = (url: string, index: number): string | null => {
    if (failedImages.has(index)) return null;
    return cleanImageUrl(url);
  };

  const handleAddToCart = (): void => {
    if (product) {
      const validImage = product.images.find((img) => cleanImageUrl(img)) || '';
      addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: cleanImageUrl(validImage) || '',
      });
      showToast('Produto adicionado ao carrinho', 'success');
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando detalhes do produto..." />;
  }

  if (error) {
    return <ErrorDisplay error={error as AppError} onRetry={refetch} />;
  }

  if (!product) {
    return (
      <ErrorDisplay
        error={{
          type: ErrorType.NOT_FOUND,
          message: 'Produto não encontrado',
          timestamp: new Date(),
        }}
        onRetry={refetch}
      />
    );
  }

  const images = product.images.length > 0 ? product.images : [];
  const hasImages = images.length > 0;
  const mainImageUrl = hasImages ? getImageUrl(images[selectedImageIndex], selectedImageIndex) : null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mainImageUrl ? (
          <Image
            source={{ uri: mainImageUrl }}
            style={styles.mainImage}
            resizeMode="cover"
            onError={() => handleImageError(selectedImageIndex)}
          />
        ) : (
          <LargeImagePlaceholder />
        )}

        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            {images.map((imageUrl, index) => {
              const thumbUrl = getImageUrl(imageUrl, index);
              return (
                <Pressable key={index} onPress={() => setSelectedImageIndex(index)}>
                  {thumbUrl ? (
                    <Image
                      source={{ uri: thumbUrl }}
                      style={[
                        styles.thumbnail,
                        selectedImageIndex === index && styles.thumbnailSelected,
                      ]}
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <View style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.thumbnailSelected,
                    ]}>
                      <SmallImagePlaceholder />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.content}>
          <Typography variant="body2" color="secondary" style={styles.category}>
            {product.category.name}
          </Typography>

          <Typography variant="h2" style={styles.title}>
            {product.title}
          </Typography>

          <Typography variant="h1" style={styles.price}>
            {formatPrice(product.price)}
          </Typography>

          <View style={styles.divider} />

          <Typography variant="h3" style={styles.sectionTitle}>
            Descrição
          </Typography>

          <Typography variant="body1" color="secondary" style={styles.description}>
            {product.description}
          </Typography>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        <Button variant="primary" size="md" fullWidth onPress={handleAddToCart}>
          Adicionar ao Carrinho
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },

  scrollView: {
    flex: 1,
  },

  mainImage: {
    width,
    height: width,
    backgroundColor: theme.colors.neutral.gray[100],
  },

  mainImagePlaceholder: {
    width,
    height: width,
    backgroundColor: theme.colors.neutral.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbnailContainer: {
    marginTop: theme.spacing.md,
  },

  thumbnailContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.neutral.gray[100],
    borderWidth: 2,
    borderColor: 'transparent',
  },

  thumbnailSelected: {
    borderColor: theme.colors.primary.main,
  },

  content: {
    padding: theme.spacing.md,
  },

  category: {
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },

  title: {
    marginBottom: theme.spacing.md,
  },

  price: {
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.lg,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginVertical: theme.spacing.lg,
  },

  sectionTitle: {
    marginBottom: theme.spacing.md,
  },

  description: {
    lineHeight: 24,
  },

  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    ...theme.shadows.md,
  },
});
