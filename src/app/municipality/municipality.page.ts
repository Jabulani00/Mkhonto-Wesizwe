import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';

interface Ward {
  ward: string;
}

interface Municipality {
  municipality: string;
  wards: Ward[];
}

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.page.html',
  styleUrls: ['./municipality.page.scss'],
})
export class MunicipalityPage implements OnInit {
  municipalityName: string = '';
  wardName: string = '';
  municipalities: Municipality[] = [];
  selectedMunicipality: Municipality | null = null;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
  
  }



  addMunicipality() {
    const municipality: Municipality = { municipality: this.municipalityName, wards: [] };
    this.municipalities.push(municipality);
   
    this.selectMunicipality(municipality);
  }

  addWard() {
    if (this.selectedMunicipality) {
      const ward: Ward = { ward: this.wardName };
      this.selectedMunicipality.wards.push(ward);
      this.wardName = '';
    } else {
      console.error('No municipality selected');
    }
  }

  selectMunicipality(municipality: Municipality) {
    this.selectedMunicipality = municipality;
  }

  submitAll() {
    this.municipalities.forEach((municipality) => {
      this.firestoreService.addMunicipality(municipality).then(docRef => {
        const municipalityId = docRef.id;
        municipality.wards.forEach((ward: Ward) => {
          this.firestoreService.addWard(municipalityId, ward).catch(error => {
            console.error('Error adding ward: ', error);
          });
        });
      }).catch(error => {
        console.error('Error adding municipality: ', error);
      });
    });

    // Clear the arrays after submission
    this.municipalities = [];

    this.municipalityName = '';
    this.selectedMunicipality = null;
    
  }
}