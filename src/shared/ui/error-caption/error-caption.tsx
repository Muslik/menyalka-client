import { Caption } from '@telegram-apps/telegram-ui';
import cls from 'clsx';

import styles from './error-caption.module.scss';

type Props = {
  text: string | undefined;
};

export const ErrorCaption = ({ text }: Props) => {
  if (!text) {
    return null;
  }

  return (
    <Caption className={cls(styles.caption, styles.captionError)} level="2" Component="div">
      {text}
    </Caption>
  );
};
