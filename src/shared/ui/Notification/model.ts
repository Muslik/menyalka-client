import { EventCallable, createEvent, createStore, sample } from 'effector';
import { delay } from 'patronum';
import { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';

const TRANSITION_FINISH_DURATION = 320;
export const BASE_DURATION = 4000;

export enum NotificationType {
  error = 'error',
  success = 'success',
  info = 'info',
}

type NotificationParams = (
  | {
      type: NotificationType;
      icon?: ReactNode;
      title?: string;
    }
  | {
      icon?: ReactNode;
      title: string;
    }
) & {
  description?: string;
  before?: ReactNode;
  link?: {
    href: string;
    text: string;
  };
  duration?: number;
  onClose?: EventCallable<void>;
  onClick?: EventCallable<void>;
  isCloseable?: boolean;
};

type NotificationStore = NotificationParams & {
  id: string;
};

export enum NotificationState {
  opened = 'opened',
  closing = 'closing',
  closed = 'closed',
}

export const $notificationState = createStore<NotificationState>(NotificationState.closed);
export const $notification = createStore<NotificationStore | null>(null);

const notificationReset = createEvent();
export const notificationShow = createEvent<NotificationParams>();
export const notificationHide = createEvent();
export const notificationClosed = createEvent<string>();

$notification.reset(notificationReset);

const notificationClosing = createEvent();

sample({
  clock: notificationShow,
  fn: (notification) => ({
    ...notification,
    id: uuid(),
  }),
  target: $notification,
});

sample({
  clock: notificationShow,
  fn: () => NotificationState.opened,
  target: $notificationState,
});

sample({
  clock: notificationHide,
  fn: () => NotificationState.closing,
  target: $notificationState,
});

sample({
  clock: $notificationState,
  filter: (state) => state === NotificationState.closing,
  target: notificationClosing,
});

const notificationNotNull = (
  notification: NotificationStore | null,
): notification is NotificationStore => notification !== null;

sample({
  source: $notification,
  clock: notificationClosing,
  filter: notificationNotNull,
  fn: (notification) => ({
    ...notification,
    duration: 0,
  }),
  target: $notification,
});

const delayedNotificationReset = delay(notificationClosing, TRANSITION_FINISH_DURATION);

// NOTE: Потому что onClosed у telegram ui дергается много раз и $notification уже может быть пустым
// Поэтому фильтруем чтобы дернуть только один раз
sample({
  source: $notification,
  clock: notificationClosed,
  filter: (notification, id) => notification?.id === id,
  target: notificationReset,
});

$notification.reset(delayedNotificationReset);
$notificationState.reset(delayedNotificationReset);
