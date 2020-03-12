import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { Exercice } from '../exercices/exercice';
import { ExercicesService } from '../exercices/exercices.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  fileUrl: string;

  currentUser: User;
  currentExercice: Exercice;

  constructor(private store: AngularFireStorage,
              private usersService: UsersService,
              private exercicesService: ExercicesService) { }

    // SECTION IMAGE

    uploadFile(file: File) {
      return new Promise<any>((resolve, reject) => {
          const uniqueFileName = Date.now().toString();

          const  upload =  this.store.storage.ref().child('Images/' + uniqueFileName + file.name).put(file);

          upload.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
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

    deletePhoto(url: string) {
      const storageRef =  this.store.storage.refFromURL(url);
      storageRef.delete().then(
                () => {
                  console.log('photo supprimée');
                }
              ).catch(
                (error) => {
                  console.log('Erreur de la suppression ' + error);
                }
              );
      if (this.currentUser) {
        this.usersService.newUpdateVersion(this.currentUser, 'photo', null);
      } else if (this.currentExercice) {
        this.exercicesService.newUpdateVersion(this.currentExercice, 'photo', null);
      }
    }

    setFileUrl(url: string) {
      this.fileUrl = url;
      if (this.currentUser) {
        this.usersService.newUpdateVersion(this.currentUser, 'photo', url);
      } else if (this.currentExercice) {
        this.exercicesService.newUpdateVersion(this.currentExercice, 'photo', url);
      }
    }
}
