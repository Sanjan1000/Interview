import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Rate, InputNumber, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const ProductEdit: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // Fetch product ID from URL
  const [product, setProduct] = useState<any>(null); // Product data
  const [categories, setCategories] = useState<string[]>([]); // Product categories
  const navigate = useNavigate();

  // Fetch product and categories on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Get product details by ID
        const productResponse = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(productResponse.data);

        // Get product categories
        const categoriesResponse = await axios.get('https://dummyjson.com/products/categories');
        
        // Extract category names from the response and update state
        const categoryNames = categoriesResponse.data.map((category: { name: string }) => category.name);
        setCategories(categoryNames);

      } catch (error) {
        message.error('Error fetching product or categories.');
      }
    }
    fetchData();
  }, [id]);

  // Handle form submission
  const onFinish = async (values: any) => {
    try {
      // Log final form values before submitting
      console.log('Final Form Values:', values);

      // Send PATCH request to update product
      const response = await axios.patch(`https://dummyjson.com/products/${id}`, values);
      console.log('API Response:', response.data); // Log the API response

      message.success('Product updated successfully');
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Error updating product.');
    }
  };

  // If product not loaded yet
  if (!product) return <p>Loading product data...</p>;

  return (
    <Form 
      form={form} 
      onFinish={onFinish} 
      initialValues={product} 
      layout="vertical"
      className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg"
    >
      <Button
        type="default"
        onClick={() => navigate(-1)}
        className="border-none mb-4 flex items-center"
      >
        <ArrowLeftOutlined className="mr-2" />
      </Button>

      <Form.Item 
        name="title" 
        label="Title" 
        rules={[{ required: true, message: 'Please input product title!' }]}
        className="mb-4"
      >
        <Input placeholder="Product Title" className="px-3 py-2 border border-gray-300 rounded-md" />
      </Form.Item>

      <Form.Item 
        name="description" 
        label="Description" 
        rules={[{ required: true, message: 'Please input product description!' }]}
        className="mb-4"
      >
        <Input.TextArea 
          placeholder="Product Description" 
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
      </Form.Item>

      <Form.Item 
        name="price" 
        label="Price" 
        rules={[{ required: true, message: 'Please input product price!' }]}
        className="mb-4"
      >
        <InputNumber 
          min={0} 
          step={0.01} 
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
      </Form.Item>

      <Form.Item name="rating" label="Rating" className="mb-4">
        <Rate />
      </Form.Item>

      {/* Category Dropdown */}
      <Form.Item 
        name="category" 
        label="Category" 
        rules={[{ required: true, message: 'Please select a category!' }]}
        className="mb-4"
      >
        <Select placeholder="Select Category" className="w-full">
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="stock" label="Stock" className="mb-4">
        <InputNumber min={0} className="px-3 py-2 border border-gray-300 rounded-md" />
      </Form.Item>

      <label>Reviews</label>
      {/* Dynamic list for product reviews */}
      <Form.List name="reviews">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div 
                key={key} 
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-start mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* Reviewer Name */}
                <Form.Item
                  {...restField}
                  name={[name, 'reviewerName']}
                  fieldKey={[fieldKey as React.Key, 'reviewerName']} // Type assertion
                  rules={[{ required: true, message: 'Please input reviewer name!' }]}
                  className="col-span-1"
                >
                  <Input 
                    placeholder="Reviewer Name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>

                {/* Reviewer Email */}
                <Form.Item
                  {...restField}
                  name={[name, 'reviewerEmail']}
                  fieldKey={[fieldKey as React.Key, 'reviewerEmail']} // Type assertion
                  rules={[{ required: true, message: 'Please input reviewer email!' }]}
                  className="col-span-1"
                >
                  <Input 
                    placeholder="Reviewer Email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>

                {/* Rating */}
                <Form.Item
                  {...restField}
                  name={[name, 'rating']}
                  fieldKey={[fieldKey as React.Key, 'rating']} // Type assertion
                  rules={[{ required: true, message: 'Please input rating!' }]}
                  className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center justify-center"
                >
                  <Rate />
                </Form.Item>

                {/* Review Comment */}
                <Form.Item
                  {...restField}
                  name={[name, 'comment']}
                  fieldKey={[fieldKey as React.Key, 'comment']} // Type assertion
                  rules={[{ required: true, message: 'Please input comment!' }]}
                  className="col-span-2"
                >
                  <Input.TextArea 
                    placeholder="Review Comment" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </Form.Item>

                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => remove(name)} 
                    className="
                      flex items-center justify-center 
                      w-20 h-10 
                      rounded-full 
                      bg-red-100 hover:bg-red-200 
                      text-red-500 hover:text-red-700 
                      transition-all 
                      duration-300 
                      ease-in-out 
                      focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove Review"
                  >
                    <MinusCircleOutlined className="text-xl" />
                    &nbsp;Delete 
                  </button>
                </div>
              </div>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />} 
                className="mt-2 py-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700"
              >
                Add Review
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item className="mt-6">
        <Button type="primary" htmlType="submit" className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          Submit Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductEdit;
