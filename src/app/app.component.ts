import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
