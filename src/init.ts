import * as Sentry from '@sentry/react';
import { Message, inspect } from 'effector/inspect';

Sentry.init({
  dsn: 'https://eda60c0e179f71baec51d3cc57dfdf45@o4508240557178880.ingest.de.sentry.io/4508240561832016',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

inspect({
  /**
   * Explicitly define that we will
   * catch only messages where Scope is undefined
   */
  scope: undefined,
  fn: (m: Message) => {
    const name = `${m.kind} ${m.name}`;
    const error = new Error(`${name} is not bound to scope`);

    console.error(error);
  },
});
