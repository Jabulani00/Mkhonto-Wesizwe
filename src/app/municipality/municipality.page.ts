import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.page.html',
  styleUrls: ['./municipality.page.scss'],
})
export class MunicipalityPage {
  municipalityName: string = '';
  wardName: string = '';
  selectedMunicipalityId: string = '';

  constructor(private firestoreService: FirestoreService) {}

  addMunicipality() {
    const municipality = { name: this.municipalityName };
    this.firestoreService.addMunicipality(municipality).then(docRef => {
      console.log('Municipality added with ID: ', docRef.id);
      this.selectedMunicipalityId = docRef.id;
      this.municipalityName = ''; // Clear input field after adding
    }).catch(error => {
      console.error('Error adding municipality: ', error);
    });
  }

  addWard() {
    if (this.selectedMunicipalityId) {
      const ward = { name: this.wardName };
      this.firestoreService.addWard(this.selectedMunicipalityId, ward).then(docRef => {
        console.log('Ward added with ID: ', docRef.id);
        this.wardName = ''; // Clear input field after adding
      }).catch(error => {
        console.error('Error adding ward: ', error);
      });
    } else {
      console.error('No municipality selected');
    }
  }
}
