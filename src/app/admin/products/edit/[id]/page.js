'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Text,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Checkbox,
  Button,
  Spinner,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------------- FETCH PRODUCT ----------------
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');

      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id, fetchProduct]);

  // ---------------- SAVE PRODUCT ----------------
  const handleSave = async () => {
    if (!product) return;

    setSaving(true);

    try {
      const payload = {
        ...product,
        basePrice: Number(product.basePrice),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
        countInStock: Number(product.countInStock),
        hasDiscount: Boolean(product.hasDiscount),
        isActive: Boolean(product.isActive),
        showInstructions: Boolean(product.showInstructions),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to save product');
      }

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }

    setSaving(false);
  };

  if (loading) return <Spinner size="xl" />;

  if (!product) return <Text>Product not found</Text>;

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Edit Product - ID: {id}
      </Text>

      <Stack spacing={4} maxW="600px">
        <Input
          placeholder="Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <Textarea
          placeholder="Description"
          value={product.description || ''}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
        <Input
          placeholder="Category"
          value={product.category || ''}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />
        <Input
          placeholder="Image URL"
          value={product.image || ''}
          onChange={(e) => setProduct({ ...product, image: e.target.value })}
        />

        <NumberInput
          value={product.basePrice || 0}
          min={0}
          onChange={(valueString, valueNumber) =>
            setProduct({ ...product, basePrice: valueNumber })
          }
        >
          <NumberInputField placeholder="Base Price" />
        </NumberInput>

        <Checkbox
          isChecked={product.hasDiscount || false}
          onChange={(e) => setProduct({ ...product, hasDiscount: e.target.checked })}
        >
          Has Discount
        </Checkbox>

        {product.hasDiscount && (
          <NumberInput
            value={product.discountPrice || 0}
            min={0}
            onChange={(valueString, valueNumber) =>
              setProduct({ ...product, discountPrice: valueNumber })
            }
          >
            <NumberInputField placeholder="Discount Price" />
          </NumberInput>
        )}

        <NumberInput
          value={product.countInStock || 0}
          min={0}
          onChange={(valueString, valueNumber) =>
            setProduct({ ...product, countInStock: valueNumber })
          }
        >
          <NumberInputField placeholder="Stock" />
        </NumberInput>

        <Switch
          isChecked={product.isActive || false}
          onChange={(e) => setProduct({ ...product, isActive: e.target.checked })}
        >
          Active
        </Switch>

        <Switch
          isChecked={product.showInstructions || false}
          onChange={(e) => setProduct({ ...product, showInstructions: e.target.checked })}
        >
          Show Instructions
        </Switch>

        <Button colorScheme="green" onClick={handleSave} isLoading={saving}>
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
