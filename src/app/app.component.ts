import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedPage: string = 'recipe';
  onNavigate(page: string) {
    this.selectedPage = page;
  }
}
