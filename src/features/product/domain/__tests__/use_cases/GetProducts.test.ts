import { GetProducts } from '../../use_cases/GetProducts';
import { ProductRepository } from '../../repositories/ProductRepository';
import { Product, Category } from '../../entities/Product';
import { right, left, isRight, isLeft } from '@core/either';
import { networkError } from '@core/errors';

describe('GetProducts Use Case', () => {
  let useCase: GetProducts;
  let mockRepository: jest.Mocked<ProductRepository>;

  const mockCategory: Category = {
    id: 1,
    name: 'Electronics',
    imageUrl: 'https://example.com/category.jpg',
  };

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Description 1',
      images: ['https://example.com/image1.jpg'],
      category: mockCategory,
    },
    {
      id: 2,
      title: 'Product 2',
      price: 200,
      description: 'Description 2',
      images: ['https://example.com/image2.jpg'],
      category: mockCategory,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
    };
    useCase = new GetProducts(mockRepository);
  });

  it('should return products from repository', async () => {
    mockRepository.getProducts.mockResolvedValue(right(mockProducts));

    const result = await useCase.execute({});

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right).toHaveLength(2);
      expect(result.right[0].id).toBe(1);
    }
  });

  it('should use default limit and offset when not provided', async () => {
    mockRepository.getProducts.mockResolvedValue(right([]));

    await useCase.execute({});

    expect(mockRepository.getProducts).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
    });
  });

  it('should pass custom limit and offset to repository', async () => {
    mockRepository.getProducts.mockResolvedValue(right([]));

    await useCase.execute({ limit: 10, offset: 5 });

    expect(mockRepository.getProducts).toHaveBeenCalledWith({
      limit: 10,
      offset: 5,
    });
  });

  it('should return error when repository fails', async () => {
    const error = networkError('Network error');
    mockRepository.getProducts.mockResolvedValue(left(error));

    const result = await useCase.execute({});

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.left.type).toBe('NETWORK_ERROR');
    }
  });

  it('should return empty array when no products', async () => {
    mockRepository.getProducts.mockResolvedValue(right([]));

    const result = await useCase.execute({});

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right).toEqual([]);
    }
  });
});
