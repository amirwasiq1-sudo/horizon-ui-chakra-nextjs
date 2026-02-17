'use client';

import {
  Box,
  Text,
  Flex,
  Badge,
  Grid,
  Divider,
  Select,
  Textarea,
  Collapse,
  useColorModeValue,
  Spinner,
  Input,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { io as socketClient } from 'socket.io-client';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const borderClr = useColorModeValue('gray.200', 'gray.700');
  const selectBg = useColorModeValue('gray.100', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const optionColor = useColorModeValue('#000', '#fff');

  useEffect(() => {
    fetchOrders();

    // SOCKET.IO FOR REAL-TIME UPDATES
    const socket = socketClient(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001'
    );

    socket.on('connect', () => console.log('Connected to socket server'));
    socket.on('disconnect', () => console.log('Disconnected from socket server'));

    socket.on('newOrder', (newOrder) => {
      toast.success(`New order from ${newOrder.userName}`);
      setOrders((prev) => [{ ...newOrder, isNew: true }, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    // Apply filters whenever orders, searchDate, or searchName change
    let filtered = [...orders];

    if (searchDate) {
      filtered = filtered.filter(
        (o) =>
          new Date(o.createdAt).toISOString().slice(0, 10) === searchDate
      );
    }

    if (searchName) {
      filtered = filtered.filter((o) =>
        o.userName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchDate, searchName]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok) throw new Error();

      setOrders(data.map((o) => ({ ...o, isNew: o.isNew ?? true })));
    } catch {
      toast.error('Failed to fetch orders');
    }
  };

  // Toggle expand & mark NEW as false permanently
  const toggleExpand = async (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    const order = orders.find((o) => o._id === id);
    if (!order || !order.isNew) return;

    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, isNew: false } : o))
    );

    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isNew: false }),
      });
    } catch {
      // silent fail
    }
  };

  const updateOrder = async (id, updatedData) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error();

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...updatedData } : o))
      );

      toast.success('Order updated');
    } catch {
      toast.error('Update failed');
    }
    setSavingId(null);
  };

  const handleShowAll = () => {
    setSearchDate('');
    setSearchName('');
  };

  return (
    <Box p={6} bg={pageBg} minH="100vh">
      <Text fontSize="3xl" mb={6} fontWeight="bold">
        Orders
      </Text>

    {/* ---------------- SEARCH ROW ---------------- */}
<Flex mb={4} gap={3} flexWrap="nowrap" align="center">
  <Input
    type="date"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
    bg={inputBg}
    placeholder="Search by date"
    width="350px"   // 🔹 fixed smaller width
  />
  <Input
    type="text"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    bg={inputBg}
    placeholder="Search by name"
    width="350px"   // 🔹 fixed smaller width
  />
  <Button onClick={handleShowAll} colorScheme="blue" minW="120px">
    Show All Orders
  </Button>
</Flex>


      {/* ---------------- ORDERS GRID ---------------- */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
        {filteredOrders.map((order) => {
          const isSaving = savingId === order._id;

          return (
            <Box
              key={order._id}
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderClr}
              borderRadius="lg"
              shadow="sm"
              cursor="pointer"
              onClick={() => toggleExpand(order._id)}
              _hover={{ shadow: 'md' }}
              transition="0.2s"
            >
              <Flex justify="space-between" align="center" p={4}>
                <Box>
                  <Text fontWeight="semibold">{order.userName}</Text>

                  {order.isDelivered && (
                    <Text fontSize="xs" color="green.500" fontWeight="bold">
                      DONE
                    </Text>
                  )}

                  <Text fontSize="sm" color={textMuted}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Box>

                <Flex align="center" gap={2}>
                  {isSaving && <Spinner size="sm" />}

                  {order.isNew && (
                    <Badge colorScheme="red" px={2} rounded="md">
                      NEW
                    </Badge>
                  )}

                  {!order.isDelivered && (
                    <Badge colorScheme="yellow">In Progress</Badge>
                  )}

                  {order.isDelivered && (
                    <Badge colorScheme="green">Delivered</Badge>
                  )}
                </Flex>
              </Flex>

              <Collapse in={!!expanded[order._id]} animateOpacity>
                <Divider />
                <Box p={4}>
                  <Text fontWeight="bold" mb={2}>
                    Items
                  </Text>

                  {order.orderItems.map((item, idx) => (
                    <Box key={idx} mb={3}>
                      <Text fontWeight="semibold">{item.name}</Text>
                      <Text fontSize="sm">Qty: {item.qty}</Text>
                      <Text fontSize="sm">Price: Rs. {item.price}</Text>

                      {/* Variations */}
                      {item.variations?.map((v, i) => (
                        <Box key={i} ml={3}>
                          {v.group && (
                            <Text fontSize="sm" fontWeight="bold">
                              {v.group}:
                            </Text>
                          )}
                          {v.options.map((opt, j) => (
                            <Text key={j} fontSize="sm">
                              - {opt}
                            </Text>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  ))}

                  <Divider my={3} />

                  <Text>Items: Rs. {order.itemsPrice}</Text>
                  <Text>Shipping: Rs. {order.shippingPrice}</Text>
                  <Text fontWeight="bold">Total: Rs. {order.totalPrice}</Text>

                  <Divider my={3} />

                  <Flex gap={3} flexWrap="wrap">
                    {[
                      {
                        value: order.isPaid ? 'paid' : 'unpaid',
                        onChange: (v) =>
                          updateOrder(order._id, { isPaid: v === 'paid' }),
                        options: ['paid', 'unpaid'],
                      },
                      {
                        value: order.isShipped ? 'shipped' : 'pending',
                        onChange: (v) =>
                          updateOrder(order._id, { isShipped: v === 'shipped' }),
                        options: ['pending', 'shipped'],
                      },
                      {
                        value: order.isDelivered ? 'delivered' : 'pending',
                        onChange: (v) =>
                          updateOrder(order._id, { isDelivered: v === 'delivered' }),
                        options: ['pending', 'delivered'],
                      },
                    ].map((cfg, i) => (
                      <Select
                        key={i}
                        value={cfg.value}
                        bg={selectBg}
                        isDisabled={isSaving}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => cfg.onChange(e.target.value)}
                      >
                        {cfg.options.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            style={{ color: optionColor }}
                          >
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </Select>
                    ))}
                  </Flex>

                  <Textarea
                    mt={3}
                    bg={inputBg}
                    resize="vertical"
                    minH="80px"
                    value={order.shippingAddress?.address || ''}
                    placeholder="Complete address"
                    isDisabled={isSaving}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setOrders((prev) =>
                        prev.map((o) =>
                          o._id === order._id
                            ? {
                                ...o,
                                shippingAddress: {
                                  ...o.shippingAddress,
                                  address: e.target.value,
                                },
                              }
                            : o
                        )
                      )
                    }
                    onBlur={(e) =>
                      updateOrder(order._id, {
                        shippingAddress: {
                          ...order.shippingAddress,
                          address: e.target.value,
                        },
                      })
                    }
                  />

                  <Textarea
                    mt={2}
                    bg={inputBg}
                    resize="vertical"
                    minH="60px"
                    value={order.notes || ''}
                    placeholder="Admin notes"
                    isDisabled={isSaving}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setOrders((prev) =>
                        prev.map((o) =>
                          o._id === order._id ? { ...o, notes: e.target.value } : o
                        )
                      )
                    }
                    onBlur={(e) => updateOrder(order._id, { notes: e.target.value })}
                  />
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}



