import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipes.actions';
const apiUrl = environment.apiUrl;
@Injectable()
export class RecipesEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
  fetchRecipes = createEffect((): any => {
    return this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<{recipes: Recipe[]}>(`${apiUrl}recipes.json`);
      }),
      map((recipes) => {
        console.log(recipes);
        return recipes.recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    );
  });

  saveRecipes = createEffect(
    (): any => {
      return this.actions$.pipe(
        ofType(RecipesActions.SAVE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([recipesAction, recipes]) => {
          return this.http.put(`${apiUrl}recipes.json`, recipes);
        })
      );
    },
    { dispatch: false }
  );
}
