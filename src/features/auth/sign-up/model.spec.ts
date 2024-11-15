import { allSettled, fork } from 'effector';

import { $launchParams } from '~/shared/lib/tma';
import { sessionRequestQuery } from '~/shared/session';

import { form, signUpTelegramMutation } from './model';

describe('sign up form', () => {
  afterEach(() => {
    vitest.clearAllMocks();
  });

  it('Should fail if username length is less then 3', async () => {
    const scope = fork();

    await allSettled(form.fields.username.changed, { scope, params: 'S' });

    await allSettled(form.submit, { scope });

    expect(scope.getState(form.fields.username.$errors)).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: 'MIN_LENGTH' })]),
    );
  });

  it('Should fail if username length is more then 50', async () => {
    const scope = fork();

    await allSettled(form.fields.username.changed, { scope, params: 'S'.repeat(51) });

    await allSettled(form.submit, { scope });

    expect(scope.getState(form.fields.username.$errors)).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: 'MAX_LENGTH' })]),
    );
  });

  it('Should fail if username contains invalid characters', async () => {
    const scope = fork();

    await allSettled(form.fields.username.changed, { scope, params: 'S@' });

    await allSettled(form.submit, { scope });

    expect(scope.getState(form.fields.username.$errors)).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: 'IS_ALPHANUMERIC' })]),
    );
  });

  it('Should fail if username contains less then 1 letter', async () => {
    const scope = fork();

    await allSettled(form.fields.username.changed, { scope, params: '123456' });

    await allSettled(form.submit, { scope });

    expect(scope.getState(form.fields.username.$errors)).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: 'MIN_LETTERS' })]),
    );
  });

  it('Should show error if server return validation error', async () => {
    const sendMock = vitest.fn();
    const scope = fork({
      handlers: [[signUpTelegramMutation.__.executeFx, sendMock]],
    });

    sendMock.mockRejectedValueOnce({
      code: 'GENERIC.VALIDATION_ERROR',
      constraints: {
        usernameMinLength: 'Username should contain at least 3 characters',
      },
    });

    await allSettled(form.fields.username.changed, { scope, params: 'Dzhab' });
    await allSettled(form.submit, { scope });

    expect(scope.getState(form.fields.username.$errors)).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: 'serverError' })]),
    );
  });

  it('Send form on form submit', async () => {
    const sendMock = vitest.fn();
    const scope = fork({
      values: [[$launchParams, { initDataRaw: 'initDataRaw' }]],
      handlers: [[signUpTelegramMutation.__.executeFx, sendMock]],
    });

    await allSettled(form.fields.username.changed, { scope, params: 'Dzhab' });
    await allSettled(form.submit, { scope });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          data: expect.objectContaining({
            username: 'Dzhab',
          }),
          headers: expect.objectContaining({
            authorization: 'tma initDataRaw',
          }),
        }),
      }),
    );
  });

  it('Should request session on successful sign up', async () => {
    const requestSessionMock = vitest.fn();
    const scope = fork({
      handlers: [[sessionRequestQuery.__.executeFx, requestSessionMock]],
    });

    await allSettled(form.fields.username.changed, { scope, params: 'Dzhab' });
    await allSettled(form.submit, { scope });

    expect(requestSessionMock).toHaveBeenCalled();
  });
});
