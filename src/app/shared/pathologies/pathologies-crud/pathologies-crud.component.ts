import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Pathologie } from '../pathologie';
import { PathologiesService } from '../pathologies.service';

@Component({
  selector: 'app-pathologies-crud',
  templateUrl: './pathologies-crud.component.html',
  styleUrls: ['./pathologies-crud.component.css']
})
export class PathologiesCrudComponent implements OnInit {

  formData: Pathologie;
  toCreate: boolean;

  constructor(public dialogRef: MatDialogRef<PathologiesCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private pathologiesService: PathologiesService) { }

  ngOnInit() {
    if (this.data) {
      this.formData = this.data;
    } else {
      this.formData = {
        id: null,
        nom: '',
        acronyme: '',
        details: '',
        timestamp: 0
      } as Pathologie;

      this.toCreate = true;
    }
  }

  onSubmit() {
    this.pathologiesService.createPathologie(this.formData);
    this.closeDialog();
  }

  updateField(attribut: string, value: any) {
    if (this.formData.id) {
      this.pathologiesService.newUpdateVersion(this.formData, attribut, value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
