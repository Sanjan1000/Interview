import React from 'react';
import { Button, Table, Pagination } from 'antd';
import { useGetProductsQuery } from '../app/services/productsApi';
import { useNavigate } from 'react-router-dom';
import { Product } from '../app/services/productsApi';

const ProductList: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [loadAll, setLoadAll] = React.useState(false);

  const { data, isLoading, error } = useGetProductsQuery({
    limit: loadAll ? 0 : pageSize,
    skip: loadAll ? 0 : (page - 1) * pageSize,
  });

  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoadAll(false);
  };

  const handleLoadAll = () => {
    setLoadAll(true);
    setPage(1);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/products/${id}`);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <img src={thumbnail} alt="thumbnail" className="w-12 h-12 rounded-md" />
      ),
      width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Product) => {
        const discountedPrice = price * (1 - (record.discountPercentage || 0) / 100);
        return (
          <>
            <span className="line-through text-gray-400">${price.toFixed(2)}</span>
            <span className="text-green-600 ml-2">${discountedPrice.toFixed(2)}</span>
          </>
        );
      },
      width: 150,
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (discountPercentage: number) => `${discountPercentage.toFixed(2)}%`,
      width: 120,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => rating.toFixed(2),
      width: 100,
    },
    {
      title: 'Description',
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
      width: 150,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {error && <p className="text-red-600 text-center">Error loading products...</p>}
      {isLoading && <p className="text-center">Loading products...</p>}

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data?.products}
          pagination={false}
          rowKey="id"
          loading={isLoading}
        />
      </div>

      {!loadAll && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={data?.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}

      {!loadAll && (
        <div className="flex justify-center mt-4">
          <Button className="bg-violet-900 hover:bg-violet-800" type="primary" onClick={handleLoadAll}>
            Load All Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
