import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Import firebase
import 'firebase/compat/firestore'; // Import firestore to access FieldValue

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
        wards: firebase.firestore.FieldValue.arrayUnion(ward) // Use firebase.firestore.FieldValue.arrayUnion to add the ward
      });
  }


////
  getMunicipalities() {
    // Assuming you have a 'municipalities' collection in Firestore
    return this.firestore.collection('municipalities').valueChanges();
  }

  submitElectionFormData(formData: any) {
    return this.firestore.collection('electionData').add(formData);
  }

  getResults() {
    return this.firestore.collection('electionData').valueChanges();
  }

  // updateResults() {
  //   return this.firestore.collection('electionData').doc;
  // }




}
