import { Injectable } from '@angular/core';
import { Pathologie } from './pathologie';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategoriesService } from '../categories/categories.service';
import { Categorie } from '../categories/categorie';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { MaterielsService } from 'src/app/materiels/materiels.service';

@Injectable({
  providedIn: 'root'
})
export class PathologiesService {

  pathologies: Pathologie[];
  pathologieSubject = new Subject<any[]>();

  pathologiesPointFaible: Pathologie[];
  pathologiesPointFaibleSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private categoriesService: CategoriesService,
              private exercicesService: ExercicesService,
              private materielsService: MaterielsService) { }

  createPathologie(pathologie: Pathologie): void {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('pathologies').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('pathologies').doc(currentid);
    let data = Object.assign({}, pathologie);
    data = Object.assign(pathologie, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      pathologie.exercicesCategorie.forEach(item => {
        item.pathologieids.push(currentid);
        this.categoriesService.newUpdateVersion(item, 'pathologieids', item.pathologieids, 'exe_cat');
      });
      pathologie.materielsCategorie.forEach(item => {
        item.pathologieids.push(currentid);
        this.categoriesService.newUpdateVersion(item, 'pathologieids', item.pathologieids, 'mat_cat');
      });
            }).catch((error) => { console.error('Error creating document: ', error); });
}

getAllPathologies(): void {
  this.firestore.collection('pathologies', ref => ref.where('type', '==', 'pathologie'))
              .snapshotChanges().subscribe( data => {
   this.pathologies = data.map( e => {
    const anotherData = e.payload.doc.data() as Pathologie;
    return  {
      ...anotherData
    } as Pathologie;
  });
   this.emitPathologieSubject();
});
}

emitPathologieSubject() {
  this.pathologieSubject.next(this.pathologies.slice());
}

getAllPathologiesPointFaible(): void {
  this.firestore.collection('pathologies')
              .snapshotChanges().subscribe( data => {
   this.pathologiesPointFaible = data.map( e => {
    const anotherData = e.payload.doc.data() as Pathologie;
    return  {
      ...anotherData
    } as Pathologie;
  });
   this.emitPathologiesPointFaibleSubject();
});
}

emitPathologiesPointFaibleSubject() {
  this.pathologiesPointFaibleSubject.next(this.pathologiesPointFaible.slice());
}

getSinglePathologie(id: string) {
  return new Promise<Pathologie>((resolve, reject) => {
  const museums = this.firestore.firestore.collection('pathologies').where('id', '==', id);
  museums.get().then((querySnapshot) =>  {
    querySnapshot.forEach((doc) => {
      resolve(
        {id: doc.id,
          ...doc.data()} as Pathologie
        );
    });
  });
});
}

deletePathologie(item: Pathologie) {
  if (item.exercicesCategorie) {
      item.exercicesCategorie.forEach(element => {
      const data = element.pathologieids;
      const index = data.indexOf(item.id);
      data.splice(index, 1);
      this.categoriesService.newUpdateVersion(element, 'pathologieids', data, 'exe_cat');
    });
  }

  if (item.materielsCategorie) {
      item.materielsCategorie.forEach(element => {
      const data = element.pathologieids;
      const index = data.indexOf(item.id);
      data.splice(index, 1);
      this.categoriesService.newUpdateVersion(element, 'pathologieids', data, 'mat_cat');
    });
  }
  this.firestore.doc('pathologies/' + item.id).delete();
}

newUpdateVersion(pathologie: Pathologie, attribut: string, value: any) {
  const batch = this.firestore.firestore.batch();
  const nextDocument1 = this.firestore.firestore.collection('pathologies').doc(pathologie.id);
  batch.update(nextDocument1, `${attribut}`, value);
  batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
}


// denormalisation section

addPathologieidOnTable(categorie: Categorie, pathologie: Pathologie, noeud: string) {
  const listePathologieids = categorie.pathologieids;
  listePathologieids.push(pathologie.id);
  this.categoriesService.newUpdateVersion(categorie, 'pathologieids', listePathologieids, noeud);
}

deletePathologieidOnTable(categorie: Categorie, pathologie: Pathologie, noeud: string) {
  const listePathologieids = categorie.pathologieids;
  const index = listePathologieids.indexOf(pathologie.id);
  if (index >= 0) {
    listePathologieids.splice(index, 1);
  }
  this.categoriesService.newUpdateVersion(categorie, 'pathologieids', listePathologieids, noeud);
}

deleteCategorie(categorie: Categorie, noeud: string) {

  const listePathologies = categorie.pathologieids;
  listePathologies.forEach( currentPathologieid => {
    this.getSinglePathologie(currentPathologieid).then(currentPathologie => {
      const listeCategorie = noeud === 'exe_cat' ? currentPathologie.exercicesCategorie :
      currentPathologie.materielsCategorie;
      const index = listeCategorie.findIndex(it => it.id === categorie.id);
      if (index >= 0 ) {
        listeCategorie.splice(index, 1);
      }
      noeud === 'exe_cat' ? this.newUpdateVersion(currentPathologie, 'exercicesCategorie', listeCategorie) :
      this.newUpdateVersion(currentPathologie, 'materielsCategorie', listeCategorie);
    });
  });

  if (noeud === 'exe_cat') {
    categorie.exeids.forEach(currentExerciceid => {
      this.exercicesService.getSingleExercice(currentExerciceid).then(currentExercice => {
        const listeCategorie = currentExercice.categories;
        const index = listeCategorie.findIndex(it => it.id  === categorie.id);
        if (index >= 0) {
          listeCategorie.splice(index, 1);
        }
        this.exercicesService.newUpdateVersion(currentExercice, 'categories', listeCategorie);
      });
    });
  } else {
    categorie.matids.forEach(currentMaterielid => {
      this.materielsService.getSingleMateriel(currentMaterielid).then(currentMateriel => {
        const listeCategorie = currentMateriel.categories;
        const index = listeCategorie.findIndex(it => it.id === categorie.id);
        if (index >= 0) {
          listeCategorie.splice(index, 1);
        }
        this.materielsService.newUpdateVersion(currentMateriel, 'categories', listeCategorie);
      });
    });
  }


  this.firestore.collection(noeud).doc(categorie.id).delete();
}
}
