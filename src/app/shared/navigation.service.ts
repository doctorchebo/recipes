import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class NavigationService {
  currentPage = new EventEmitter<string>();
}
