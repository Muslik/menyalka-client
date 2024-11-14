import { Avatar, Caption, Input, Placeholder } from '@telegram-apps/telegram-ui';
import cls from 'clsx';
import { scopeBind } from 'effector';
import { useForm } from 'effector-forms';
import { useUnit } from 'effector-react';
import { useLayoutEffect } from 'react';

import { i18n } from '~/shared/config/i18n';
import { scope } from '~/shared/config/init';
import { mainButton } from '~/shared/lib/tma';
import { useFormErrorFocus } from '~/shared/lib/useFormErrors';
import { Notification } from '~/shared/ui/Notification';

import { MAX_USERNAME_LENGTH, form } from './model';
import styles from './sign-up-form.module.scss';

export const SignUpForm = () => {
  const [mainButtonOnClick, mainButtonOffClick] = useUnit([
    mainButton.onClick,
    mainButton.offClick,
  ]);
  const { fields, hasError, errorText } = useForm(form);
  const { formRef } = useFormErrorFocus(form);

  useLayoutEffect(() => {
    mainButtonOnClick(scopeBind(form.submit, { scope }));

    return () => {
      mainButtonOffClick();
    };
  }, []);

  return (
    <form ref={formRef}>
      <Notification />
      <Placeholder header={i18n.t('signUp.title')} description={i18n.t('signUp.description')}>
        <Avatar size={96} acronym="M" />
      </Placeholder>
      <Input
        name="username"
        value={fields.username.value}
        onBlur={() => fields.username.onBlur()}
        onChange={({ target: { value } }) => fields.username.onChange(value)}
        style={{ padding: 0 }}
        className={styles.input}
        header={`${i18n.t('username.title')} * (${fields.username.value.length}/${MAX_USERNAME_LENGTH})`}
        placeholder={i18n.t('username.placeholder')}
        status={hasError('username') ? 'error' : undefined}
      />
      {hasError('username') && (
        <Caption className={cls(styles.caption, styles.captionError)} level="2" Component="div">
          {errorText('username')}
        </Caption>
      )}
    </form>
  );
};
