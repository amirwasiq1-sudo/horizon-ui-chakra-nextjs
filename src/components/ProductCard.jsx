import React from "react";
import { Box, Text, Image } from '@chakra-ui/react';

const ProductCard = ({ product }) => {
  return (
    <Box p={2}>
      <Image src={product.image} alt={product.name} borderRadius="md" />
      <Text fontWeight="bold">{product.name}</Text>
      <Text fontSize="sm" color="gray.600">Category: {product.category}</Text>
      <Text fontSize="sm">Base Price: Rs {product.basePrice}</Text>
      {product.hasDiscount && product.discountPrice && (
        <Text fontSize="sm">Discount Price: Rs {product.discountPrice}</Text>
      )}
      <Text fontSize="sm">Stock: {product.countInStock}</Text>
      <Text fontSize="sm">Instructions: {product.showInstructions ? 'Yes' : 'No'}</Text>
      <Text fontSize="sm">Active: {product.isActive ? 'Yes' : 'No'}</Text>
      <Text fontSize="xs" color="gray.500">ID: {product._id}</Text>
      <Text fontSize="sm">{product.description}</Text>
    </Box>
  );
};

export default ProductCard;
