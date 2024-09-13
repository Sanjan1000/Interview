import React, { useState, useEffect } from 'react';
import { Button, Image } from 'antd';
import { useGetProductsQuery } from '../app/services/productsApi';
import { useNavigate } from 'react-router-dom';
import { Product } from '../app/services/productsApi'; 
import { useInView } from 'react-intersection-observer';

const ProductList: React.FC = () => {
  const [page, setPage] = useState(1); // Track current page
  const [products, setProducts] = useState<Product[]>([]);
  const pageSize = 10;

  const { data, isLoading, error } = useGetProductsQuery({
    limit: pageSize,
    skip: (page - 1) * pageSize,
  });

  const navigate = useNavigate();
  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  // Load more products when the user scrolls near the bottom
  useEffect(() => {
    if (inView && !isLoading && data) {
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, isLoading, data]);

  const handleViewDetails = (id: number) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {error && <p className="text-red-600 text-center">Error loading products...</p>}
      {isLoading && <p className="text-center">Loading products...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          // Calculate discounted price
          const discountedPrice = product.price * (1 - product.discountPercentage / 100);
          
          return (
            <div key={product.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
              <Image
                width={100}
                src={product.thumbnail}
                alt={product.title}
                className="rounded-md border border-gray-300 mb-2"
              />
              <h3 className="text-lg font-medium mb-2">{product.title}</h3>
              <p className="text-sm mb-2">Category: {product.category}</p>
              <p className="text-sm mb-2">Brand: {product.brand}</p>
              <p className="text-sm mb-2">Rating: {product.rating.toFixed(2)}</p>
              <p className="text-sm mb-2">Stock: {product.stock}</p>
              <p className="text-lg font-medium mt-2">
                <span className="line-through text-gray-500">${product.price.toFixed(2)}</span> 
                <span className="ml-2 text-green-600">${discountedPrice.toFixed(2)}</span>
              </p>
              <p className="text-sm text-red-500 mb-2 italic">Discount: {product.discountPercentage.toFixed(2)}%</p>
              <Button
                type="primary"
                className="bg-violet-900 hover:bg-violet-800 mt-2"
                onClick={() => handleViewDetails(product.id)}
              >
                View Details
              </Button>
            </div>
          );
        })}
      </div>
      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-2" />
    </div>
  );
};

export default ProductList;
