import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | null;
  loading: boolean;
  error: string | null;
}
const initialState: State = {
  user: null,
  loading: false,
  error: null,
};
export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATION_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.tokenExpirationDate
      );
      return {
        ...state,
        user: user,
        loading: false,
        error: null,
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        loading: true,
      };

    case AuthActions.AUTHENTICATION_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
