import { Icon } from '@chakra-ui/react';
import { MdPerson, MdStorefront } from 'react-icons/md';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: <Icon as={MdStorefront} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;
