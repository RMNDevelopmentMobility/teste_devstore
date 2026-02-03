import { Either, map } from '@core/either';
import { AppError } from '@core/errors';
import { Product } from '../../domain/entities/Product';
import { ProductRepository, GetProductsParams } from '../../domain/repositories/ProductRepository';
import { ProductRemoteDataSource } from '../datasources/ProductRemoteDataSource';
import { ProductMapper } from '../mappers/ProductMapper';
import * as E from 'fp-ts/Either';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly remoteDataSource: ProductRemoteDataSource) {}

  async getProducts(params: GetProductsParams): Promise<Either<AppError, Product[]>> {
    const result = await this.remoteDataSource.getProducts(params);
    return map((dtos) => ProductMapper.toDomainList(dtos))(result);
  }

  async getProductById(id: number): Promise<Either<AppError, Product>> {
    const result = await this.remoteDataSource.getProductById(id);
    return map((dto) => ProductMapper.toDomain(dto))(result);
  }
}
