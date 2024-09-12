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
      render: (thumbnail: string) => (
        <Image
          width={60}
          src={thumbnail}
          alt="product"
          className="rounded-md border border-gray-300"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      className: 'text-lg font-medium',
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
      render: (record: Product) => (
        <Button
          type="primary"
          className="bg-violet-900 hover:bg-violet-800"
          onClick={() => navigate(`/products/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {error && <p className="text-red-600 text-center">Error loading products...</p>}
      {isLoading ? (
        <p className="text-center">Loading products...</p>
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
            className: 'ant-pagination flex justify-center mt-4',
          }}
          className="bg-white rounded-lg shadow-md"
        />
      )}
    </div>
  );
};

export default ProductList;
