import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Ward } from '../interfaces/ward.interface';
import { Observable } from 'rxjs';
interface MunicipalityData {
  municipality: string;
  wards: Ward[];
}
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  addMunicipality(municipality: MunicipalityData): Promise<void> {
    const municipalityName = municipality.municipality;
    const municipalityRef = this.firestore.collection('municipalities').doc(municipalityName);
    return municipalityRef.set(municipality);
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

  getMun(docID:any){
    return this.firestore.collection('municipalities').doc(docID)
  }

  updateWard(municipalityId: string, ward: Ward): Promise<void> {
    const wardIndex = ward.ward.split(' ').pop(); // Get the ward number
  
    return this.firestore
      .collection('municipalities')
      .doc(municipalityId)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc) {
          if (!doc.exists) {
            // If the document doesn't exist, create a new one with the ward
            return this.firestore.collection('municipalities').doc(municipalityId).set({
              municipality: municipalityId,
              wards: [ward],
            });
          } else {
            // If the document exists, update the wards array
            const data: MunicipalityData | undefined = doc.data() as MunicipalityData | undefined;
            const wards = data?.wards ?? [];
  
            const updatedWards = wards.map((w: Ward) => {
              if (w.ward === ward.ward) {
                return ward;
              }
              return w;
            });
  
            return this.firestore
              .collection('municipalities')
              .doc(municipalityId)
              .update({ wards: updatedWards });
          }
        } else {
          console.error('Error retrieving document');
          return Promise.resolve(); // Return an empty Promise to satisfy the return type
        }
      })
      .catch((error) => {
        console.error('Error updating ward: ', error);
      });
  }

  getMunicipalities() {
    return this.firestore.collection('municipalities').valueChanges();
  }

  submitElectionFormData(formData: any,docId:any) {
    return this.firestore.collection('electionData').doc(docId).set(formData);
  }

  getResults() {
    return this.firestore.collection('electionData').valueChanges();
  }

  getCollectionRef(collectionName: string) {
    return this.firestore.collection(collectionName);
  }
}
