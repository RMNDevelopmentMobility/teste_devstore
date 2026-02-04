import { GetProductById } from '../../use_cases/GetProductById';
import { ProductRepository } from '../../repositories/ProductRepository';
import { Product, Category } from '../../entities/Product';
import { right, left, isRight, isLeft } from '@core/either';
import { networkError, notFoundError } from '@core/errors';

describe('GetProductById Use Case', () => {
  let useCase: GetProductById;
  let mockRepository: jest.Mocked<ProductRepository>;

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

  beforeEach(() => {
    mockRepository = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
    };
    useCase = new GetProductById(mockRepository);
  });

  it('should return product from repository', async () => {
    mockRepository.getProductById.mockResolvedValue(right(mockProduct));

    const result = await useCase.execute(1);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right.id).toBe(1);
      expect(result.right.title).toBe('Test Product');
    }
  });

  it('should pass id to repository', async () => {
    mockRepository.getProductById.mockResolvedValue(right(mockProduct));

    await useCase.execute(42);

    expect(mockRepository.getProductById).toHaveBeenCalledWith(42);
  });

  it('should return error when repository fails', async () => {
    const error = networkError('Network error');
    mockRepository.getProductById.mockResolvedValue(left(error));

    const result = await useCase.execute(1);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.left.type).toBe('NETWORK_ERROR');
    }
  });

  it('should return not found error when product does not exist', async () => {
    const error = notFoundError('Product not found');
    mockRepository.getProductById.mockResolvedValue(left(error));

    const result = await useCase.execute(999);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.left.type).toBe('NOT_FOUND');
    }
  });
});
