'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
        <Toaster position="top-right" />
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
