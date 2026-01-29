'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

// Correct imports using tsconfig paths
import Sidebar from 'components/sidebar/Sidebar';
import Navbar from 'components/navbar/NavbarAdmin';
import Footer from 'components/footer/FooterAdmin';
import { SidebarContext } from 'contexts/SidebarContext';

import routes from 'routes';
import { getActiveRoute, getActiveNavbar, getActiveNavbarText } from 'utils/navigation';

// Props type
interface AdminLayoutProps extends PropsWithChildren {}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Sidebar toggle state
  const [toggleSidebar, setToggleSidebar] = useState(false);

  // Fixed navbar state
  const [fixed] = useState(false);

  // Ensure LTR layout
  useEffect(() => {
    document.documentElement.dir = 'ltr';
  }, []);

  // Background color based on color mode
  const bg = useColorModeValue('secondaryGray.300', 'navy.900');

  return (
    <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
      <Box h="100vh" w="100vw" bg={bg}>
        {/* Sidebar */}
        <Sidebar routes={routes} display="none" />

        {/* Main content */}
        <Box
          float="right"
          minH="100vh"
          h="100%"
          overflow="auto"
          position="relative"
          maxH="100%"
          w={{ base: '100%', xl: 'calc(100% - 290px)' }}
          maxW={{ base: '100%', xl: 'calc(100% - 290px)' }}
          transition="all 0.33s cubic-bezier(0.685,0.0473,0.346,1)"
        >
          {/* Navbar */}
          <Navbar
            logoText="Horizon UI Dashboard PRO"
            brandText={getActiveRoute(routes)}
            secondary={getActiveNavbar(routes)}
            message={getActiveNavbarText(routes)}
            fixed={fixed}
          />

          {/* Page content */}
          <Box mx="auto" p={{ base: '20px', md: '30px' }} pt="50px" minH="100vh">
            {children}
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
}
