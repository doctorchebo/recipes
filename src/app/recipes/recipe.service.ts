import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  ingredientsSentToShoppingList = new EventEmitter<Ingredient[]>();
  selectedRecipe = new EventEmitter<Recipe>();
  // recipes: Recipe[] = [
  //   new Recipe(
  //     'Sajta de Pollo',
  //     'Deliciosa receta boliviana',
  //     'https://pagestudio.s3.theshoppad.net/bolivianita-de/b542b9847ad42312091ff20293110d7a.jpg',
  //     [new Ingredient('Pollo', 1), new Ingredient('Arroz', 500)]
  //   ),
  //   new Recipe(
  //     'Pique macho',
  //     'Plato tipico de Cochabamba para 8 personas',
  //     'https://www.cochabamba2018.bo/wp-content/uploads/2024/07/pique-Bolivia-1-715x400.jpg',
  //     [new Ingredient('Carne', 2), new Ingredient('Papa Frita', 50)]
  //   ),
  // ];

  recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {}

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
    this.shoppingListService.addIngredients(ingredients);
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
