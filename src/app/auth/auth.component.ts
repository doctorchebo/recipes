import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import { AuthService } from './auth.service';
import * as AuthActions from './store/auth.actions';
import { AuthResponse } from './store/auth.effects';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;
  closeSub!: Subscription;
  authSub!: Subscription;
  @ViewChild(PlaceholderDirective) hostAlert!: PlaceholderDirective;

  ngOnInit() {
    this.authSub = this.store.select('auth').subscribe((authData) => {
      this.isLoading = authData.loading;
      this.error = authData.error;
    });
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    console.log(authForm.value);
    if (!authForm.valid) {
      return;
    }
    this.isLoading = true;
    const email = authForm.value.email;
    const password = authForm.value.password;
    let authObservable: Observable<AuthResponse>;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      // authObservable = this.authService.signup(email, password);
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }
    authForm.reset();
  }

  onClearError() {
    this.store.dispatch(new AuthActions.ClearError());
  }
  // create error modal programatically
  createErrorModal(message: string) {
    const hostAlertContainerRef = this.hostAlert.viewContainerRef;
    const hostAlertComponentRef =
      hostAlertContainerRef.createComponent(AlertComponent);
    hostAlertComponentRef.instance.message = message;
    this.closeSub = hostAlertComponentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostAlertContainerRef.clear();
    });
  }
  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
