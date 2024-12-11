import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStoreService } from '../shared/data-store.service';
import { NavigationService } from '../shared/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private navigationService: NavigationService,
    private dataStoreService: DataStoreService,
    private authService: AuthService
  ) {}
  userSubscription!: Subscription;
  isAuthenticated: boolean = false;
  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe((user) => {
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
