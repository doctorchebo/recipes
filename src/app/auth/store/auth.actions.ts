import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATION_SUCCESS = '[Auth] Authentication Success';
export const AUTHENTICATION_FAILED = '[Auth] Authentication Failed';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticationSuccess implements Action {
  readonly type = AUTHENTICATION_SUCCESS;
  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      tokenExpirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}
export class AuthenticationFailed implements Action {
  readonly type = AUTHENTICATION_FAILED;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}
export type AuthActions =
  | AuthenticationSuccess
  | Logout
  | LoginStart
  | AuthenticationFailed
  | SignupStart
  | ClearError
  | AutoLogin;
