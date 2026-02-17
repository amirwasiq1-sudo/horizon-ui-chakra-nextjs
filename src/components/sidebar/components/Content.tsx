import React from 'react';
import { Box } from '@chakra-ui/react';
import { IRoute } from 'types/navigation';

interface ContentProps {
  routes: IRoute[];
}

export default function Content({ routes }: ContentProps) {
  return (
    <Box>
      {routes.map((route, idx) => (
        <Box key={idx} p="2" borderBottom="1px solid gray">
          {route.name}
        </Box>
      ))}
    </Box>
  );
}
