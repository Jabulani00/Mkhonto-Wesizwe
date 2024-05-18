import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Ward } from '../interfaces/ward.interface';

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
  votingStationNumber: string = '';

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.loadMunicipalities();
  }

  loadMunicipalities() {
    this.firestoreService.getMunicipalities().subscribe((data: any) => {
      this.municipalities = data.map((item: any) => {
        return {
          municipality: item.municipality,
          wards: item.wards || [], // Handle missing wards property
        };
      });
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
    if (this.selectedWard && this.votingStationNumber.trim()) {
      const updatedWard: Ward = {
        ...this.selectedWard,
        votingStations: [...(this.selectedWard.votingStations || []), this.votingStationNumber.trim()], // Handle missing votingStations array
      };

      this.votingStationNumber = '';
      this.updateWardInFirestore(updatedWard);
    }
  }

  updateWardInFirestore(ward: Ward) {
    if (this.selectedMunicipality) {
      const municipalityId = this.selectedMunicipality.municipality;
      this.firestoreService.updateWard(municipalityId, ward);
    }
  }
}