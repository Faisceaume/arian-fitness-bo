import { AlimentsService } from './../aliments/aliments.service';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { Exercice } from '../exercices/exercice';
import { ExercicesService } from '../exercices/exercices.service';
import { Aliment } from '../aliments/aliment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  fileUrl: string = null;
  videoUrl: string;

  currentUser: User;
  currentExercice: Exercice;
  currentAliment: Aliment;

  progressValue = 0;
  isUploadingVideo = false;
  isVideoUploadShown = false;
  isImageUploadShown = false;

  constructor(private store: AngularFireStorage,
              private usersService: UsersService,
              private exercicesService: ExercicesService,
              private alimentsService: AlimentsService) { }

    // SECTION IMAGE && VIDEO

    uploadFile(file: File, typeFile?: string) {
      return new Promise<any>((resolve, reject) => {
        let  upload: any;

        if (typeFile) {
              if (this.currentExercice) {
                  upload =  this.store.storage.ref()
                        .child('exercices/videos/' + this.currentExercice.id + '.mp4').put(file);
              }
        } else {
              if (this.currentExercice) {
                  upload =  this.store.storage.ref()
                        .child('exercices/images/' + this.currentExercice.id + '.jpg').put(file);
              } else if (this.currentUser) {
                  upload =  this.store.storage.ref()
                        .child('users/' + this.currentExercice.id + '.jpg').put(file);
              } else if (this.currentAliment) {
                upload =  this.store.storage.ref()
                      .child('aliments/' + this.currentAliment.id + '.jpg').put(file);
            }
        }


        upload.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.progressValue = progress;
              // console.log('Upload is ' + progress + '% done');
            }, (error) => {
              console.log('erreur de chargement... ' + error);
              reject();
            }, () => {
              upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  resolve(downloadURL);
              });
            });
      });
    }

    deleteFile(url: string, typeFile?: string) {
      const storageRef =  this.store.storage.refFromURL(url);
      storageRef.delete().then(
                () => {
                  console.log('fichier supprimé');
                }
              ).catch(
                (error) => {
                  console.log('Erreur de la suppression ' + error);
                }
              );
      if (typeFile) {
        if (this.currentExercice) {
          this.exercicesService.newUpdateVersion(this.currentExercice, 'video', null);
        }
      } else {
          if (this.currentUser) {
            this.usersService.newUpdateVersion(this.currentUser, 'photo', null);
          } else if (this.currentExercice) {
            this.exercicesService.newUpdateVersion(this.currentExercice, 'photo', null);
          } else if (this.currentAliment) {
            this.alimentsService.newUpdateVersion(this.currentAliment, 'image', null);
          }
      }
    }

    setFileUrl(url: string) {
      this.fileUrl = url;
      if (this.currentUser) {
        this.usersService.newUpdateVersion(this.currentUser, 'photo', url);
      } else if (this.currentExercice) {
        this.exercicesService.newUpdateVersion(this.currentExercice, 'photo', url);
      } else if (this.currentAliment) {
        this.alimentsService.newUpdateVersion(this.currentAliment, 'image', url);
      }
    }

    setVideoUrl(url: string) {
      this.videoUrl = url;
      if (this.currentExercice) {
        this.exercicesService.newUpdateVersion(this.currentExercice, 'video', url);
      }
    }
}
