import { ProductRemoteDataSourceImpl } from '../data/datasources/ProductRemoteDataSource';
import { ProductRepositoryImpl } from '../data/repositories/ProductRepositoryImpl';
import { GetProducts } from '../domain/use_cases/GetProducts';
import { GetProductById } from '../domain/use_cases/GetProductById';

class ProductContainer {
  private static instance: ProductContainer | null = null;

  private _remoteDataSource: ProductRemoteDataSourceImpl | null = null;
  private _repository: ProductRepositoryImpl | null = null;
  private _getProductsUseCase: GetProducts | null = null;
  private _getProductByIdUseCase: GetProductById | null = null;

  private constructor() {}

  static getInstance(): ProductContainer {
    if (!ProductContainer.instance) {
      ProductContainer.instance = new ProductContainer();
    }
    return ProductContainer.instance;
  }

  get remoteDataSource(): ProductRemoteDataSourceImpl {
    if (!this._remoteDataSource) {
      this._remoteDataSource = new ProductRemoteDataSourceImpl();
    }
    return this._remoteDataSource;
  }

  get repository(): ProductRepositoryImpl {
    if (!this._repository) {
      this._repository = new ProductRepositoryImpl(this.remoteDataSource);
    }
    return this._repository;
  }

  get getProductsUseCase(): GetProducts {
    if (!this._getProductsUseCase) {
      this._getProductsUseCase = new GetProducts(this.repository);
    }
    return this._getProductsUseCase;
  }

  get getProductByIdUseCase(): GetProductById {
    if (!this._getProductByIdUseCase) {
      this._getProductByIdUseCase = new GetProductById(this.repository);
    }
    return this._getProductByIdUseCase;
  }
}

export const productContainer = ProductContainer.getInstance();
