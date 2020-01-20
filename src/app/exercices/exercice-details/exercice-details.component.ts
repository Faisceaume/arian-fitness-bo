import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Exercice } from '../exercice';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit {

  // toppings = new FormControl();
  formData: Exercice;

  categories: string[] = ['categorie1', 'categorie2', 'categorie3', 'categorie4'];

      // Chips section
      visible = true;
      selectable = true;
      removable = true;
      addOnBlur = true;
      separatorKeysCodes: number[] = [ENTER, COMMA];
      fruitCtrl = new FormControl();
      filteredFruits: Observable<string[]>;
      fruits: string[] = [];
      allFruits: string[] = ['categorie1', 'categorie2', 'categorie3', 'categorie4'];
      @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
      @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService,
              private router: Router) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then(
                  (item: Exercice) => {
                    this.formData = item;
                    // this.toppings.setValue(this.formData.categories);
                    this.fruits = item.categories;
                  }
                );
  }

  onSubmit() {
    // this.formData.categories = this.toppings.value;
    this.formData.categories = this.fruits;
    this.exercicesService.updateExercice(this.formData);
    this.router.navigate(['exercices']);
  }


  // Chips section
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}
