import { createProduct, Product, Category } from '../../entities/Product';

describe('Product Entity', () => {
  const mockCategory: Category = {
    id: 1,
    name: 'Electronics',
    imageUrl: 'https://example.com/category.jpg',
  };

  describe('createProduct', () => {
    it('should create a product with all properties', () => {
      const productData = {
        id: 1,
        title: 'Test Product',
        price: 199.99,
        description: 'A great product for testing',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        category: mockCategory,
      };

      const product = createProduct(productData);

      expect(product.id).toBe(1);
      expect(product.title).toBe('Test Product');
      expect(product.price).toBe(199.99);
      expect(product.description).toBe('A great product for testing');
      expect(product.images).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
      expect(product.category).toEqual(mockCategory);
    });

    it('should freeze the images array', () => {
      const productData = {
        id: 1,
        title: 'Test Product',
        price: 100,
        description: 'Description',
        images: ['https://example.com/image.jpg'],
        category: mockCategory,
      };

      const product = createProduct(productData);

      expect(Object.isFrozen(product.images)).toBe(true);
    });

    it('should not be affected by mutations to the original images array', () => {
      const images = ['https://example.com/image1.jpg'];
      const productData = {
        id: 1,
        title: 'Test Product',
        price: 100,
        description: 'Description',
        images,
        category: mockCategory,
      };

      const product = createProduct(productData);
      images.push('https://example.com/image2.jpg');

      expect(product.images).toHaveLength(1);
    });

    it('should handle empty images array', () => {
      const productData = {
        id: 1,
        title: 'Product without images',
        price: 50,
        description: 'No images available',
        images: [],
        category: mockCategory,
      };

      const product = createProduct(productData);

      expect(product.images).toEqual([]);
    });

    it('should handle products with different categories', () => {
      const clothingCategory: Category = {
        id: 2,
        name: 'Clothing',
        imageUrl: 'https://example.com/clothing.jpg',
      };

      const productData = {
        id: 1,
        title: 'T-Shirt',
        price: 29.99,
        description: 'A comfortable t-shirt',
        images: ['https://example.com/tshirt.jpg'],
        category: clothingCategory,
      };

      const product = createProduct(productData);

      expect(product.category.id).toBe(2);
      expect(product.category.name).toBe('Clothing');
    });
  });

  describe('Category interface', () => {
    it('should have readonly properties', () => {
      const category: Category = {
        id: 1,
        name: 'Test Category',
        imageUrl: 'https://example.com/category.jpg',
      };

      expect(category.id).toBe(1);
      expect(category.name).toBe('Test Category');
      expect(category.imageUrl).toBe('https://example.com/category.jpg');
    });
  });
});
