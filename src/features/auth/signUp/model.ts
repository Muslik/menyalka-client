import { createMutation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { createAction } from 'effector-action';
import { createForm } from 'effector-forms';

import { internalApi } from '~/shared/api';
import { i18n } from '~/shared/config/i18n';
import { $launchParams } from '~/shared/lib/tma';
import { typedKeys } from '~/shared/lib/typedObject';
import { rules } from '~/shared/lib/validation-rules';
import { sessionRequestQuery } from '~/shared/session';
import { NotificationType, notificationShow } from '~/shared/ui/Notification';

export const formSubmitted = createEvent<Form>();

export type Form = {
  username: string;
};

const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 50;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const MIN_LETTERS_COUNT = 1;
const LETTERS_REGEX = /[a-zA-Z]/g;

export const form = createForm({
  validateOn: ['submit', 'change'],
  fields: {
    username: {
      init: '',
      rules: [
        rules.minLength(MIN_USERNAME_LENGTH, {
          message: i18n.t('validation.username.minLength', { val: MIN_USERNAME_LENGTH }),
        }),
        rules.maxLength(MAX_USERNAME_LENGTH, {
          message: i18n.t('validation.username.maxLength', { val: MAX_USERNAME_LENGTH }),
        }),
        rules.regex(USERNAME_REGEX, {
          message: i18n.t('validation.username.matches'),
        }),
        rules.refine((value) => (value.match(LETTERS_REGEX) || []).length >= MIN_LETTERS_COUNT, {
          message: i18n.t('validation.username.letters'),
        }),
      ],
    },
  },
});

const signUpTelegramMutation = createMutation({
  effect: internalApi.authOauthSignUpFx,
});

sample({
  source: $launchParams,
  clock: form.formValidated,
  fn: (params, form) => ({
    headers: {
      authorization: `tma ${params?.initDataRaw}`,
    },
    data: form,
  }),
  target: signUpTelegramMutation.start,
});

sample({
  clock: signUpTelegramMutation.finished.success,
  target: sessionRequestQuery.start,
});

createAction({
  clock: signUpTelegramMutation.finished.failure,
  target: {
    addError: form.fields.username.addError,
    notificationShow,
  },
  fn: (target, { error }) => {
    switch (error.code) {
      case 'AUTH.USERNAME_ALREADY_EXISTS':
        target.addError({
          rule: 'serverError',
          errorText: i18n.t(`validation.username.unique`),
        });
        break;
      case 'GENERIC.VALIDATION_ERROR': {
        const firstError = typedKeys(error.constraints)[0]!;

        target.addError({
          rule: 'serverError',
          errorText: i18n.t(`validation.${firstError}`),
        });
        break;
      }
      case 'GENERIC.UNAUTHORIZED': {
        notificationShow({
          type: NotificationType.error,
          title: i18n.t('errors.internalServerError.title'),
          description: i18n.t('errors.internalServerError.description'),
        });
        break;
      }
      default:
        assertUnreachable(error);
    }
  },
});
