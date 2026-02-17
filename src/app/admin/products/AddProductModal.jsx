'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image'; // ✅ Import Next.js Image

export default function AddProductModal({ isOpen, onClose, refreshProducts }) {
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    headings: [],
    imageFile: null,
  });

  // ---------------- BASIC INPUT ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- IMAGE CHANGE ----------------
  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  // ---------------- ADD HEADING ----------------
  const addHeading = () => {
    setProduct((prev) => ({
      ...prev,
      headings: [...prev.headings, { title: '', options: [] }],
    }));
  };

  const removeHeading = (index) => {
    setProduct((prev) => ({
      ...prev,
      headings: prev.headings.filter((_, i) => i !== index),
    }));
  };

  const updateHeadingTitle = (index, value) => {
    const updated = [...product.headings];
    updated[index].title = value;
    setProduct((prev) => ({ ...prev, headings: updated }));
  };

  const addOption = (headingIndex) => {
    const updated = [...product.headings];
    updated[headingIndex].options.push({ name: '', price: '' });
    setProduct((prev) => ({ ...prev, headings: updated }));
  };

  const removeOption = (headingIndex, optionIndex) => {
    const updated = [...product.headings];
    updated[headingIndex].options = updated[headingIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setProduct((prev) => ({ ...prev, headings: updated }));
  };

  const updateOption = (headingIndex, optionIndex, field, value) => {
    const updated = [...product.headings];
    updated[headingIndex].options[optionIndex][field] = value;
    setProduct((prev) => ({ ...prev, headings: updated }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!product.name || !product.category || !product.price) {
      alert('Name, Category and Price are required');
      return;
    }

    try {
      setLoading(true);

      let imageUrl = '/images/default.png';

      // ✅ Upload to Cloudinary
      if (product.imageFile) {
        const formData = new FormData();
        formData.append('file', product.imageFile);
        formData.append('upload_preset', 'Food Website Data');

        const uploadRes = await fetch(
          'https://api.cloudinary.com/v1_1/dux7wcmnb/image/upload',
          { method: 'POST', body: formData }
        );

        const data = await uploadRes.json();
        if (!data.secure_url) throw new Error('Cloudinary upload failed');
        imageUrl = data.secure_url;
      }

      const payload = {
        name: product.name,
        category: product.category,
        image: imageUrl,
        description: '',
        basePrice: Number(product.price),
        hasDiscount: false,
        discountPrice: null,
        isVariable: product.headings.length > 0,
        optionGroups: product.headings.map((h) => ({
          title: h.title,
          required: true,
          type: 'single',
          options: h.options.map((o) => ({
            name: o.name,
            price: Number(o.price || 0),
          })),
        })),
        showInstructions: false,
        countInStock: Number(product.stock || 0),
        isActive: true,
        reviews: [],
        rating: 0,
        numReviews: 0,
      };

      await axios.post('/api/admin/products', payload);

      // Reset form
      setProduct({ name: '', category: '', price: '', stock: '', headings: [], imageFile: null });
      refreshProducts();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* IMAGE */}
            <Box>
              <Text fontWeight="bold">Product Image</Text>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {product.imageFile && (
                <Box mt={2} w="100px" h="100px" position="relative">
                  <Image
                    src={URL.createObjectURL(product.imageFile)}
                    alt="preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>

            {/* BASIC FIELDS */}
            <Input placeholder="Product Name" name="name" value={product.name} onChange={handleChange} />
            <Input placeholder="Category" name="category" value={product.category} onChange={handleChange} />
            <Input placeholder="Base Price" name="price" type="number" value={product.price} onChange={handleChange} />
            <Input placeholder="Stock" name="stock" type="number" value={product.stock} onChange={handleChange} />

            {/* OPTIONS */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">Options</Text>
                <Button size="sm" leftIcon={<AddIcon />} onClick={addHeading}>Add Heading</Button>
              </HStack>

              {product.headings.map((heading, hIndex) => (
                <Box key={hIndex} border="1px solid #e2e8f0" p={3} mb={3}>
                  <HStack mb={2}>
                    <Input placeholder="Heading Title" value={heading.title} onChange={(e) => updateHeadingTitle(hIndex, e.target.value)} />
                    <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => removeHeading(hIndex)} />
                  </HStack>

                  {heading.options.map((option, oIndex) => (
                    <HStack key={oIndex} mb={2}>
                      <Input placeholder="Option Name" value={option.name} onChange={(e) => updateOption(hIndex, oIndex, 'name', e.target.value)} />
                      <Input placeholder="Extra Price" type="number" value={option.price} onChange={(e) => updateOption(hIndex, oIndex, 'price', e.target.value)} />
                      <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => removeOption(hIndex, oIndex)} />
                    </HStack>
                  ))}

                  <Button size="sm" leftIcon={<AddIcon />} onClick={() => addOption(hIndex)}>Add Option</Button>
                </Box>
              ))}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>Save Product</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
