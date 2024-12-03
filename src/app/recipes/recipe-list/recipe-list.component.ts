import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  recipes: Recipe[] = [];

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
  }

  onAddRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
