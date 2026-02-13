'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from '@chakra-ui/react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAddUser = async () => {
    try {
      await axios.post('/api/users', {
        name,
        email,
        password,
        isAdmin,
        isVerified,
      });

      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
      setIsVerified(false);

      onClose();
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p="20px" pt="120px" minH="100vh">
      {/* Add User Button */}
      <Flex justify="flex-end" mb="20px">
        <Button colorScheme="blue" onClick={onOpen}>
          Add User
        </Button>
      </Flex>

      {/* Users Table */}
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Admin</Th>
            <Th>Verified</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.isAdmin ? 'Yes' : 'No'}</Td>
              <Td>{user.isVerified ? 'Yes' : 'No'}</Td>
              <Td>{new Date(user.createdAt).toLocaleString()}</Td>
              <Td>{new Date(user.updatedAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalBody>
            <FormControl mb="3">
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </FormControl>
            <FormControl mb="3">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </FormControl>
            <FormControl mb="3">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </FormControl>
            <FormControl mb="3">
              <Checkbox
                isChecked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              >
                Is Admin
              </Checkbox>
            </FormControl>
            <FormControl mb="3">
              <Checkbox
                isChecked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
              >
                Is Verified
              </Checkbox>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddUser}>
              Add User
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
