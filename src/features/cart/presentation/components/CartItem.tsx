import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { Typography } from '@design-system';
import { theme } from '@design-system/theme';
import { CartItem as CartItemEntity } from '../../domain/entities/CartItem';

interface CartItemProps {
  item: CartItemEntity;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const TrashIcon: React.FC = () => (
  <View style={trashStyles.container}>
    <View style={trashStyles.handle} />
    <View style={trashStyles.lid} />
    <View style={trashStyles.body}>
      <View style={trashStyles.line} />
      <View style={trashStyles.line} />
    </View>
  </View>
);

const trashStyles = StyleSheet.create({
  container: {
    width: 20,
    height: 26,
    alignItems: 'center',
  },
  handle: {
    width: 6,
    height: 4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.colors.error.dark,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: -1,
  },
  lid: {
    width: 18,
    height: 3,
    backgroundColor: theme.colors.error.dark,
    borderRadius: 1,
    marginBottom: 2,
  },
  body: {
    width: 14,
    height: 14,
    backgroundColor: theme.colors.error.dark,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 2,
  },
  line: {
    width: 2,
    height: 8,
    backgroundColor: theme.colors.background.paper,
    borderRadius: 1,
  },
});

const cleanImageUrl = (url: string): string | null => {
  if (!url) return null;
  let cleaned = url.replace(/^\[?"?|"?\]?$/g, '');
  cleaned = cleaned.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return null;
  }
  return cleaned;
};

const SmallImagePlaceholder: React.FC = () => (
  <View style={styles.placeholder}>
    <View style={placeholderStyles.icon}>
      <View style={placeholderStyles.mountain} />
      <View style={placeholderStyles.sun} />
    </View>
  </View>
);

const placeholderStyles = StyleSheet.create({
  icon: {
    width: 40,
    height: 28,
    position: 'relative',
  },
  mountain: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.neutral.gray[300],
  },
  sun: {
    position: 'absolute',
    top: 0,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.neutral.gray[300],
  },
});

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const subtotal = item.price * item.quantity;
  const imageUrl = cleanImageUrl(item.imageUrl);
  const showPlaceholder = imageError || !imageUrl;

  const handleImageError = (): void => {
    setImageError(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <TrashIcon />
        </Pressable>

        {showPlaceholder ? (
          <SmallImagePlaceholder />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={handleImageError}
          />
        )}

        <View style={styles.info}>
          <Typography variant="body1" style={styles.title} numberOfLines={2}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="secondary">
            {formatPrice(item.price)} / un
          </Typography>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.quantityControl}>
          <Pressable onPress={onDecrement} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable onPress={onIncrement} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>

        <Typography variant="h3" style={styles.subtotal}>
          {formatPrice(subtotal)}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  removeButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },

  image: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.neutral.gray[100],
  },

  placeholder: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.neutral.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },

  title: {
    marginBottom: theme.spacing.xs,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.gray[100],
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  quantity: {
    marginHorizontal: theme.spacing.md,
    minWidth: 28,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },

  subtotal: {
    color: theme.colors.primary.main,
    minWidth: 100,
    textAlign: 'right',
  },
});
