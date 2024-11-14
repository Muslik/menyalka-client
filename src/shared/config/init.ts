import { createEvent, fork } from 'effector';

export const appStarted = createEvent();

export const scope = fork();
