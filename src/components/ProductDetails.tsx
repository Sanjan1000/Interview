import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../app/services/productsApi';
import { Descriptions, Image, Button, Rate, Tag, Card, Layout } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import { ArrowLeftOutlined, EditOutlined,DownOutlined  } from '@ant-design/icons';

const { Content } = Layout;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProductsQuery({ limit: 0, skip: 0 }); // Get all products (simplification)

  const product = data?.products.find((product) => product.id === Number(id));

  if (isLoading) return <p className="text-center py-4">Loading...</p>;
  if (error || !product) return <p className="text-center py-4">Error fetching product or product not found</p>;

  // Calculate discounted price
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Layout className="layout" style={{ background: '#f5f5f5', padding: '20px' }}>
      <Content className="site-layout-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', background: '#fff', borderRadius: '8px' }}>
        
        {/* Back Button */}
        <Button
  type="default"
  onClick={() => navigate('/')}  // Ensure this goes back to ProductList
  className="border-none"
  style={{ marginBottom: '20px' }}
>
  <ArrowLeftOutlined style={{ marginRight: '8px' }} />
  
</Button>

        {/* Layout for product image and details */}
        <div className="product-detail-layout lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Image and QR Code in Column */}
          <div className="flex flex-col items-center mb-8 lg:mb-0">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={400}
              style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}
            />
            <h1 className='mt-5'>Scan Here for more</h1>
            <h1 className='mb-5'><DownOutlined /></h1>
            <Image src={product.meta.qrCode} alt="QR Code" width={100} />
          </div>
          
          {/* Product Details */}
          <div>
            <div className="flex gap-4 mt-6">
              <Button
                type="dashed"
                onClick={() => navigate(`/products/${product.id}/edit`)} // Navigate to edit page
              >
                Edit
                <EditOutlined />
              </Button>
            </div>
            <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
            <Rate disabled defaultValue={product.rating} className="mb-4" />
            <p className="text-lg font-semibold mb-4">
              <span className="line-through text-gray-500">${product.price.toFixed(2)}</span>
              <span className="ml-2 text-green-500">${discountedPrice.toFixed(2)}</span>
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
              <Descriptions.Item label="Weight" className="text-lg">
                {product.weight} g
              </Descriptions.Item>
              <Descriptions.Item label="Dimensions">
                {`Width: ${product.dimensions.width} cm, Height: ${product.dimensions.height} cm, Depth: ${product.dimensions.depth} cm`}
              </Descriptions.Item>
              <Descriptions.Item label="Warranty Information">
                {product.warrantyInformation}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Information">
                {product.shippingInformation}
              </Descriptions.Item>
              <Descriptions.Item label="Availability Status">
                {product.availabilityStatus}
              </Descriptions.Item>
              <Descriptions.Item label="SKU" className="text-lg">
                {product.sku}
              </Descriptions.Item>
              <Descriptions.Item label="Tags">
                {product.tags.map((tag) => (
                  <Tag key={tag} className="bg-blue-100 text-blue-600 border border-blue-400 rounded-md">
                    {tag}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Barcode">
                {product.meta.barcode}
              </Descriptions.Item>
            </Descriptions>

            {/* Reviews Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              {product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <Card key={index} className="mb-4 p-4 shadow-sm border rounded-lg bg-gray-50">
                    <Rate disabled defaultValue={review.rating} />
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-600">
                      {review.reviewerName} ({review.reviewerEmail})
                    </p>
                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                  </Card>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ProductDetail;
