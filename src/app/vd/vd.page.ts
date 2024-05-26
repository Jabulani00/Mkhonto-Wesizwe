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
  private selectedMunicipalityId: string | null = null;
  private selectedWardId: string | null = null;

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
          this.restoreSelection();
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
    this.selectedMunicipalityId = municipality.municipality;
    this.selectedWard = null;
    this.selectedWardId = null;
  }

  selectWard(ward: Ward) {
    this.selectedWard = ward;
    this.selectedWardId = ward.ward;
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
      this.firestoreService.updateWard(municipalityId, ward).then(() => {
        this.loadMunicipalities();
      });
    }
  }

  private restoreSelection() {
    if (this.selectedMunicipalityId) {
      this.selectedMunicipality = this.municipalities.find(
        municipality => municipality.municipality === this.selectedMunicipalityId
      ) || null;

      if (this.selectedMunicipality && this.selectedWardId) {
        this.selectedWard = this.selectedMunicipality.wards.find(
          ward => ward.ward === this.selectedWardId
        ) || null;
      }
    }
  }
}
