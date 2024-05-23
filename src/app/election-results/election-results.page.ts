import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-election-results',
  templateUrl: './election-results.page.html',
  styleUrls: ['./election-results.page.scss'],
})
export class ElectionResultsPage implements OnInit {
  electionForm!: FormGroup;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;
  docId: any;
  data: any;
  votingStations: any;
  ward: any;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private auth: AngularFireAuth
  ) {
    this.createForm();
    this.initializeForm();
  }

  ngOnInit() {
    this.electionForm.get('vdNumber')?.valueChanges.subscribe((vdNumber) => {
      this.updateVoterRoll(vdNumber);
    });
  }

  createForm() {
    this.electionForm = this.fb.group({
      vdNumber: [''],
      voterRoll:[''],
      voterTurnout: ['', Validators.required,Validators.maxLength(180)],
      spoiltBallots: ['', Validators.required,Validators.maxLength(180)],
      totalVotes: ['', Validators.required,Validators.maxLength(180)],
      mkVotes: ['', Validators.required,Validators.maxLength(180)],
      ancVotes: ['', Validators.required,Validators.maxLength(180)],
      effVotes: ['', Validators.required,Validators.maxLength(180)],
      ifpVotes: ['', Validators.required,Validators.maxLength(180)],
      daVotes: ['', Validators.required,Validators.maxLength(180)],
      actsaVotes: ['', Validators.required,Validators.maxLength(180)],
    });
  }

  async onSubmit() {
    const formData = this.electionForm.value;
    const user = await this.auth.currentUser;

    if (user) {
      const userEmail = user.email;
      const vdNumber = formData.vdNumber;

      this.firestore
        .collection('electionData', (ref) =>
          ref.where('userEmail', '==', userEmail).where('vdNumber', '==', vdNumber)
        )
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            const updatedDoc = {
              ancVotes: doc.data().ancVotes + this.electionForm.get('ancVotes')?.value,
              daVotes: doc.data().daVotes + this.electionForm.get('daVotes')?.value,
              effVotes: doc.data().effVotes + this.electionForm.get('effVotes')?.value,
              ifpVotes: doc.data().ifpVotes + this.electionForm.get('ifpVotes')?.value,
              mkVotes: doc.data().mkVotes + this.electionForm.get('mkVotes')?.value,
              actsaVotes: doc.data().actsaVotes + this.electionForm.get('actsaVotes')?.value,
              spoiltBallots: doc.data().spoiltBallots + this.electionForm.get('spoiltBallots')?.value,
              voterTurnout: doc.data().voterTurnout + this.electionForm.get('voterTurnout')?.value,
              totalVotes: doc.data().totalVotes + this.electionForm.get('totalVotes')?.value,
            };
            this.docId = doc.id;
            this.updateDocument(doc.id, updatedDoc);
          });
        })
        .catch((error) => {
          console.error("Error fetching documents: ", error);
        });
    }
  }

  updateDocument(docId: string, updatedDoc: any) {
    this.firestore.collection('electionData').doc(docId).update(updatedDoc)
      .then(() => {
        console.log('Document updated successfully:', docId);
        alert('Document updated successfully:' + docId);
        this.electionForm.reset();
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
  }

  async getDoc(municipalities: any, ward: any) {
    this.firestore.collection('municipalities').valueChanges().subscribe((doc: any[]) => {
      this.data = doc;
      this.getVotingStationsForMunicipalityAndWard(municipalities, ward);
    });
  }

  async getVotingStationsForMunicipalityAndWard(municipalityName: string, wardName: string) {
    const chaniIndex = this.data.findIndex((entry: any) => entry.municipality === municipalityName);

    if (chaniIndex !== -1) {
      const chaniMunicipality = this.data[chaniIndex];
      const wardIndex = chaniMunicipality.wards.findIndex((ward: any) => ward.ward === wardName);

      if (wardIndex !== -1) {
        const ward = await chaniMunicipality.wards[wardIndex];
        this.votingStations = await ward.votingStations;
        console.log(`Voting stations for ward ${wardName} in ${municipalityName} municipality:`);
      } else {
        console.log(`Ward ${wardName} not found in ${municipalityName} municipality.`);
        this.votingStations = [];
      }
    } else {
      console.log(`Municipality ${municipalityName} not found.`);
      this.votingStations = [];
    }
  }

  async initializeForm() {
    const user = await this.auth.currentUser;

    if (user) {
      this.firestore.collection('Users').ref
        .where('email', '==', user?.email)
        .get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            this.municipalities = data.municipality || '';
            this.ward = data.ward || '';
            this.getDoc(this.municipalities, this.ward);
          });
        })
        .catch((error: any) => {
          console.error('Error getting documents:', error);
        });
    } else {
      console.error('User is not logged in.');
    }
  }

  updateVoterRoll(vdNumber: string) {
    const selectedStation = this.votingStations?.find((station: any) => station.name === vdNumber);
    if (selectedStation) {
      this.electionForm.patchValue({ voterRoll: selectedStation.voterRoll });
      console.log(`Voter roll for ${vdNumber}: ${selectedStation.voterRoll}`);
    } else {
      this.electionForm.patchValue({ voterRoll: '' });
      console.log(`VD Number ${vdNumber} not found.`);
    }
  }
}
