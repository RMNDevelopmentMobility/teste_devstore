import { Product, Category, createProduct } from '../../domain/entities/Product';
import { ProductDTO, CategoryDTO } from '../dtos/ProductDTO';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    const category: Category = {
      id: dto.category.id,
      name: dto.category.name,
      imageUrl: dto.category.image,
    };

    return createProduct({
      id: dto.id,
      title: dto.title,
      price: dto.price,
      description: dto.description,
      images: dto.images,
      category,
    });
  }

  static toDomainList(dtos: ProductDTO[]): Product[] {
    return dtos.map((dto) => ProductMapper.toDomain(dto));
  }
}
