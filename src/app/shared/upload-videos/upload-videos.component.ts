import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-upload-videos',
  templateUrl: './upload-videos.component.html',
  styleUrls: ['./upload-videos.component.css']
})
export class UploadVideosComponent implements OnInit, OnDestroy {

  fileIsOK = true;
  fileIsUploading = false;
  fileUploaded = false;
  erreursMessages: string[];

  constructor(public sharedService: SharedService) { }

  ngOnInit() {
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.sharedService.isUploadingVideo = true;
    this.sharedService.uploadFile(file, 'video').then(
      (url: string) => {
         this.sharedService.setVideoUrl(url);
         this.fileIsUploading = false;
         this.fileUploaded = true;
         this.sharedService.isUploadingVideo = false;
      }
    );
  }

  detectFile(event) {
      const file: File = event.target.files[0];
      if (file.type === 'video/mp4') {
        this.traitementVideo(file);
      } else {
        alert('La vidéo doit être de type MP4');
      }
  }


    handleDrop(e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file.type === 'video/mp4') {
        this.traitementVideo(file);
      } else {
        alert('La vidéo doit être de type MP4');
      }
    }

    traitementVideo(file: File) {
      this.erreursMessages = [];

      if (file.size >= 30000000) {
      this.erreursMessages.push('Le poids de la vidéo doit etre inférieur à 30M');
      this.fileIsOK = false;
    } else {
      this.onUploadFile(file);
      this.fileIsOK = true;
    }

}

    onDeleteDrapVideo() {
      this.sharedService.deleteFile(this.sharedService.videoUrl, 'video');
      this.sharedService.videoUrl = null;
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
    }
}
