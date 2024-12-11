import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponse, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;
  closeSub!: Subscription
  @ViewChild(PlaceholderDirective) hostAlert! : PlaceholderDirective

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
        this.createErrorModal(errorMessage);
        this.isLoading = false;
      }
    );
    authForm.reset();
  }

  onClearError() {
    this.error = null;
  }

  handleError(){
    this.error = null;
  }
  // create error modal programatically
  createErrorModal(message: string){
    const hostAlertContainerRef = this.hostAlert.viewContainerRef
    const hostAlertComponentRef = hostAlertContainerRef.createComponent(AlertComponent)
    hostAlertComponentRef.instance.message = message;
    this.closeSub = hostAlertComponentRef.instance.close.subscribe(()=> {
      this.closeSub.unsubscribe();
      hostAlertContainerRef.clear();
    })

  }
  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}
