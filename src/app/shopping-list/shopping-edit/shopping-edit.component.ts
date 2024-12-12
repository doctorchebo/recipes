import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { AppState } from '../../store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}
  @ViewChild('f') slForm!: NgForm;
  editMode: boolean = false;
  editedIngredient!: Ingredient;
  subscription!: Subscription;
  ngOnInit() {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((storeData) => {
        if (
          storeData.editedIngredientIndex > -1 &&
          storeData.editedIngredient
        ) {
          this.editMode = true;
          this.editedIngredient = storeData.editedIngredient;
          this.slForm.setValue({
            name: this.editedIngredient.name,
            amount: this.editedIngredient.amount,
          });
        }
      });
  }
  onSubmit(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }

    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editedIngredientIndex!);
    this.store.dispatch(new ShoppingListActions.RemoveIngredient());
    this.onClear();
  }

  onClear() {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
