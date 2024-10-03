import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '~/app';

import { appStarted } from './shared/config/init';

appStarted();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
