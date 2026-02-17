import { ReactElement } from 'react';

export interface IRoute {
  layout: string;           // e.g., "/admin"
  path: string;             // e.g., "/dashboard"
  name: string;             // Display name
  icon: ReactElement | string; // React icon component or string
  secondary?: boolean;      // optional
  [key: string]: any;       // allow extra fields
}
