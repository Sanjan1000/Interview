import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  }),
});

// Export the hooks to fetch data
export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;