import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Product interface, add any additional fields if needed
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

// Category interface based on the JSON structure
export interface Category {
  slug: string;
  name: string;
  url: string;
}

// Product response structure for pagination
interface ProductResponse {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}

// Create the API slice
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  endpoints: (builder) => ({
    // Query to get products with pagination
    getProducts: builder.query<ProductResponse, { limit: number; skip: number }>({
      query: ({ limit, skip }) => `products?limit=${limit}&skip=${skip}`,
    }),

    // Query to get a single product by ID
    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
    }),

    // Query to get all categories
    getCategories: builder.query<Category[], void>({
      query: () => 'products/categories',
    }),

    // Mutation to update a product by ID
    updateProduct: builder.mutation<Product, { id: number; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

// Export the hooks to fetch data and update
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} = productsApi;
