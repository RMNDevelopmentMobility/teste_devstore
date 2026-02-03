export interface Category {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
}

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly images: readonly string[];
  readonly category: Category;
}

export const createProduct = (data: {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
}): Product => ({
  id: data.id,
  title: data.title,
  price: data.price,
  description: data.description,
  images: Object.freeze([...data.images]),
  category: data.category,
});
