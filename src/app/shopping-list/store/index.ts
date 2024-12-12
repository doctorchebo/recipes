import { ActionReducerMap } from '@ngrx/store';
import {
  ShoppingListReducer,
  ShoppingListState,
} from './shopping-list.reducer';

export interface AppState {
  shoppingList: ShoppingListState;
}

export const reducers: ActionReducerMap<AppState, any> = {
  shoppingList: ShoppingListReducer,
};
