import {
  $debug,
  LaunchParams,
  backButton,
  initData,
  init as initSDK,
  isTMA,
  miniApp,
  miniAppReady,
  mockTelegramEnv,
  parseInitData,
  retrieveLaunchParams,
  themeParams,
  viewport,
} from '@telegram-apps/sdk-react';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { status } from 'patronum';

import { IS_DEV_ENV } from '~/shared/config/env';

import { mainButton } from './mainButton';

export type Params = LaunchParams;

export const initTgApp = createEvent();
export const $launchParams = createStore<LaunchParams | null>(null);

const mockEnv = () => {
  let lp: LaunchParams | undefined;
  try {
    lp = retrieveLaunchParams();
  } catch (_) {
    const authDate = Math.floor(new Date().getTime() / 1000);
    const initDataRaw = new URLSearchParams([
      [
        'user',
        JSON.stringify({
          id: 2200988595,
          first_name: 'Test',
          last_name: 'Testov',
          username: 'Test',
          language_code: 'en',
          allows_write_to_pm: true,
        }),
      ],
      ['hash', 'b9ec8fe8db68d998913e300236d074486f37ac3f069365b9d12c44ee9df0fdab'],
      ['auth_date', authDate.toString()],
      ['start_param', 'debug'],
      ['chat_type', 'private'],
      ['chat_instance', '-8813794167295315885'],
    ]).toString();
    lp = {
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#17212b',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBgColor: '#232e3c',
        sectionBgColor: '#17212b',
        sectionHeaderTextColor: '#6ab3f3',
        subtitleTextColor: '#708499',
        textColor: '#f5f5f5',
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: '8',
      platform: 'macos',
    };
  }
  mockTelegramEnv(lp);
  console.warn(
    '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
  );

  return lp;
};

const checkIfTmaFx = createEffect(isTMA);

export const initTgAppFx = createEffect<void, LaunchParams>(async () => {
  const isTma = await checkIfTmaFx();
  let lp: LaunchParams | undefined;

  if (!isTma && IS_DEV_ENV) {
    lp = mockEnv();
  } else {
    lp = retrieveLaunchParams();
  }

  $debug.set(lp.startParam === 'debug' || IS_DEV_ENV);

  initSDK();

  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  backButton.mount();
  mainButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  viewport
    .mount()
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e);
    })
    .then(() => {
      viewport.bindCssVars();
    });

  miniApp.bindCssVars();
  themeParams.bindCssVars();

  miniAppReady();

  return lp;
});

export const $tgInitStatus = status({ effect: initTgAppFx });

sample({
  clock: initTgApp,
  target: initTgAppFx,
});

initTgAppFx.doneData.watch(() => {
  console.log('Done data init');
});

sample({
  clock: initTgAppFx.doneData,
  target: $launchParams,
});
