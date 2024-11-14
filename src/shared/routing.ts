import {
  UnmappedRouteObject,
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from 'atomic-router';
import { sample } from 'effector';
import { createBrowserHistory } from 'history';

import { appStarted } from './config/init';

export const routes = {
  home: createRoute(),
  signUp: createRoute(),
  welcome: createRoute(),
  error: createRoute(),
  notFound: createRoute(),
};

const routesMap: UnmappedRouteObject<any>[] = [
  { path: '/', route: routes.home },
  { path: '/welcome', route: routes.welcome },
  { path: '/sign-up', route: routes.signUp },
  { path: '/error', route: routes.error },
  { path: '/404', route: routes.notFound },
];

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute: routes.notFound,
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});
