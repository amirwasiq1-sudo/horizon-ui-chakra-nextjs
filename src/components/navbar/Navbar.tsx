import React from 'react';
import { Box } from '@chakra-ui/react';

// Define the props type
interface NavbarProps {
  onOpen: () => void;        // onOpen is a function with no arguments and no return value
  logoText: string;
  brandText: string;
}

export default function Navbar({ onOpen, logoText, brandText }: NavbarProps) {
  return (
    <Box p="4" bg="blue.500" color="white">
      {logoText} - {brandText}
      <button onClick={onOpen}>Open Sidebar</button>
    </Box>
  );
}
