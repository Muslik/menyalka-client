import { allSettled, sample } from 'effector';
import { Provider } from 'effector-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '~/app';
import { appStarted, scope } from '~/shared/config/init';
import { initTgAppFx } from '~/shared/lib/tma';

import './init';
import './shared/config/i18n';

sample({
  clock: initTgAppFx.doneData,
  target: appStarted,
});

const root = createRoot(document.getElementById('root')!);

allSettled(initTgAppFx, { scope }).then(() => {
  root.render(
    <Provider value={scope}>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>,
  );
});
