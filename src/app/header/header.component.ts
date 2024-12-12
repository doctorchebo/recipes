import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStoreService } from '../shared/data-store.service';
import { NavigationService } from '../shared/navigation.service';
import * as fromAppReducer from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private navigationService: NavigationService,
    private dataStoreService: DataStoreService,
    private authService: AuthService,
    private store: Store<fromAppReducer.AppState>
  ) {}
  userSubscription!: Subscription;
  isAuthenticated: boolean = false;
  ngOnInit() {
    this.userSubscription = this.store
      .select('auth')
      .pipe(
        take(1),
        map((authState) => authState.user)
      )
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onSelectPage(page: string) {
    this.navigationService.currentPage.emit(page);
  }

  onSaveData() {
    this.dataStoreService.storeData();
  }

  onFetchData() {
    this.dataStoreService.fetchData().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
