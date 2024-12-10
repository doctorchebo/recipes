import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponse, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {}
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

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
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }
    authObservable.subscribe(
      (authResponse) => {
        console.log(authResponse);
        this.router.navigate(['/recipes']);
        this.isLoading = false;
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    authForm.reset();
  }

  onClearError() {
    this.error = null;
  }
}
