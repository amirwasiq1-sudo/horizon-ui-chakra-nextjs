import { IRoute } from "types/navigation";

// NextJS Requirement
export const isWindowAvailable = () => typeof window !== "undefined";

export const findCurrentRoute = (routes: IRoute[]): IRoute | undefined => { 
  if (!isWindowAvailable()) return undefined;

  return routes.find(
    (route) =>
      window.location.href.indexOf(route.layout + route.path) !== -1
  );
};

export const getActiveRoute = (routes: IRoute[]): string => {
  const route = findCurrentRoute(routes);
  return route?.name || "Default Brand Text";
};

export const getActiveNavbar = (routes: IRoute[]): boolean | undefined => {
  const route = findCurrentRoute(routes);
  return route?.secondary;
};

export const getActiveNavbarText = (routes: IRoute[]): string | boolean => {
  return getActiveRoute(routes) || false;
};
