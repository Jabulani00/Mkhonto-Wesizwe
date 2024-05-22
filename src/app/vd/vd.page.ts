import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Ward, VotingStation } from '../interfaces/ward.interface';

interface Municipality {
  municipality: string;
  wards: Ward[];
}

@Component({
  selector: 'app-vd',
  templateUrl: './vd.page.html',
  styleUrls: ['./vd.page.scss'],
})
export class VdPage implements OnInit {
  municipalities: Municipality[] = [];
  selectedMunicipality: Municipality | null = null;
  selectedWard: Ward | null = null;
  votingStationName: string = '';
  votingStationRoll: number | null = null;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.loadMunicipalities();
  }

  loadMunicipalities() {
    this.firestoreService.getMunicipalities().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.municipalities = data.map((item: any) => ({
            municipality: item.municipality,
            wards: item.wards || []
          }));
        } else {
          console.error('Invalid data format received:', data);
        }
      },
      error: (error: any) => {
        console.error('Error loading municipalities:', error);
      }
    });
  }
  

  selectMunicipality(municipality: Municipality) {
    this.selectedMunicipality = municipality;
    this.selectedWard = null;
  }

  selectWard(ward: Ward) {
    this.selectedWard = ward;
  }

  addVotingStation() {
    if (this.selectedWard && this.votingStationName.trim() && this.votingStationRoll !== null) {
      const newVotingStation: VotingStation = {
        name: this.votingStationName.trim(),
        voterRoll: this.votingStationRoll,
      };

      this.selectedWard.votingStations = [...this.selectedWard.votingStations, newVotingStation];
      this.votingStationName = '';
      this.votingStationRoll = null;
      this.updateWardInFirestore(this.selectedWard);
    }
  }

  updateWardInFirestore(ward: Ward) {
    if (this.selectedMunicipality) {
      const municipalityId = this.selectedMunicipality.municipality;
      this.firestoreService.updateWard(municipalityId, ward);
    }
  }
}
