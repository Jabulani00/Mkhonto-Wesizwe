import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

interface Ward {
  name: string;
}

interface Municipality {
  name: string;
  wards: Ward[];
}

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.page.html',
  styleUrls: ['./municipality.page.scss'],
})
export class MunicipalityPage {
  municipalityName: string = '';
  wardName: string = '';
  selectedMunicipalityIndex: number | null = null;

  municipalities: Municipality[] = [];

  constructor(private firestoreService: FirestoreService) {}

  addMunicipality() {
    const municipality: Municipality = { name: this.municipalityName, wards: [] };
    this.municipalities.push(municipality);
    this.selectedMunicipalityIndex = this.municipalities.length - 1;
    this.municipalityName = ''; // Clear input field after adding
  }

  addWard() {
    if (this.selectedMunicipalityIndex !== null) {
      const ward: Ward = { name: this.wardName };
      this.municipalities[this.selectedMunicipalityIndex].wards.push(ward);
      this.wardName = ''; // Clear input field after adding
    } else {
      console.error('No municipality selected');
    }
  }

  submitAll() {
    this.municipalities.forEach((municipality) => {
      this.firestoreService.addMunicipality({ name: municipality.name }).then(docRef => {
        municipality.wards.forEach((ward: Ward) => {
          this.firestoreService.addWard(docRef.id, ward).then(wardDocRef => {
            console.log('Ward added with ID: ', wardDocRef.id);
          }).catch(error => {
            console.error('Error adding ward: ', error);
          });
        });
      }).catch(error => {
        console.error('Error adding municipality: ', error);
      });
    });

    // Clear the arrays after submission
    this.municipalities = [];
    this.selectedMunicipalityIndex = null;
  }
}
