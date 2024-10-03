import { onAbort } from '@farfetched/core';
import { attach, createEffect, createEvent, restore } from 'effector';

import { env } from '~/shared/config';
import { logger } from '~/shared/lib/logger';

import { Answer, Request } from '../types';
import { clientRequest } from './client';

export const sendRequestFx = createEffect<Request, Answer, Answer>({
  handler: async (params) => {
    const abortController = new AbortController();

    onAbort(() => {
      abortController.abort();
    });

    return clientRequest({ ...params, signal: abortController.signal });
  },
});

export const setCookiesForRequest = createEvent<string>();
export const $cookiesForRequest = restore(setCookiesForRequest, '');

export const setCookiesFromResponse = createEvent<string>();
export const $cookiesFromResponse = restore(setCookiesFromResponse, '');

export const requestFx = attach({
  effect: sendRequestFx,
  source: $cookiesForRequest,
  mapParams: (parameters: Request, cookies) => ({ ...parameters, cookies }),
});

if (env.IS_DEBUG || env.IS_DEV_ENV) {
  sendRequestFx.watch(({ path, method }) => {
    logger.info('[ REQUEST ]', { method, path });
  });

  sendRequestFx.done.watch(({ params: { path, method }, result: { status } }) => {
    logger.info('[ REQUEST DONE ]', { method, path, status });
  });

  sendRequestFx.fail.watch(({ params: { path, method }, error: { status, body } }) => {
    logger.info('[ REQUEST FAIL ]', { method, path, status, body });
  });
}
