import { z } from 'zod';

// Helper para converter string para number
const stringToNumber = z.union([z.number(), z.string().transform((val) => parseInt(val, 10))]);

export const CategoryDTOSchema = z.object({
  id: stringToNumber,
  name: z.string(),
  image: z.string(),
});

export const ProductDTOSchema = z.object({
  id: stringToNumber,
  title: z.string(),
  price: z.number(),
  description: z.string(),
  images: z.array(z.string()),
  category: CategoryDTOSchema,
});

export const ProductsResponseDTOSchema = z.object({
  products: z.array(ProductDTOSchema),
});

export const ProductResponseDTOSchema = z.object({
  product: ProductDTOSchema.nullable(),
});

export type CategoryDTO = z.infer<typeof CategoryDTOSchema>;
export type ProductDTO = z.infer<typeof ProductDTOSchema>;
export type ProductsResponseDTO = z.infer<typeof ProductsResponseDTOSchema>;
export type ProductResponseDTO = z.infer<typeof ProductResponseDTOSchema>;
