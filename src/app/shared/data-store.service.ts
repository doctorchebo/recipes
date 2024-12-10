import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}
  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(`${apiUrl}recipes.json`, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchData() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user || !user.token) {
          throw new Error('User not authenticated');
        }
        return this.http.get<Recipe[]>(`${apiUrl}recipes.json`, {
          params: new HttpParams().set('auth', user.token),
        });
      }),
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
