import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent {
  @Output() recipeSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe(
      'Sajta de Pollo',
      'Deliciosa receta boliviana',
      'https://upload.wikimedia.org/wikipedia/commons/9/9d/Sajta_de_pollo_Pace%C3%B1o.jpg'
    ),
    new Recipe(
      'Pique macho',
      'Plato tipico de Cochabamba para 8 personas',
      'https://www.cochabamba2018.bo/wp-content/uploads/2024/07/pique-Bolivia-1-715x400.jpg'
    ),
  ];

  onSelectRecipe(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }
}
