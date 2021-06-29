import { NutritionService } from '../nutrition/nutrition.service';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { Exercice } from '../exercices/exercice';
import { ExercicesService } from '../exercices/exercices.service';
import { Aliment } from '../nutrition/aliment';
import { Trophee } from '../trophees/trophee';
import { TropheesService } from '../trophees/trophees.service';
import { NotificationsService } from '../users/notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  fileUrl: string = null;
  videoUrl: string;

  currentUser: User;
  currentExercice: Exercice;
  currentAliment: Aliment;
  currentTrophee: Trophee;
  currentNotification: any;

  progressValue = 0;
  isUploadingVideo = false;
  isVideoUploadShown = false;
  isImageUploadShown = false;

  constructor(private store: AngularFireStorage,
              private usersService: UsersService,
              private exercicesService: ExercicesService,
              private nutritionService: NutritionService,
              private tropheesService: TropheesService,
              private notificationService: NotificationsService) { }

    // SECTION IMAGE && VIDEO

    uploadFile(file: File, typeFile?: string) {
      return new Promise<any>((resolve, reject) => {
        let  upload: any;

        if (typeFile) {
              if (this.currentExercice) {
                  upload =  this.store.storage.ref()
                        .child('medias/exercices/videos/' + this.currentExercice.id + '.mp4').put(file);
              }
        } else {
              if (this.currentExercice) {
                  upload =  this.store.storage.ref()
                        .child('medias/exercices/images/' + this.currentExercice.id + '.jpg').put(file);
              } else if (this.currentUser) {
                  upload =  this.store.storage.ref()
                        .child('medias/users/' + this.currentUser.id + '.jpg').put(file);
              } else if (this.currentAliment) {
                upload =  this.store.storage.ref()
                      .child('medias/aliments/' + this.currentAliment.id + '.jpg').put(file);
              } else if (this.currentTrophee) {
                upload =  this.store.storage.ref()
                      .child('medias/trophees/' + this.currentTrophee.$id + '.jpg').put(file);
              } else if (this.currentNotification) {
                upload =  this.store.storage.ref()
                      .child('medias/notifications/' + new Date().getTime() + "_" + this.currentNotification.id + '.jpg').put(file);
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

              upload.snapshot.ref.getMetadata().then(async meta => {
                this.exercicesService.newUpdateVersion(this.currentExercice, 'filesize', Math.round((meta.size/1048576)*100)/100)
              })

            });
      });
    }

    deleteFile(url: string, urlThumbnail?: string, typeFile?: string) {
      let storageRef: any = '';
      let storageRefThumbnail: any = '';
      console.log(urlThumbnail, typeFile);
      if(urlThumbnail) {
        try {
          storageRef =  this.store.storage.refFromURL(url);
          storageRefThumbnail =  this.store.storage.refFromURL(urlThumbnail);
        } catch (error) {
  
        }
        if (storageRef !== '' && storageRef !== '') {
          storageRef.delete().then(() => {
              console.log('fichier supprimé');
          }).catch((error) => {
            console.log('Erreur de la suppression ' + error);
          });
          
          storageRefThumbnail.delete().then(() => {
            console.log('fichier thumbnail supprimé');
          }).catch((error: Error) => {
            console.log('Erreur de la suppression thumbnail ' + error.message);
          });
        }
      } else {
        try {
          storageRef =  this.store.storage.refFromURL(url);
        } catch (error) {
        }
        if (storageRef !== '') {
          storageRef.delete().then(() => {
              console.log('fichier supprimé');
          }).catch((error) => {
            console.log('Erreur de la suppression ' + error);
          });
        }
      }

      if (typeFile) {
        if (this.currentExercice) {
          this.exercicesService.newUpdateVersion(this.currentExercice, 'video', null);
          this.exercicesService.newUpdateVersion(this.currentExercice, 'filesize', null)
        }
      } else {
          if (this.currentUser) {
            this.usersService.newUpdateVersion(this.currentUser, 'photo', null);
          } else if (this.currentExercice) {
            this.exercicesService.newUpdateVersion(this.currentExercice, 'photo', null);
            this.exercicesService.newUpdateVersion(this.currentExercice, 'photoThumbnail', null);
          } else if (this.currentAliment) {
            this.nutritionService.newUpdateVersion(this.currentAliment, 'image', null);
          } else if (this.currentTrophee) {
            this.tropheesService.newUpdateVersion(this.currentTrophee, 'image', null);
          } else if (this.currentNotification) {
            this.notificationService.newUpdateVersion(this.currentNotification, 'image', null);
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
        this.nutritionService.newUpdateVersion(this.currentAliment, 'image', url);
      } else if (this.currentTrophee) {
        this.tropheesService.newUpdateVersion(this.currentTrophee, 'image', url);
      } else if (this.currentNotification) {
        this.notificationService.newUpdateVersion(this.currentNotification, 'image', url);
      }
    }

    setVideoUrl(url: string) {
      this.videoUrl = url;
      if (this.currentExercice) {
        this.exercicesService.newUpdateVersion(this.currentExercice, 'video', url);
      }
    }
}
