import { Injectable } from '@angular/core';
import { Pathologie } from './pathologie';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PathologiesService {

  pathologies: Pathologie[];
  pathologieSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore) { }

  createPathologie(pathologie: Pathologie): void {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('pathologies').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('pathologies').doc(currentid);
    let data = Object.assign({}, pathologie);
    data = Object.assign(pathologie, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
            }).catch((error) => { console.error('Error creating document: ', error); });
}

getAllPathologies(): void {
  this.firestore.collection('pathologies')
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
  this.firestore.doc('pathologies/' + item.id).delete();
}

newUpdateVersion(pathologie: Pathologie, attribut: string, value: any) {
  const batch = this.firestore.firestore.batch();
  const nextDocument1 = this.firestore.firestore.collection('pathologies').doc(pathologie.id);
  batch.update(nextDocument1, `${attribut}`, value);
  batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
}

}
