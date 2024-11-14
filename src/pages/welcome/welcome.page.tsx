import { Button } from '@telegram-apps/telegram-ui';

import { i18n } from '~/shared/config/i18n';
import { routes } from '~/shared/routing';

export default function WelcomePage() {
  return (
    <div>
      <h1>Welcome to a menyalka app</h1>
      <p>
        This is a welcome page. You can use it to greet your users and provide them with some useful
        information.
      </p>
      <Button onClick={() => routes.signUp.open()}>{i18n.t('signUp.submit')}</Button>
    </div>
  );
}
