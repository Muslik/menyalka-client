import { Button, Text, Title } from '@telegram-apps/telegram-ui';
import { Link } from 'atomic-router-react';

import { i18n } from '~/shared/config/i18n';
import { routes } from '~/shared/routing';

export default function WelcomePage() {
  return (
    <div>
      <Title>Welcome to a menyalka app</Title>
      <Text Component="p">
        This is a welcome page. You can use it to greet your users and provide them with some useful
        information.
      </Text>
      <Link to={routes.signUp}>
        <Button>{i18n.t('signUp.submit')}</Button>
      </Link>
    </div>
  );
}
