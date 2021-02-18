import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { ExercicesService } from '../exercices/exercices.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {



  constructor(private store: AngularFireStorage,
              private exerciceService: ExercicesService) { }

  ngOnInit() {

    // this.store.storage.ref().child('medias/exercices/videos/').listAll().then(
    //   (res) => {
    //   res.items.forEach((itemRef) => {

    //     itemRef.getDownloadURL().then(url => {
    //       itemRef.getMetadata().then(async meta => {
    //         this.exerciceService.getSingleExerciceByUrl(url).then(exe => {
    //           this.exerciceService.newUpdateVersion(exe, 'filesize', Math.round((meta.size/1048576)*100)/100)
    //         },
    //         () => {
    //           console.log('Pas d\'exercice correspondant')
    //         })
    //       })
    //     })

    //   });
    // }).catch((error) => {

    // });

  }


}
