import { Either } from '@core/either';
import { AppError } from '@core/errors';
import { ProductDTO } from '../dtos/ProductDTO';

export interface GetProductsParams extends Record<string, unknown> {
  limit?: number;
  offset?: number;
}

export interface ProductRemoteDataSource {
  getProducts(params: GetProductsParams): Promise<Either<AppError, ProductDTO[]>>;
  getProductById(id: number): Promise<Either<AppError, ProductDTO>>;
}
