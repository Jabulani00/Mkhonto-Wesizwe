import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Ward } from '../interfaces/ward.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  addMunicipality(municipality: any) {
    return this.firestore.collection('municipalities').add(municipality);
  }

  addWard(municipalityId: string, ward: any) {
    return this.firestore.collection('municipalities').doc(municipalityId)
      .update({
        wards: firebase.firestore.FieldValue.arrayUnion(ward)
      });
  }

  getWardsForMunicipality(municipalityId: string): Observable<Ward[]> {
    return this.firestore.collection('municipalities').doc(municipalityId)
      .collection<Ward>('wards').valueChanges();
  }

  updateWard(municipalityId: string, ward: Ward): Promise<void> {
    return this.firestore.collection('municipalities').doc(municipalityId)
      .update({
        wards: firebase.firestore.FieldValue.arrayUnion(ward)
      });
  }

  getMunicipalities() {
    return this.firestore.collection('municipalities').valueChanges();
  }

  submitElectionFormData(formData: any) {
    return this.firestore.collection('electionData').add(formData);
  }

  getResults() {
    return this.firestore.collection('electionData').valueChanges();
  }

  getCollectionRef(collectionName: string) {
    return this.firestore.collection(collectionName);
  }
}
