import { AppRoot } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { RouterProvider } from 'atomic-router-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { Pages } from '~/pages';
import { router } from '~/shared/routing';

dayjs.locale('ru');

export function App() {
  return (
    <RouterProvider router={router}>
      <AppRoot>
        <Pages />
      </AppRoot>
    </RouterProvider>
  );
}
