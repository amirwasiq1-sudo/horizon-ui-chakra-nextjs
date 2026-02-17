import React from 'react';

// Chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import Content from './components/Content';
import { renderThumb, renderTrack, renderView } from '../../components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';

// Dynamic scrollbars
const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true }
);

// Assets
import { IoMenuOutline } from 'react-icons/io5';
import { IRoute } from 'types/navigation';
import { isWindowAvailable } from '../../utils/navigation';

interface SidebarProps {
  routes: IRoute[];
  [x: string]: any;
}

function Sidebar({ routes, ...rest }: SidebarProps) {
  const variantChange = '0.2s linear';
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset'
  );
  const sidebarBg = useColorModeValue('white', 'navy.800');

  return (
    <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m="0px"
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
        {...rest}
      >
        <Scrollbars universal={true}>
          <Content routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// Responsive Sidebar
export function SidebarResponsive({ routes }: { routes: IRoute[] }) {
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const menuColor = useColorModeValue('gray.400', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLDivElement>(null);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={
          isWindowAvailable() && window.document.documentElement.dir === 'rtl'
            ? 'right'
            : 'left'
        }
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
              universal={true}
            >
              <Content routes={routes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
