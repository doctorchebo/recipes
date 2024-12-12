import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}
  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(`${apiUrl}recipes.json`, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchData() {
    return this.http.get<Recipe[]>(`${apiUrl}recipes.json`).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        console.log('fetched successfully');
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
