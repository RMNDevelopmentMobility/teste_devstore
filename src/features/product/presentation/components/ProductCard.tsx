import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Card, Typography, Button } from '@design-system';
import { theme } from '@design-system/theme';
import { Product } from '../../domain/entities/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const cleanImageUrl = (url: string): string => {
  if (!url) return '';
  // Remove brackets and quotes that some APIs return
  let cleaned = url.replace(/^\[?"?|"?\]?$/g, '');
  // Trim whitespace
  cleaned = cleaned.trim();
  // Check if it's a valid URL
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return '';
  }
  return cleaned;
};

const getValidImageUrl = (images: readonly string[]): string | null => {
  for (const img of images) {
    const cleaned = cleanImageUrl(img);
    if (cleaned) return cleaned;
  }
  return null;
};

const ImagePlaceholder: React.FC = () => (
  <View style={styles.placeholder}>
    <View style={styles.placeholderIcon}>
      <View style={styles.mountain} />
      <View style={styles.sun} />
    </View>
    <Text style={styles.placeholderText}>Sem imagem</Text>
  </View>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  const handlePress = (): void => {
    router.push(`/products/${product.id}`);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const imageUrl = getValidImageUrl(product.images);
  const showPlaceholder = imageError || !imageUrl;

  const handleImageError = (): void => {
    setImageError(true);
  };

  return (
    <Card elevation="md" padding="md" style={styles.card}>
      <Pressable onPress={handlePress}>
        {showPlaceholder ? (
          <ImagePlaceholder />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" onError={handleImageError} />
        )}
        <View style={styles.content}>
          <Typography variant="body2" color="secondary" style={styles.category}>
            {product.category.name}
          </Typography>
          <Typography variant="h3" style={styles.title} numberOfLines={2}>
            {product.title}
          </Typography>
          <Typography variant="h2" style={styles.price}>
            {formatPrice(product.price)}
          </Typography>
        </View>
      </Pressable>
      <Button variant="primary" size="md" fullWidth onPress={onAddToCart}>
        Adicionar ao Carrinho
      </Button>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.gray[100],
  },

  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderIcon: {
    width: 60,
    height: 40,
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },

  mountain: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.neutral.gray[300],
  },

  sun: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.neutral.gray[300],
  },

  placeholderText: {
    color: theme.colors.neutral.gray[400],
    fontSize: theme.typography.fontSize.sm,
  },

  content: {
    marginTop: theme.spacing.md,
  },

  category: {
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    fontSize: theme.typography.fontSize.xs,
  },

  title: {
    marginBottom: theme.spacing.sm,
    minHeight: 48,
  },

  price: {
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.md,
  },
});
