import { Component } from '@angular/core';
import { NavigationService } from '../shared/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private navigationService: NavigationService) {}

  onSelectPage(page: string) {
    this.navigationService.currentPage.emit(page);
  }
}
