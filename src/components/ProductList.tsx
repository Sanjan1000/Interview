// src/components/ProductList.tsx
import React, { useState } from 'react';
import { Table, Button, Image } from 'antd';
import { useGetProductsQuery } from '../app/services/productsApi';
import { useNavigate } from 'react-router-dom';
import { Product } from '../app/services/productsApi'; 

const ProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  // Fetch products with pagination using RTK Query
  const { data, isLoading, error } = useGetProductsQuery({
    limit: pageSize,
    skip,
  });

  const navigate = useNavigate();

  // Ant Design Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => <Image width={50} src={thumbnail} alt="product" />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Action',
      key: 'action',
      // Specify that record is of type Product
      render: (record: Product) => (
        <Button type="primary" onClick={() => navigate(`/products/${record.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {error && <p>Error loading products...</p>}
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <Table
          columns={columns}
          dataSource={data?.products}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: data?.total,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
