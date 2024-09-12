import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../app/services/productsApi';
import { Descriptions, Image } from 'antd';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ limit: 0, skip: 0 }); // Get all products (simplification)

  const product = data?.products.find((product) => product.id === Number(id));

  if (isLoading) return <p>Loading...</p>;
  if (error || !product) return <p>Error fetching product or product not found</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Image src={product.thumbnail} alt={product.title} width={200} />
      <Descriptions title={product.title} bordered>
        <Descriptions.Item label="Price">${product.price.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
        <Descriptions.Item label="Brand">{product.brand}</Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
        <Descriptions.Item label="Rating">{product.rating}</Descriptions.Item>
        <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ProductDetail;