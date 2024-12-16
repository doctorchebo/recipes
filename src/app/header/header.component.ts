import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { NavigationService } from '../shared/navigation.service';
import * as fromApp from '../store/app.reducer';

import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private navigationService: NavigationService,
    private store: Store<fromApp.AppState>
  ) {}
  userSubscription!: Subscription;
  isAuthenticated: boolean = false;
  ngOnInit() {
    this.userSubscription = this.store
      .select('auth')
      .pipe(
        map((authState) => {
          return authState.user;
        })
      )
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onSelectPage(page: string) {
    this.navigationService.currentPage.emit(page);
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.SaveRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
