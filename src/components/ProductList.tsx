import React, { useState } from 'react';
import { Button, Table, Pagination } from 'antd';
import { useGetProductsQuery } from '../app/services/productsApi';
import { useNavigate } from 'react-router-dom';
import { Product } from '../app/services/productsApi'; 

const ProductList: React.FC = () => {
  const [page, setPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(10); // Items per page
  const [loadAll, setLoadAll] = useState(false); // To load all items when limit=0

  const { data, isLoading, error } = useGetProductsQuery({
    limit: loadAll ? 0 : pageSize, // Use limit=0 to fetch all items if required
    skip: loadAll ? 0 : (page - 1) * pageSize, // Skip is irrelevant when loading all items
  });

  const navigate = useNavigate();

  // Handle pagination page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoadAll(false); // Reset loading all items if user goes back to pagination
  };

  // Handle loading all items
  const handleLoadAll = () => {
    setLoadAll(true); // Set loadAll to true to fetch all items
    setPage(1); // Reset to page 1
  };

  const handleViewDetails = (id: number) => {
    navigate(`/products/${id}`);
  };

  // Columns for the Ant Design Table
  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <img src={thumbnail} alt="thumbnail" style={{ width: '50px', borderRadius: '5px' }} />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Product) => {
        const discountedPrice = price * (1 - record.discountPercentage / 100);
        return (
          <>
            <span style={{ textDecoration: 'line-through', color: '#aaa' }}>${price.toFixed(2)}</span>
            <span style={{ color: 'green', marginLeft: '8px' }}>${discountedPrice.toFixed(2)}</span>
          </>
        );
      },
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (discountPercentage: number) => `${discountPercentage.toFixed(2)}%`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => rating.toFixed(2),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Product) => (
        <Button
          type="primary"
          className="bg-violet-900 hover:bg-violet-800"
          onClick={() => handleViewDetails(record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {error && <p className="text-red-600 text-center">Error loading products...</p>}
      {isLoading && <p className="text-center">Loading products...</p>}

      {/* Ant Design Table */}
      <Table
        columns={columns}
        dataSource={data?.products}
        pagination={false} // Disable internal pagination, we handle it manually
        rowKey="id" // Unique key for each row
        loading={isLoading} // Show loading state
      />

      {/* Pagination Control */}
      {!loadAll && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={data?.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false} // Hide changing the number of items per page
          />
        </div>
      )}

      {/* Load All Items Button */}
      {!loadAll && (
        <div className="flex justify-center mt-4">
          <Button type="primary" onClick={handleLoadAll}>
            Load All Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
