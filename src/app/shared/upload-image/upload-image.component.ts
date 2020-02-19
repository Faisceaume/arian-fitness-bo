import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  fileIsOK = true;
  fileIsUploading = false;
  fileUploaded = false;
  erreursMessages: string[];

  constructor(public usersService: UsersService) { }

  ngOnInit() {}

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.usersService.uploadFile(file).then(
      (url: string) => {
         this.usersService.setFileUrl(url);
         this.fileIsUploading = false;
         this.fileUploaded = true;
      }
    );
  }

  detectFile(event) {
      const file: File = event.target.files[0];
      this.traitementImage(file);
    }


  handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    this.traitementImage(file);
  }

  traitementImage(file: File) {
  this.getImageDimension(window.URL.createObjectURL(file)).then(
    (dimension: number) => {
     if ( file.size < 90000 && dimension < 800) {
       this.onUploadFile(file);
       this.fileIsOK = true;
      } else {
        this.fileIsOK = false;
      }
     this.erreursMessages = [];
     if (file.size >= 90000) {
        this.erreursMessages.push('Le poids de l\'image doit etre inférieur à 30 000 octets');
      }

     if (dimension >= 800) {
        this.erreursMessages.push('la dimension de l\'image doit etre inférieur à 800px');
      }
    }
  );
}
    getImageDimension(adresse: string) {
      const img = new Image();
      img.src = adresse;
      return new Promise<number>((resolve, reject) => {
        img.onload = () => {
          const width = img.naturalWidth;
          const heigth = img.naturalHeight;
          resolve(width);
        };
      });
    }

    onDeleteDrapImage() {
      this.usersService.deletePhoto(this.usersService.fileUrl);
      this.usersService.fileUrl = null;
    }

}
