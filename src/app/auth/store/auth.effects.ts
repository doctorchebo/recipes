import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const apiKey = environment.apiKey;

const handleAuthentication = (authRes: AuthResponse) => {
  const expirationDate = new Date(
    new Date().getTime() + +authRes.expiresIn * 1000
  );

  const user = new User(
    authRes.email,
    authRes.localId,
    authRes.idToken,
    expirationDate
  );

  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticationSuccess({
    email: authRes.email,
    userId: authRes.localId,
    token: authRes.idToken,
    tokenExpirationDate: expirationDate,
  });
};

const handleError = (errorRes: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticationFailed(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Email was not found';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid Password';
      break;
    case 'INVALID_LOGIN_CREDENTIALS':
      errorMessage = 'Invalid login credentials';
  }

  return of(new AuthActions.AuthenticationFailed(errorMessage));
};
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  authLogin = createEffect((): any => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((authRes: AuthResponse) => {
              this.authService.setLogoutTimer(+authRes.expiresIn * 1000);
              return handleAuthentication(authRes);
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    );
  });

  authFail = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATION_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  signup = createEffect((): any => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupData: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            {
              email: signupData.payload.email,
              password: signupData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((authRes) => {
              this.authService.setLogoutTimer(+authRes.expiresIn * 1000);
              return handleAuthentication(authRes);
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    );
  });

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _expiresAt: string;
        } = JSON.parse(localStorage.getItem('userData')!);
        if (!userData) {
          return { type: 'DUMMY' };
        }
        console.log('userdata was parsed correctly');
        const user = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._expiresAt)
        );
        if (user.token) {
          console.log('user has token');
          return new AuthActions.AuthenticationSuccess({
            email: userData.email,
            userId: userData.id,
            token: userData._token,
            tokenExpirationDate: new Date(userData._expiresAt),
          });
        }
        return { type: 'DUMMY' };
      })
    );
  });

  logout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      );
    },
    { dispatch: false }
  );
}
