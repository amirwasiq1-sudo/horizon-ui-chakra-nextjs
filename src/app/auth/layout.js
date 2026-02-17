'use client';

// Chakra imports
import { Box, Flex, Icon, useColorModeValue, Text } from '@chakra-ui/react';

// Corrected imports
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';

// Assets
import { FaChevronLeft } from 'react-icons/fa';

// Your component
export default function AuthLayout({ children }) {
  return (
    <Box>
      {children}
      <Footer />
      <FixedPlugin />
    </Box>
  );
}
