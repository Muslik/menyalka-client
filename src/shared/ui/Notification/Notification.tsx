import { Link, Snackbar } from '@telegram-apps/telegram-ui';
import { useUnit } from 'effector-react';
import { ReactNode } from 'react';

import { i18n } from '~/shared/config/i18n';

import { IconCancel24 } from '../icons/IconCancel24';
import { IconCheck24 } from '../icons/IconCheck24';
import { IconLightbulb24 } from '../icons/IconLightbulb24';
import { IconNotifications24 } from '../icons/IconNotifications24';
import { IconNotificationsColoredSquare32 } from '../icons/IconNotificationsColoredSquare32';
import styles from './Notification.module.scss';
import {
  $notification,
  $notificationState,
  BASE_DURATION,
  NotificationType,
  notificationClosed,
  notificationHide,
} from './model';

const NOTIFICATION_CONFIG = {
  error: {
    title: i18n.t('notification.error'),
    icon: <IconNotificationsColoredSquare32 />,
  },
  success: {
    title: i18n.t('notification.success'),
    icon: <IconCheck24 />,
  },
  info: {
    title: i18n.t('notification.info'),
    icon: <IconLightbulb24 />,
  },
} satisfies Record<NotificationType, { title: string; icon: ReactNode }>;

export const Notification = () => {
  const model = useUnit({
    notification: $notification,
    notificationState: $notificationState,
    notificationDismissed: notificationHide,
    notificationClosed,
  });
  const { notification } = model;

  if (!notification) {
    return null;
  }

  const handleClick = () => {
    if (notification.onClick) {
      notification.onClick();
    }
  };

  const handleClose = () => {
    model.notificationClosed(notification.id);
  };

  const handleDismiss = () => {
    model.notificationDismissed();
  };

  const getIcon = () => {
    if ('type' in notification) {
      return NOTIFICATION_CONFIG[notification.type].icon;
    }

    if ('icon' in notification) {
      return notification.icon;
    }

    return <IconNotifications24 />;
  };

  const getTitle = () => {
    if ('type' in notification && !('title' in notification)) {
      return NOTIFICATION_CONFIG[notification.type].title;
    }

    return notification.title;
  };

  return (
    <Snackbar
      onClose={handleClose}
      duration={notification.duration ?? BASE_DURATION}
      description={notification.description}
      onClick={handleClick}
      before={getIcon()}
      link={
        notification.link ? (
          <Link href={notification.link.href}>{notification.link.text}</Link>
        ) : undefined
      }
      after={
        notification.isCloseable ? (
          <button className={styles.button} onClick={handleDismiss}>
            <IconCancel24 width="16" height="16" fill="white" />
          </button>
        ) : undefined
      }
    >
      {getTitle()}
    </Snackbar>
  );
};
