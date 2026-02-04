import { ProductRepositoryImpl } from '../../repositories/ProductRepositoryImpl';
import { ProductRemoteDataSource } from '../../datasources/ProductRemoteDataSource';
import { ProductDTO } from '../../dtos/ProductDTO';
import { right, left, isRight, isLeft } from '@core/either';
import { networkError, AppError } from '@core/errors';

describe('ProductRepositoryImpl', () => {
  let repository: ProductRepositoryImpl;
  let mockDataSource: jest.Mocked<ProductRemoteDataSource>;

  const mockProductDTO: ProductDTO = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    description: 'A test product description',
    images: ['https://example.com/image.jpg'],
    category: {
      id: 1,
      name: 'Electronics',
      image: 'https://example.com/category.jpg',
    },
  };

  const mockProductDTOList: ProductDTO[] = [
    mockProductDTO,
    {
      id: 2,
      title: 'Another Product',
      price: 149.99,
      description: 'Another product description',
      images: ['https://example.com/image2.jpg'],
      category: {
        id: 2,
        name: 'Clothing',
        image: 'https://example.com/clothing.jpg',
      },
    },
  ];

  beforeEach(() => {
    mockDataSource = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
    };
    repository = new ProductRepositoryImpl(mockDataSource);
  });

  describe('getProducts', () => {
    it('should return mapped products on success', async () => {
      mockDataSource.getProducts.mockResolvedValue(right(mockProductDTOList));

      const result = await repository.getProducts({ limit: 10, offset: 0 });

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right).toHaveLength(2);
        expect(result.right[0].id).toBe(1);
        expect(result.right[0].title).toBe('Test Product');
        expect(result.right[0].category.name).toBe('Electronics');
        // Verify DTO to Domain mapping (image -> imageUrl)
        expect(result.right[0].category.imageUrl).toBe('https://example.com/category.jpg');
      }
    });

    it('should pass params to data source', async () => {
      mockDataSource.getProducts.mockResolvedValue(right([]));

      await repository.getProducts({ limit: 20, offset: 10 });

      expect(mockDataSource.getProducts).toHaveBeenCalledWith({ limit: 20, offset: 10 });
    });

    it('should return error when data source fails', async () => {
      const error: AppError = networkError('Network error');
      mockDataSource.getProducts.mockResolvedValue(left(error));

      const result = await repository.getProducts({});

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('NETWORK_ERROR');
      }
    });

    it('should return empty array when no products', async () => {
      mockDataSource.getProducts.mockResolvedValue(right([]));

      const result = await repository.getProducts({});

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right).toHaveLength(0);
      }
    });
  });

  describe('getProductById', () => {
    it('should return mapped product on success', async () => {
      mockDataSource.getProductById.mockResolvedValue(right(mockProductDTO));

      const result = await repository.getProductById(1);

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right.id).toBe(1);
        expect(result.right.title).toBe('Test Product');
        expect(result.right.price).toBe(99.99);
        expect(result.right.description).toBe('A test product description');
        expect(result.right.images).toEqual(['https://example.com/image.jpg']);
        expect(result.right.category.imageUrl).toBe('https://example.com/category.jpg');
      }
    });

    it('should call data source with correct id', async () => {
      mockDataSource.getProductById.mockResolvedValue(right(mockProductDTO));

      await repository.getProductById(42);

      expect(mockDataSource.getProductById).toHaveBeenCalledWith(42);
    });

    it('should return error when data source fails', async () => {
      const error: AppError = networkError('Failed to fetch product');
      mockDataSource.getProductById.mockResolvedValue(left(error));

      const result = await repository.getProductById(1);

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('NETWORK_ERROR');
      }
    });
  });
});
