import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';

const apiKey = environment.apiKey;

@Injectable({ providedIn: 'root' })
export class AuthService {
  // user = new BehaviorSubject<User | null>(null);
  expirationTimer: any = null;
  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expiresIn: number) {
    this.expirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expiresIn);
  }

  clearLogoutTimer() {
    this.expirationTimer = null;
  }
}
