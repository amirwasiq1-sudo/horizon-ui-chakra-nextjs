'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Text,
  Spinner,
  Button,
  Flex,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ProductCard from 'components/ProductCard';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AddProductModal from './AddProductModal';

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (![200, 204, 404].includes(res.status)) {
        throw new Error('Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box p={6}>
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        bg="white"
        position="relative"
        zIndex={1}
      >
        <Text fontSize="3xl" fontWeight="bold">
          Products
        </Text>

        <Button
          leftIcon={<AddIcon />}
          colorScheme="green"
          size="md"
          onClick={() => setIsAddOpen(true)}
        >
          Add New Product
        </Button>
      </Flex>

      {/* Product Grid */}
      {loading ? (
        <Spinner size="lg" />
      ) : products.length > 0 ? (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
          {products.map(p => (
            <Box key={p._id} borderWidth="1px" p={3} borderRadius="lg">
              <ProductCard product={p} />

              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                onClick={() => deleteProduct(p._id)}
              >
                Delete
              </Button>

              <Button
                mt={2}
                ml={2}
                size="sm"
                colorScheme="blue"
                onClick={() => router.push(`/admin/products/edit/${p._id}`)}
              >
                Edit
              </Button>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>No products found</Text>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        refreshProducts={fetchProducts}
      />
    </Box>
  );
}

