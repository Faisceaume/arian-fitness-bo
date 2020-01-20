import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Materiel } from '../materiel';
import { FormControl, NgForm } from '@angular/forms';
import { MaterielsService } from '../materiels.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';

@Component({
  selector: 'app-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.css']
})
export class MaterielFormComponent implements OnInit {

  // toppings = new FormControl();
  formData: Materiel;
  // categories: string[] = ['salledesport', 'machines', 'bancs', 'petitmateriel', 'nomateriel'];

  // Chips section
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = ['salledesport', 'machines', 'bancs', 'petitmateriel', 'nomateriel'];
  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  // toggle slide
  posteFixeControl = new FormControl();
  visibilityControl = new FormControl();

  constructor(private materielsService: MaterielsService) { }

  ngOnInit() {
    this.formData = {
      id : null,
      nom : '',
      timestamp: '',
      postefixe: false,
      visibility: false,
      categories: []
    } as Materiel;

    // Chips section
    // tslint:disable-next-line: deprecation
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  onSubmit(): void {
    this.formData.categories = this.fruits;
    if (this.posteFixeControl.value) {
      this.formData.postefixe = this.posteFixeControl.value;
    }
    if (this.visibilityControl.value) {
      this.formData.visibility = this.visibilityControl.value;
    }
    this.materielsService.createMateriel(this.formData);
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
