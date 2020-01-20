import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Materiel } from '../materiel';
import { MaterielsService } from '../materiels.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
@Component({
  selector: 'app-materiel-details',
  templateUrl: './materiel-details.component.html',
  styleUrls: ['./materiel-details.component.css']
})
export class MaterielDetailsComponent implements OnInit {

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

  constructor(private route: ActivatedRoute,
              private materielsService: MaterielsService,
              private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.materielsService.getSingleMateriel(id).then(
      (item: Materiel) => {
        this.formData = item;
        this.posteFixeControl.setValue(item.postefixe);
        this.visibilityControl.setValue(item.visibility);
        this.fruits = item.categories;
      }
    );

    // Chips section
    // tslint:disable-next-line: deprecation
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

  }

  onSubmit() {
      this.formData.postefixe = this.posteFixeControl.value;
      this.formData.visibility = this.visibilityControl.value;
      this.materielsService.updateMaterial(this.formData);
      this.router.navigate(['materiels']);
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
