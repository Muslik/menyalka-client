import { routes } from '~/shared/routing';
import { chainAuthorized } from '~/shared/session';

export const currentRoute = routes.home;
export const anonymousRoute = chainAuthorized(currentRoute, {
  otherwise: routes.welcome.navigate,
});
