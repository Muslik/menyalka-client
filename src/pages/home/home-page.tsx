import { Title } from '@telegram-apps/telegram-ui';
import { useUnit } from 'effector-react';

import { $user } from '~/shared/session';

export default function HomePage() {
  const user = useUnit($user);

  return (
    <>
      <Title>Hello {user?.username}!</Title>
    </>
  );
}
