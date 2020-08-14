import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit, OnDestroy {

  fileIsOK = true;
  fileIsUploading = false;
  fileUploaded = false;
  erreursMessages: string[];


  @Input() width: number;
  @Input() heigth: number;
  @Input() size: number;
  @Input() isPng: boolean = false;

  constructor(public sharedService: SharedService) { }

  ngOnInit() {

  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.sharedService.uploadFile(file).then(
      (url: string) => {
         this.sharedService.setFileUrl(url);
         this.sharedService.isImageUploadShown = false;
         this.fileIsUploading = false;
         this.fileUploaded = true;
      }
    );
  }

  detectFile(event) {
      const file: File = event.target.files[0];
      if (this.isPng) {
        if (file.type === 'image/png') {
          this.traitementImage(file);
        } else {
          alert('L\'image doit être de type PNG');
        }
      } else {
        if (file.type === 'image/jpeg') {
          this.traitementImage(file);
        } else {
          alert('L\'image doit être de type JPEG');
        }
      }
      
  }


    handleDrop(e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (this.isPng) {
        if (file.type === 'image/png') {
          this.traitementImage(file);
        } else {
          alert('L\'image doit être de type PNG');
        }
      } else {
        if (file.type === 'image/jpeg') {
          this.traitementImage(file);
        } else {
          alert('L\'image doit être de type JPEG');
        }
      }
    }

  traitementImage(file: File) {
  this.getImageDimension(window.URL.createObjectURL(file)).then(
    (dimension: any) => {
      this.erreursMessages = [];
      if (dimension.largeur === dimension.hauteur) {

          if ( file.size < this.size  &&
          dimension.largeur < this.width
          && dimension.hauteur < this.heigth) {
              this.onUploadFile(file);
              this.fileIsOK = true;
          } else {
              this.fileIsOK = false;
          }

      } else {
        this.erreursMessages.push('la largeur et la hauteur de l\'image doivent avoir la même dimension');
      }

      if (file.size >= this.size) {
        this.erreursMessages.push('Le poids de l\'image doit etre inférieur à ' + this.size + 'octets');
      }

      if (dimension.largeur >= this.width) {
          this.erreursMessages.push('la largeur de l\'image doit etre inférieur à ' + this.width + 'px');
      }

      if (dimension.hauteur >= this.heigth) {
        this.erreursMessages.push('la hauteur de l\'image doit etre inférieur à ' + this.heigth + 'px');
      }
    }
  );
}
    getImageDimension(adresse: string) {
      const img = new Image();
      img.src = adresse;
      return new Promise<any>((resolve, reject) => {
        img.onload = () => {
          const width = img.naturalWidth;
          const heigth = img.naturalHeight;
          resolve(
            {largeur: width,
            hauteur: heigth}
            );
        };
      });
    }

    onDeleteDrapImage() {
      this.sharedService.deleteFile(this.sharedService.fileUrl);
      this.sharedService.isImageUploadShown = true;
      this.sharedService.fileUrl = null;
      this.fileUploaded = false;
    }

    change(e) {
      e.preventDefault();
      e.target.style.border = '5px dotted black';
    }

    resetChange(e) {
      e.preventDefault();
      e.target.style.border = '5px dotted #ccc';
    }

    ngOnDestroy(): void {
      this.sharedService.progressValue = 0;
      this.sharedService.currentExercice = null;
      this.sharedService.currentUser = null;
      this.sharedService.currentAliment = null;
      this.sharedService.currentTrophee = null;
    }
}
