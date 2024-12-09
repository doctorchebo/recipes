import { Component } from '@angular/core';
import { DataStoreService } from '../shared/data-store.service';
import { NavigationService } from '../shared/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private navigationService: NavigationService,
    private dataStoreService: DataStoreService
  ) {}

  onSelectPage(page: string) {
    this.navigationService.currentPage.emit(page);
  }

  onSaveData() {
    this.dataStoreService.storeData();
  }

  onFetchData() {
    this.dataStoreService.fetchData().subscribe();
  }
}
