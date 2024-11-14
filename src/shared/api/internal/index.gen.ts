 

/* tslint:disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
import { createEffect } from 'effector';

import { i18n } from '~/shared/config/i18n';
import { NotificationType, notificationShow } from '~/shared/ui/Notification';

import { requestFx } from '../request';

export type SignInResponseDto = {
  /** @example "success" */
  status: 'success' | 'needSignUp';
};

export type SignUpDtoValidationResponse = {
  /** @example 400 */
  statusCode: number;
  code: 'GENERIC.VALIDATION_ERROR';
  constraints: {
    'username.maxLength'?: string;
    'username.minLength'?: string;
    'username.matches'?: string;
  };
};

export type UsernameAlreadyExistsError = {
  /** @example 400 */
  statusCode: number;
  code: 'AUTH.USERNAME_ALREADY_EXISTS';
};

export type SignUpDto = {
  /**
   * @minLength 3
   * @maxLength 50
   * @example "@Dzhabb"
   */
  username: string;
};

export type UnauthorizedException = {
  /** @example 400 */
  statusCode: number;
  code: 'GENERIC.UNAUTHORIZED';
};

export type Sex = 'None' | 'Female' | 'Male';

export type UserAuthDto = {
  /** @example 1 */
  id: number;
  /** @example "johny" */
  username: string;
  /** @example ["ACCESS_CONTROL_MANAGE"] */
  permissions: 'ACCESS_CONTROL_MANAGE'[];
  /** @example "John" */
  description: string | null;
  /** @example "Male" */
  sex: Sex;
};

export type AssignRoleToUserDto = {
  /** @example 1 */
  roleId: any;
};

export type BadRequestException = {
  /** @example 400 */
  statusCode: number;
  code: 'GENERIC.BAD_REQUEST';
};

export type NotFoundException = {
  /** @example 400 */
  statusCode: number;
  code: 'GENERIC.NOT_FOUND';
};

export type AuthOauthSignInParams = {
  headers: {
    /** Oauth token */
    authorization: string;
  };
};

export const authOauthSignInFx = createEffect<AuthOauthSignInParams, SignInResponseDto, any>(
  async ({ headers }) => {
    const response = await requestFx({
      path: `/auth/oauth/sign-in`,
      method: 'post',
      headers,
    });

    if (response.status === 500) {
      notificationShow({
        type: NotificationType.error,
        title: i18n.t('errors.internalServerError.title'),
        description: i18n.t('errors.internalServerError.description'),
        isCloseable: true,
      });
      throw new Error('Internal server error');
    }

    if (response.status >= 400) {
      throw response.body as any;
    }

    return response.body as SignInResponseDto;
  },
);

export type AuthOauthSignUpParams = {
  headers: {
    /** Oauth token */
    authorization: string;
  };
  data: SignUpDto;
};

export const authOauthSignUpFx = createEffect<
  AuthOauthSignUpParams,
  void,
  (SignUpDtoValidationResponse | UsernameAlreadyExistsError) | UnauthorizedException
>(async ({ headers, data }) => {
  const response = await requestFx({
    path: `/auth/oauth/sign-up`,
    method: 'post',
    headers,
    body: data,
  });

  if (response.status === 500) {
    notificationShow({
      type: NotificationType.error,
      title: i18n.t('errors.internalServerError.title'),
      description: i18n.t('errors.internalServerError.description'),
      isCloseable: true,
    });
    throw new Error('Internal server error');
  }

  if (response.status >= 400) {
    throw response.body as
      | (SignUpDtoValidationResponse | UsernameAlreadyExistsError)
      | UnauthorizedException;
  }

  return response.body as void;
});

export type AuthMeParams = void;

export const authMeFx = createEffect<AuthMeParams, UserAuthDto, UnauthorizedException>(async () => {
  const response = await requestFx({
    path: `/auth/me`,
    method: 'post',
  });

  if (response.status === 500) {
    notificationShow({
      type: NotificationType.error,
      title: i18n.t('errors.internalServerError.title'),
      description: i18n.t('errors.internalServerError.description'),
      isCloseable: true,
    });
    throw new Error('Internal server error');
  }

  if (response.status >= 400) {
    throw response.body as UnauthorizedException;
  }

  return response.body as UserAuthDto;
});

export type AuthLogoutParams = void;

export const authLogoutFx = createEffect<AuthLogoutParams, void, UnauthorizedException>(
  async () => {
    const response = await requestFx({
      path: `/auth/logout`,
      method: 'post',
    });

    if (response.status === 500) {
      notificationShow({
        type: NotificationType.error,
        title: i18n.t('errors.internalServerError.title'),
        description: i18n.t('errors.internalServerError.description'),
        isCloseable: true,
      });
      throw new Error('Internal server error');
    }

    if (response.status >= 400) {
      throw response.body as UnauthorizedException;
    }

    return response.body as void;
  },
);

export type UserGetUsersParams = void;

export const userGetUsersFx = createEffect<UserGetUsersParams, void, any>(async () => {
  const response = await requestFx({
    path: `/users`,
    method: 'get',
  });

  if (response.status === 500) {
    notificationShow({
      type: NotificationType.error,
      title: i18n.t('errors.internalServerError.title'),
      description: i18n.t('errors.internalServerError.description'),
      isCloseable: true,
    });
    throw new Error('Internal server error');
  }

  if (response.status >= 400) {
    throw response.body as any;
  }

  return response.body as void;
});

export type UserAssignRoleToUserParams = { userId: string; data: AssignRoleToUserDto };

export const userAssignRoleToUserFx = createEffect<
  UserAssignRoleToUserParams,
  any,
  BadRequestException | UnauthorizedException
>(async ({ userId, data }) => {
  const response = await requestFx({
    path: `/users/${userId}/role`,
    method: 'post',
    body: data,
  });

  if (response.status === 500) {
    notificationShow({
      type: NotificationType.error,
      title: i18n.t('errors.internalServerError.title'),
      description: i18n.t('errors.internalServerError.description'),
      isCloseable: true,
    });
    throw new Error('Internal server error');
  }

  if (response.status >= 400) {
    throw response.body as BadRequestException | UnauthorizedException;
  }

  return response.body as any;
});

export type RulesGetRulesParams = { lang: string };

export const rulesGetRulesFx = createEffect<RulesGetRulesParams, string, NotFoundException>(
  async ({ lang }) => {
    const response = await requestFx({
      path: `/rules/${lang}`,
      method: 'get',
    });

    if (response.status === 500) {
      notificationShow({
        type: NotificationType.error,
        title: i18n.t('errors.internalServerError.title'),
        description: i18n.t('errors.internalServerError.description'),
        isCloseable: true,
      });
      throw new Error('Internal server error');
    }

    if (response.status >= 400) {
      throw response.body as NotFoundException;
    }

    return response.body as string;
  },
);
