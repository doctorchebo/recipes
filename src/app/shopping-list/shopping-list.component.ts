import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import { AppState } from '../store/app.reducer';
import { State } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent {
  ingredients!: Observable<State>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }
  addNewIngredient(ingredient: Ingredient) {
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
  }

  onEditItem(index: number) {
    // this.shoppingListService.editingStarted.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
