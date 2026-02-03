import { Either, E } from '@core/either';
import { pipe } from 'fp-ts/function';
import { AppError } from '@core/errors';
import { Product } from '../../domain/entities/Product';
import { ProductRepository, GetProductsParams } from '../../domain/repositories/ProductRepository';
import { ProductRemoteDataSource } from '../datasources/ProductRemoteDataSource';
import { ProductMapper } from '../mappers/ProductMapper';
import { ProductDTO } from '../dtos/ProductDTO';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly remoteDataSource: ProductRemoteDataSource) {}

  async getProducts(params: GetProductsParams): Promise<Either<AppError, Product[]>> {
    const result = await this.remoteDataSource.getProducts(params);
    return pipe(
      result,
      E.map((dtos: ProductDTO[]) => ProductMapper.toDomainList(dtos))
    );
  }

  async getProductById(id: number): Promise<Either<AppError, Product>> {
    const result = await this.remoteDataSource.getProductById(id);
    return pipe(
      result,
      E.map((dto: ProductDTO) => ProductMapper.toDomain(dto))
    );
  }
}
