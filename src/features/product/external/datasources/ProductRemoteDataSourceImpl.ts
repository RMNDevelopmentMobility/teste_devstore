import { graphqlClient } from '@core/graphql';
import { GET_PRODUCTS, GET_PRODUCT_BY_ID } from '../graphql/queries';
import {
  ProductsResponseDTO,
  ProductsResponseDTOSchema,
  ProductResponseDTO,
  ProductResponseDTOSchema,
  ProductDTO,
} from '../../data/dtos/ProductDTO';
import { Either, left, right } from '@core/either';
import { AppError, networkError, notFoundError, validationError } from '@core/errors';
import { logger } from '@core/logger';
import {
  ProductRemoteDataSource,
  GetProductsParams,
} from '../../data/datasources/ProductRemoteDataSource';

export class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  async getProducts(params: GetProductsParams): Promise<Either<AppError, ProductDTO[]>> {
    try {
      logger.debug('Fetching products from API', params);

      const response = await graphqlClient.request<ProductsResponseDTO>(GET_PRODUCTS, params);

      const validationResult = ProductsResponseDTOSchema.safeParse(response);

      if (!validationResult.success) {
        logger.error('Falha na validação da resposta de produtos', validationResult.error);
        return left(validationError('Dados de produto inválidos recebidos da API'));
      }

      logger.info('Produtos carregados com sucesso', {
        count: validationResult.data.products.length,
      });

      return right(validationResult.data.products);
    } catch (error) {
      logger.error('Falha ao buscar produtos', error);
      return left(networkError('Falha ao buscar produtos', error));
    }
  }

  async getProductById(id: number): Promise<Either<AppError, ProductDTO>> {
    try {
      logger.debug('Buscando produto por ID', { id });

      const response = await graphqlClient.request<ProductResponseDTO>(GET_PRODUCT_BY_ID, { id });

      const validationResult = ProductResponseDTOSchema.safeParse(response);

      if (!validationResult.success) {
        logger.error('Falha na validação da resposta do produto', validationResult.error);
        return left(validationError('Dados de produto inválidos recebidos da API'));
      }

      if (!validationResult.data.product) {
        logger.warn('Produto não encontrado', { id });
        return left(notFoundError(`Produto com id ${id} não encontrado`));
      }

      logger.info('Produto carregado com sucesso', { id });

      return right(validationResult.data.product);
    } catch (error) {
      logger.error('Falha ao buscar produto', error, { id });
      return left(networkError(`Falha ao buscar produto com id ${id}`, error));
    }
  }
}
