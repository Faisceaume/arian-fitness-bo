import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StripecheckoutService {

  userId: string;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.auth.authState.subscribe(auth => {
      this.userId = auth.uid;
    });
  }

  processPayment(token: any, amount: any, utilisateurid: string) {
    const payment = {
      token: token,
      amount: amount ? amount: null,
      userid: this.userId,
      userkey: utilisateurid,
      statut: "error",
      timestamp: new Date().getTime()
    };

    const batch = this.db.firestore.batch();
    const id = this.db.createId();
    const ref =  this.db.firestore.collection(`payments`).doc(id);
    const ref2 = this.db.firestore.collection('users').doc(utilisateurid).collection('payments').doc(id);
    batch.set(ref, payment);
    batch.set(ref2, payment);
    batch.commit().then(() => console.log("Payement effectué")).catch(err => console.log(err));
  }
}
