import { createQuery } from '@farfetched/core';
import {
  NavigateParams,
  RouteInstance,
  RouteParams,
  RouteParamsAndQuery,
  chainRoute,
} from 'atomic-router';
import { UnitTargetable, createEvent, createStore, sample } from 'effector';

import { internalApi } from '../api';
import { UserAuthDto } from '../api/internal';

type Permission = UserAuthDto['permissions'][number];

export const checkPermission = (permissions: Permission[], requiredPermission?: Permission) => {
  if (!requiredPermission) {
    return true;
  }

  return permissions.includes(requiredPermission);
};

export enum AuthStatus {
  Initial = 0,
  Pending,
  Anonymous,
  Authenticated,
}

export const sessionRequestQuery = createQuery({
  effect: internalApi.authMeFx,
});

export const $user = createStore<internalApi.UserAuthDto | null>(null);
export const $authenticationStatus = createStore(AuthStatus.Initial);

$authenticationStatus.on(sessionRequestQuery.started, (status) => {
  if (status === AuthStatus.Initial) {
    return AuthStatus.Pending;
  }

  return status;
});

$user.on(sessionRequestQuery.finished.success, (_, { result }) => result);
$authenticationStatus.on(sessionRequestQuery.finished.success, () => AuthStatus.Authenticated);

$authenticationStatus.on(sessionRequestQuery.finished.failure, () => AuthStatus.Anonymous);

type ChainParams<Params extends RouteParams> = {
  permission?: Permission;
  otherwise?: UnitTargetable<NavigateParams<Params>>;
};

export function chainAuthorized<Params extends RouteParams>(
  route: RouteInstance<any>,
  { otherwise, permission }: ChainParams<Params> = {},
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<NavigateParams<Params>>();
  const sessionReceivedAnonymous = createEvent<NavigateParams<Params>>();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  const authenticatedWithPermission = sample({
    clock: [alreadyAuthenticated, sessionRequestQuery.finished.success],
    source: $user,
    filter: (user) => Boolean(user && checkPermission(user.permissions, permission)),
  });

  const notAuthenticatedWithPermission = sample({
    clock: [alreadyAuthenticated, sessionRequestQuery.finished.success],
    source: $user,
    filter: (user) => !user || !checkPermission(user.permissions, permission),
  });

  sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Initial,
    target: sessionRequestQuery.start,
  });

  sample({
    clock: [notAuthenticatedWithPermission, alreadyAnonymous, sessionRequestQuery.finished.failure],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAnonymous,
  });

  if (otherwise) {
    sample({
      clock: sessionReceivedAnonymous,
      target: otherwise,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: authenticatedWithPermission,
    cancelOn: sessionReceivedAnonymous,
  });
}

export function chainAnonymous<Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<Params> = {},
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const sessionReceivedAuthenticated = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Initial,
    target: sessionRequestQuery.start,
  });

  sample({
    clock: [alreadyAuthenticated, sessionRequestQuery.finished.success],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAuthenticated,
  });

  if (otherwise) {
    sample({
      clock: sessionReceivedAuthenticated,
      target: otherwise,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAnonymous, sessionRequestQuery.finished.failure],
    cancelOn: sessionReceivedAuthenticated,
  });
}
