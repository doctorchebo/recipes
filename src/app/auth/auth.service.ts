import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from './user.model';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const apiKey = environment.apiKey;

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((userData) => {
          this.handleAuthentication(
            userData.email,
            userData.localId,
            userData.idToken,
            +userData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    let errorMessage = 'An unknown error occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This is not a valid email';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email was not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is not valid';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid login credentials';
    }

    return throwError(() => new Error(errorMessage));
  }
}