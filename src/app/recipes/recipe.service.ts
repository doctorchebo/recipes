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
  recipes: Recipe[] = [
    new Recipe(
      'Sajta de Pollo',
      'Deliciosa receta boliviana',
      'https://upload.wikimedia.org/wikipedia/commons/9/9d/Sajta_de_pollo_Pace%C3%B1o.jpg',
      [new Ingredient('Pollo', 1), new Ingredient('Arroz', 500)]
    ),
    new Recipe(
      'Pique macho',
      'Plato tipico de Cochabamba para 8 personas',
      'https://www.cochabamba2018.bo/wp-content/uploads/2024/07/pique-Bolivia-1-715x400.jpg',
      [new Ingredient('Carne', 2), new Ingredient('Papa Frita', 50)]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

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
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }
}
