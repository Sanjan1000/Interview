import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../app/services/productsApi';
import { Descriptions, Image, Button, Rate } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ limit: 0, skip: 0 }); // Get all products (simplification)

  const product = data?.products.find((product) => product.id === Number(id));

  if (isLoading) return <p className="text-center py-4">Loading...</p>;
  if (error || !product) return <p className="text-center py-4">Error fetching product or product not found</p>;

  return (
    <section className="container mx-auto max-w-4xl py-8 px-4">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Image and Gallery */}
        <div className="flex justify-center mb-8 lg:mb-0">
          <Image src={product.thumbnail} alt={product.title} width={400} />
        </div>
        
        {/* Product Details */}
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
          <Rate disabled defaultValue={product.rating} className="mb-4" />
          <p className="text-lg font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <Descriptions bordered column={1} className="mb-6">
            <Descriptions.Item label="Category" className="text-lg">
              {product.category}
            </Descriptions.Item>
            <Descriptions.Item label="Brand" className="text-lg">
              {product.brand}
            </Descriptions.Item>
            <Descriptions.Item label="Stock" className="text-lg">
              {product.stock}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {product.description}
            </Descriptions.Item>
          </Descriptions>
          
          <div className="flex gap-4">
            <Button type="primary" className="w-full bg-violet-900 hover:bg-violet-800">
              Edit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
