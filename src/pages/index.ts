import { createRoutesView } from 'atomic-router-react';

import { ErrorRoute } from './error';
import { HomeRoute } from './home';
import { SignUpRoute } from './sign-up';
import { WelcomeRoute } from './welcome';

export const Pages = createRoutesView({
  routes: [HomeRoute, SignUpRoute, WelcomeRoute, ErrorRoute],
});
