import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit {
  constructor(private slService: ShoppingListService) {}
  @ViewChild('f') slForm!: NgForm;
  editMode: boolean = false;
  editedIngredientIndex!: number;
  editedIngredient!: Ingredient;
  ngOnInit() {
    this.slService.editingStarted.subscribe((index: number) => {
      this.editedIngredientIndex = index;
      this.editMode = true;
      this.editedIngredient = this.slService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedIngredient.name,
        amount: this.editedIngredient.amount,
      });
    });
  }
  onSubmit(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedIngredientIndex!, ingredient);
    } else {
      this.slService.addIngredient(ingredient);
    }

    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedIngredientIndex!);
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }
}
