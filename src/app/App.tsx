import { AppRoot } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { RouterProvider } from 'atomic-router-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useUnit } from 'effector-react';
import { Suspense } from 'react';

import { Pages } from '~/pages';
import { $tgInitStatus } from '~/shared/lib/tma';
import { router } from '~/shared/routing';
import { EnvUnsupported } from '~/shared/ui/env-unsupported';
import { Notification } from '~/shared/ui/notification';
import { PageLoader } from '~/shared/ui/page-loader';

import './index.scss';
import './model';

dayjs.locale('ru');

export function App() {
  const tgInitStatus = useUnit($tgInitStatus);
  if (tgInitStatus === 'fail') {
    return <EnvUnsupported />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router}>
        <AppRoot>
          <Pages />
          <Notification />
        </AppRoot>
      </RouterProvider>
    </Suspense>
  );
}
