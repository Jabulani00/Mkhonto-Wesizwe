import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  addMunicipality(municipality: any) {
    return this.firestore.collection('municipalities').add(municipality);
  }

  addWard(municipalityId: string, ward: any) {
    return this.firestore.collection(`municipalities/${municipalityId}/wards`).add(ward);
  }


////
  getMunicipalities() {
    // Assuming you have a 'municipalities' collection in Firestore
    return this.firestore.collection('municipalities').valueChanges();
  }

  submitElectionFormData(formData: any) {
    return this.firestore.collection('electionData').add(formData);
  }
}
