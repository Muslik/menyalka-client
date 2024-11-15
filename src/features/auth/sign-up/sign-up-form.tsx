import { reflect } from '@effector/reflect';
import { Avatar, Input, Placeholder } from '@telegram-apps/telegram-ui';

import { i18n } from '~/shared/config/i18n';
import { useFormErrorFocus } from '~/shared/lib/useFormErrors';
import { ErrorCaption } from '~/shared/ui/error-caption';

import { MAX_USERNAME_LENGTH, form } from './model';

export const SignUpForm = () => {
  const { formRef } = useFormErrorFocus(form);

  return (
    <form ref={formRef} onSubmit={(event) => event.preventDefault()}>
      <Placeholder header={i18n.t('signUp.title')} description={i18n.t('signUp.description')}>
        <Avatar size={96} acronym="M" />
      </Placeholder>
      <Username />
      <UsernameError />
    </form>
  );
};

const Username = reflect({
  bind: {
    name: 'username',
    onBlur: () => form.fields.username.onBlur(),
    value: form.fields.username.$value,
    onChange: ({ target: { value } }) => form.fields.username.onChange(value),
    header: form.fields.username.$value.map(
      (value) => `${i18n.t('username.title')} * (${value.length}/${MAX_USERNAME_LENGTH})`,
    ),
    placeholder: i18n.t('username.placeholder'),
    status: form.fields.username.$errorText.map((error) => (error ? 'error' : 'default')),
  },
  view: Input,
});

const UsernameError = reflect({
  bind: {
    text: form.fields.username.$errorText,
  },
  view: ErrorCaption,
});
