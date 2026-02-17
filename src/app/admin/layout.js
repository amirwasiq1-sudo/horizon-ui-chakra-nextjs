'use client';
// Chakra imports
import React, { useState, useEffect } from 'react';
import { Portal, Box, useDisclosure, useColorModeValue } from '@chakra-ui/react';

// Components
import Footer from '../../components/footer/FooterAdmin';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
// Context & utils
import { SidebarContext } from '../../contexts/SidebarContext';
import routes from '../../lib/routes';
import { getActiveNavbar, getActiveNavbarText, getActiveRoute } from '../../utils/navigation';

export default function AdminLayout(props) {
  const { children, ...rest } = props;

  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { onOpen } = useDisclosure();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.documentElement.dir = 'ltr';
    }
  }, []);

  const bg = useColorModeValue('secondaryGray.300', 'navy.900');

  return (
    <Box h="100vh" w="100vw" bg={bg}>
      <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
        {/* Sidebar */}
        <Sidebar routes={routes} display="none" {...rest} />

        {/* Main content */}
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc(100% - 290px)' }}
          maxWidth={{ base: '100%', xl: 'calc(100% - 290px)' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {/* Navbar */}
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText="Horizon UI Dashboard PRO"
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          {/* Page content */}
          <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh" pt="50px">
            {children}
          </Box>

          {/* Footer */}
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
