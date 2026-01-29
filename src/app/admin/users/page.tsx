'use client';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useDisclosure,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

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
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!name || !email || !password) {
      toast({ title: 'Please fill all fields', status: 'warning', duration: 3000, isClosable: true });
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isAdmin, isVerified }),
      });

      if (res.ok) {
        toast({ title: 'User added successfully', status: 'success', duration: 3000, isClosable: true });
        fetchUsers();
        onClose();
        setName(''); setEmail(''); setPassword(''); setIsAdmin(false); setIsVerified(true);
      } else {
        toast({ title: 'Failed to add user', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (err: any) {
      toast({ title: 'Error occurred', description: err.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} px={6}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box fontSize="2xl" fontWeight="bold">Users</Box>
        <Button colorScheme="blue" onClick={onOpen}>Add User</Button>
      </Box>

      <Box bg={bg} borderRadius="lg" shadow="md" p={6}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th><Th>Name</Th><Th>Email</Th><Th>Admin</Th><Th>Verified</Th><Th>Created At</Th><Th>Updated At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user._id}>
                  <Td>{user._id}</Td><Td>{user.name}</Td><Td>{user.email}</Td>
                  <Td>{user.isAdmin ? 'Yes' : 'No'}</Td><Td>{user.isVerified ? 'Yes' : 'No'}</Td>
                  <Td>{new Date(user.createdAt).toLocaleString()}</Td>
                  <Td>{new Date(user.updatedAt).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}><FormLabel>Name</FormLabel><Input value={name} onChange={e=>setName(e.target.value)} /></FormControl>
            <FormControl mb={3}><FormLabel>Email</FormLabel><Input value={email} onChange={e=>setEmail(e.target.value)} /></FormControl>
            <FormControl mb={3}><FormLabel>Password</FormLabel><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></FormControl>
            <FormControl display="flex" alignItems="center" mb={3}><FormLabel mb="0">Is Admin?</FormLabel><Switch isChecked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)} /></FormControl>
            <FormControl display="flex" alignItems="center"><FormLabel mb="0">Is Verified?</FormLabel><Switch isChecked={isVerified} onChange={e=>setIsVerified(e.target.checked)} /></FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddUser}>Submit</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

