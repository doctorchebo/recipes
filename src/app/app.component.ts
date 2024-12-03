import { Component, OnInit } from '@angular/core';
import { NavigationService } from './shared/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  selectedPage: string = 'recipe';
  constructor(private navigationService: NavigationService) {}
  ngOnInit() {
    this.navigationService.currentPage.subscribe((page: string) => {
      this.selectedPage = page;
    });
  }
}
