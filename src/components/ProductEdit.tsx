import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Rate, InputNumber, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
        setCategories(categoriesResponse.data);
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
    <Form form={form} onFinish={onFinish} initialValues={product} layout="vertical">
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input product title!' }]}>
        <Input placeholder="Product Title" />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input product description!' }]}>
        <Input.TextArea placeholder="Product Description" />
      </Form.Item>

      <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input product price!' }]}>
        <InputNumber min={0} step={0.01} />
      </Form.Item>

      <Form.Item name="rating" label="Rating">
        <Rate />
      </Form.Item>

      {/* Category Dropdown */}
      <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
        <Select placeholder="Select Category">
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="stock" label="Stock">
        <InputNumber min={0} />
      </Form.Item>

      {/* Dynamic list for product reviews */}
      <Form.List name="reviews">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'reviewerName']}
                  fieldKey={[fieldKey, 'reviewerName']}
                  rules={[{ required: true, message: 'Please input reviewer name!' }]}
                >
                  <Input placeholder="Reviewer Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'reviewerEmail']}
                  fieldKey={[fieldKey, 'reviewerEmail']}
                  rules={[{ required: true, message: 'Please input reviewer email!' }]}
                >
                  <Input placeholder="Reviewer Email" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'rating']}
                  fieldKey={[fieldKey, 'rating']}
                  rules={[{ required: true, message: 'Please input rating!' }]}
                >
                  <Rate />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'comment']}
                  fieldKey={[fieldKey, 'comment']}
                  rules={[{ required: true, message: 'Please input comment!' }]}
                >
                  <Input.TextArea placeholder="Review Comment" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Review
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductEdit;
