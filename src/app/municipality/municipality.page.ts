import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';
import { Ward } from '../interfaces/ward.interface'; // Import the Ward interface

interface Municipality {
  municipality: string;
  wards: Ward[];
  province: string; // Add province field
}

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.page.html',
  styleUrls: ['./municipality.page.scss'],
})
export class MunicipalityPage implements OnInit {
  municipalityName: string = '';
  wardName: string = '';
  selectedProvince: string = ''; // Add a field for the selected province
  municipalities: Municipality[] = [];
  selectedMunicipality: Municipality | null = null;

  provinces: string[] = ['Eastern Cape', 'Free State', 'Gauteng','KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North-West', 'Western Cape']; // Example provinces

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {}

  addMunicipality() {
    const municipality: Municipality = { municipality: this.municipalityName, wards: [], province: this.selectedProvince };
    this.municipalities.push(municipality);
    this.selectMunicipality(municipality);
  }

  addWard() {
    if (this.selectedMunicipality) {
      const ward: Ward = { ward: this.wardName, votingStations: [] }; // Add an empty array for votingStations
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
      this.firestoreService.addMunicipality(municipality).then(() => {
        // No document reference to extract ID from
        const municipalityId = municipality.municipality; // Use the municipality name as the ID
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
    this.selectedProvince = '';
  }
}
