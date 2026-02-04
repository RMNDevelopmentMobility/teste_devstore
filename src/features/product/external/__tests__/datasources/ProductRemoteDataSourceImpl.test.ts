import { ProductRemoteDataSourceImpl } from '../../datasources/ProductRemoteDataSourceImpl';
import { isRight, isLeft } from '@core/either';
import { ProductDTO } from '../../../data/dtos/ProductDTO';

// Mock the graphql client
const mockRequest = jest.fn();
jest.mock('@core/graphql', () => ({
  graphqlClient: {
    request: (...args: unknown[]) => mockRequest(...args),
  },
}));

describe('ProductRemoteDataSourceImpl', () => {
  let dataSource: ProductRemoteDataSourceImpl;

  const mockProductDTO: ProductDTO = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    description: 'A test product',
    images: ['https://example.com/image.jpg'],
    category: {
      id: 1,
      name: 'Electronics',
      image: 'https://example.com/category.jpg',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dataSource = new ProductRemoteDataSourceImpl();
  });

  describe('getProducts', () => {
    it('should return products on successful API call', async () => {
      const mockResponse = {
        products: [mockProductDTO],
      };
      mockRequest.mockResolvedValue(mockResponse);

      const result = await dataSource.getProducts({ limit: 10, offset: 0 });

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right).toHaveLength(1);
        expect(result.right[0].id).toBe(1);
        expect(result.right[0].title).toBe('Test Product');
      }
    });

    it('should pass limit and offset to GraphQL request', async () => {
      mockRequest.mockResolvedValue({ products: [] });

      await dataSource.getProducts({ limit: 20, offset: 5 });

      expect(mockRequest).toHaveBeenCalledWith(
        expect.anything(),
        { limit: 20, offset: 5 }
      );
    });

    it('should return validation error for invalid response', async () => {
      const invalidResponse = {
        products: [{ id: 1 }], // Missing required fields
      };
      mockRequest.mockResolvedValue(invalidResponse);

      const result = await dataSource.getProducts({});

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('VALIDATION_ERROR');
      }
    });

    it('should return network error on API failure', async () => {
      mockRequest.mockRejectedValue(new Error('Network failure'));

      const result = await dataSource.getProducts({});

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('NETWORK_ERROR');
        expect(result.left.message).toContain('Falha ao buscar produtos');
      }
    });

    it('should return empty array when API returns empty products', async () => {
      mockRequest.mockResolvedValue({ products: [] });

      const result = await dataSource.getProducts({});

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right).toEqual([]);
      }
    });
  });

  describe('getProductById', () => {
    it('should return product on successful API call', async () => {
      const mockResponse = {
        product: mockProductDTO,
      };
      mockRequest.mockResolvedValue(mockResponse);

      const result = await dataSource.getProductById(1);

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right.id).toBe(1);
        expect(result.right.title).toBe('Test Product');
      }
    });

    it('should pass id to GraphQL request', async () => {
      mockRequest.mockResolvedValue({ product: mockProductDTO });

      await dataSource.getProductById(42);

      expect(mockRequest).toHaveBeenCalledWith(
        expect.anything(),
        { id: 42 }
      );
    });

    it('should return not found error when product is null', async () => {
      mockRequest.mockResolvedValue({ product: null });

      const result = await dataSource.getProductById(999);

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('NOT_FOUND');
        expect(result.left.message).toContain('999');
      }
    });

    it('should return validation error for invalid product data', async () => {
      const invalidResponse = {
        product: { id: 1, title: 'Test' }, // Missing required fields
      };
      mockRequest.mockResolvedValue(invalidResponse);

      const result = await dataSource.getProductById(1);

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('VALIDATION_ERROR');
      }
    });

    it('should return network error on API failure', async () => {
      mockRequest.mockRejectedValue(new Error('Connection timeout'));

      const result = await dataSource.getProductById(1);

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.left.type).toBe('NETWORK_ERROR');
        expect(result.left.message).toContain('Falha ao buscar produto');
      }
    });
  });
});
