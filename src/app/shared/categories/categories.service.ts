import { Injectable } from '@angular/core';
import { Categorie } from './categorie';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Materiel } from 'src/app/materiels/materiel';
import { PathologiesService } from '../pathologies/pathologies.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  chipsSelectedForOperation: Categorie[] = [];
  categories: Categorie[];
  categorieSubject = new Subject<any[]>();

  matCatChipsSelected: Categorie[] = [ ];
  exeCatChipsSelected: Categorie[] = [ ];

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  createCategorie(categorie: Categorie, noeud: string): void {
        noeud === 'mat_cat' ? categorie.matids = [] : categorie.exeids = [];
        categorie.pathologieids = [];
        const batch = this.firestore.firestore.batch();
        const currentid = this.firestore.firestore.collection(noeud).doc().id;
        const nextDocument1 = this.firestore.firestore.collection(noeud).doc(currentid);
        let data = Object.assign({}, categorie);
        data = Object.assign(categorie, {id: currentid, timestamp: new Date().getTime()});
        batch.set(nextDocument1, data);
        batch.commit().then(() => {
                }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllCategories(noeud: string) {
    this.firestore.collection(noeud, ref => ref.orderBy('nom'))
                  .snapshotChanges().subscribe( data => {
       this.categories = data.map( e => {
        const anotherData = e.payload.doc.data() as Categorie;
        return  {
          ...anotherData
        } as Categorie;
      });
       this.emitCategorieSubject();
    });
  }

  emitCategorieSubject() {
    this.categorieSubject.next(this.categories.slice());
  }

  getSingleCategorie(id: string, noeud: string) {
    return new Promise<Categorie>((resolve, reject) => {
      const museums = this.firestore.firestore.collection(noeud).where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Categorie
            );
        });
      });
    });
  }

  deleteCategorie(categorie: Categorie, noeud: string) {
    this.firestore.collection(noeud).doc(categorie.id).delete();
  }

  newUpdateVersion(element: Categorie, attribut: string, value: any, noeud: string) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection(noeud).doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }

  setChipsSelectedForOperationValue(elements: Categorie[]) {
    this.chipsSelectedForOperation = elements;
  }



  // Add Materiels Categories and Exercices Categories => Pathologies

  addChipsForMatCatChipsSelected(item: Categorie) {
    this.matCatChipsSelected.push(item);
  }

  addChipsForExeCatChipsSelected(item: Categorie) {
    this.exeCatChipsSelected.push(item);
  }

  removeMatCatChipsSelected(item: Categorie) {
    const index = this.matCatChipsSelected.findIndex(it => it.id === item.id);
    if (index >= 0) {
      this.matCatChipsSelected.splice(index, 1);
    }
  }

  removeExeCatChipsSelected(item: Categorie) {
    const index = this.exeCatChipsSelected.findIndex(it => it.id === item.id);
    if (index >= 0) {
      this.exeCatChipsSelected.splice(index, 1);
    }
  }

  resetChipsSelectedElement() {
    this.matCatChipsSelected = [];
    this.exeCatChipsSelected = [];
  }


  // Denormalisation  =>  exe_cat : exercices  - mat_cat : materiels
  addElementToSubCollection(categorie: Categorie, element: any , noeud: string) {
    const elementRacine = noeud === 'exe_cat' ? 'exercices' : 'materiels';
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection(noeud).doc(categorie.id)
    .collection(elementRacine).doc(element.id);
    batch.set(nextDocument1, element);
    batch.commit().then(() => {
      noeud === 'exe_cat' ? categorie.exeids.push(element.id) : categorie.matids.push(element.id);
      noeud === 'exe_cat' ? this.newUpdateVersion(categorie, 'exeids', categorie.exeids, 'exe_cat') :
      this.newUpdateVersion(categorie, 'matids', categorie.matids, 'mat_cat');
    }).catch((error) => { console.error('Error updating document: ', error); });
  }

  removeElementToSubCollection(categorie: Categorie, element: any , noeud: string) {
    const elementids = noeud === 'exe_cat' ? categorie.exeids : categorie.matids ;
    const index = elementids.indexOf(element.id);
    if (index >= 0) {
      elementids.splice(index, 1);
    }
    noeud === 'exe_cat' ? this.newUpdateVersion(categorie, 'exeids', categorie.exeids, 'exe_cat') :
      this.newUpdateVersion(categorie, 'matids', categorie.matids, 'mat_cat');
    const elementRacine = noeud === 'exe_cat' ? 'exercices' : 'materiels';
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection(noeud).doc(categorie.id)
    .collection(elementRacine).doc(element.id);
    batch.delete(nextDocument1);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updating document: ', error); });
  }

}
