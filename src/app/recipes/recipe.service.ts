import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  ingredientsSentToShoppingList = new EventEmitter<Ingredient[]>();
  selectedRecipe = new EventEmitter<Recipe>();

  recipes: Recipe[] = [];

  constructor(private store: Store<{ shoppingList: AppState }>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shoppingListService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.triggerChange();
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.triggerChange();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.triggerChange();
  }

  triggerChange() {
    console.log(this.recipes);
    this.recipesChanged.next(this.recipes.slice());
  }
}
