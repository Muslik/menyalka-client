import { EventListener, mainButton as tgMainButton } from '@telegram-apps/sdk-react';
import { attach, createEffect, createEvent, createStore, is, sample, scopeBind } from 'effector';

import { scope } from '~/shared/config/init';

type MainButtonParams = Parameters<typeof tgMainButton.setParams>[0] & {
  handler?: EventListener<'main_button_pressed'>;
};

const mount = createEvent();
const unmount = createEvent();
const set = createEvent<MainButtonParams>();
const hide = createEvent();

const $handler = createStore<EventListener<'main_button_pressed'> | null>(null);

const onClickFx = createEffect<
  EventListener<'main_button_pressed'>,
  EventListener<'main_button_pressed'>
>((handler) => {
  if (is.event(handler)) {
    tgMainButton.onClick(scopeBind(handler, { scope }));
  } else {
    tgMainButton.onClick(handler);
  }

  return handler;
});

sample({
  clock: onClickFx.doneData,
  target: $handler,
});

const setParamsFx = createEffect<MainButtonParams, void>(
  async ({ handler, isVisible, ...params }) => {
    tgMainButton.setParams({
      ...params,
      isVisible: isVisible ?? true,
    });

    if (handler) {
      onClickFx(handler);
    }
  },
);

const mountMainButtonFx = createEffect(tgMainButton.mount);
const unmountMainButtonFx = createEffect(tgMainButton.unmount);

const $isMounted = createStore(false);
const changeIsMounted = createEvent<boolean>();

tgMainButton.isMounted.sub(changeIsMounted);

const $isVisible = createStore(false);
const changeIsVisible = createEvent<boolean>();

tgMainButton.isVisible.sub(changeIsVisible);

const offClickFx = attach({
  source: $handler,
  effect: (handler) => {
    if (handler) {
      tgMainButton.offClick(handler);
    }
  },
});

sample({
  clock: hide,
  target: offClickFx,
});

sample({
  clock: offClickFx.done,
  fn: () => null,
  target: $handler,
});

sample({
  clock: hide,
  fn: () => ({
    isVisible: false,
    backgroundColor: undefined,
    hasShineEffect: false,
    isEnabled: true,
    isLoaderVisible: false,
    text: undefined,
    textColor: undefined,
  }),
  target: set,
});

sample({
  clock: set,
  target: setParamsFx,
});

sample({
  clock: mount,
  target: mountMainButtonFx,
});

sample({
  clock: unmount,
  target: unmountMainButtonFx,
});

export const mainButton = {
  $isMounted,
  $isVisible,
  show: set,
  hide,
  mount,
  unmount,
};
