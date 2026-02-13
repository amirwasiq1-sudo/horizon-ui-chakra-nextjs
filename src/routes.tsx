import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdStorefront, // Icon for Products
} from 'react-icons/md';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },

  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  },

  {
    name: 'Products',        // ✅ New menu item
    layout: '/admin',
    path: '/products',       // This will go to /admin/products
    icon: <Icon as={MdStorefront} width="20px" height="20px" color="inherit" />,
  },

  {
    name: 'Data Tables',
    layout: '/admin',
    path: '/data-tables',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'RTL Admin',
    layout: '/rtl',
    path: '/rtl-default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;
