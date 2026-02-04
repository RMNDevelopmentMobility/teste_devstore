import { ProductMapper } from '../../mappers/ProductMapper';
import { ProductDTO } from '../../dtos/ProductDTO';

describe('ProductMapper', () => {
  const mockProductDTO: ProductDTO = {
    id: 1,
    title: 'Test Product',
    price: 199.99,
    description: 'A great product for testing',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    category: {
      id: 10,
      name: 'Electronics',
      image: 'https://example.com/electronics.jpg',
    },
  };

  describe('toDomain', () => {
    it('should map ProductDTO to Product entity', () => {
      const product = ProductMapper.toDomain(mockProductDTO);

      expect(product.id).toBe(1);
      expect(product.title).toBe('Test Product');
      expect(product.price).toBe(199.99);
      expect(product.description).toBe('A great product for testing');
      expect(product.images).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
    });

    it('should map category correctly (image -> imageUrl)', () => {
      const product = ProductMapper.toDomain(mockProductDTO);

      expect(product.category.id).toBe(10);
      expect(product.category.name).toBe('Electronics');
      expect(product.category.imageUrl).toBe('https://example.com/electronics.jpg');
    });

    it('should handle empty images array', () => {
      const dtoWithNoImages: ProductDTO = {
        ...mockProductDTO,
        images: [],
      };

      const product = ProductMapper.toDomain(dtoWithNoImages);

      expect(product.images).toEqual([]);
    });

    it('should freeze images array in domain entity', () => {
      const product = ProductMapper.toDomain(mockProductDTO);

      expect(Object.isFrozen(product.images)).toBe(true);
    });
  });

  describe('toDomainList', () => {
    it('should map array of ProductDTOs to Product entities', () => {
      const dtos: ProductDTO[] = [
        mockProductDTO,
        {
          id: 2,
          title: 'Second Product',
          price: 49.99,
          description: 'Another product',
          images: ['https://example.com/image3.jpg'],
          category: {
            id: 20,
            name: 'Clothing',
            image: 'https://example.com/clothing.jpg',
          },
        },
      ];

      const products = ProductMapper.toDomainList(dtos);

      expect(products).toHaveLength(2);
      expect(products[0].id).toBe(1);
      expect(products[0].title).toBe('Test Product');
      expect(products[1].id).toBe(2);
      expect(products[1].title).toBe('Second Product');
      expect(products[1].category.name).toBe('Clothing');
    });

    it('should return empty array for empty input', () => {
      const products = ProductMapper.toDomainList([]);

      expect(products).toEqual([]);
    });
  });
});
