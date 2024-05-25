import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, LoadingController } from '@ionic/angular';

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
  count: number = 0;

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private auth: AngularFireAuth,
    private loadingController: LoadingController,
  ) {
    this.createForm();
    this.initializeForm();
  }

  ngOnInit() {
    this.electionForm.get('vdNumber')?.valueChanges.subscribe((vdNumber) => {
      this.updateVoterRoll(vdNumber);
      this.loadCount(vdNumber);
    });
  }

  createForm() {
    this.electionForm = this.fb.group({
      vdNumber: ['', Validators.required],
      voterRoll:['', Validators.required],
      //voterTurnout: ['', Validators.required,Validators.maxLength(180)],
      spoiltBallots: ['', Validators.required,Validators.maxLength(180)],
      totalVotes: ['', Validators.required,Validators.maxLength(180)],
      mkVotes: ['', Validators.required,Validators.maxLength(180)],
      ancVotes: ['', Validators.required,Validators.maxLength(180)],
      effVotes: ['', Validators.required,Validators.maxLength(180)],
      ifpVotes: ['', Validators.required,Validators.maxLength(180)],
      daVotes: [ '', Validators.required,Validators.maxLength(180)],
      actsaVotes: ['', Validators.required,Validators.maxLength(180)],
    });
  }



  async loadCount(vdNumber: string) {
    const user = await this.auth.currentUser;

    if (user) {
      const userEmail = user.email;

      this.firestore
        .collection('electionData', (ref) =>
          ref.where('userEmail', '==', userEmail).where('vdNumber', '==', vdNumber)
        )
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            this.count = doc.data().count;
            this.docId = doc.id;
          } else {
            this.count = 0;
            this.docId = null;
          }
        })
        .catch((error) => {
          console.error("Error fetching documents: ", error);
        });
    }
  }

  async onSubmit() {
    const formData = this.electionForm.value;
    if (this.electionForm.get('vdNumber')?.invalid) {
      alert("Please select a voting station.");
      return;
    }
    if (this.electionForm.get('totalVotes')?.invalid) {
      alert("Please fill in the total Votes value (maximum length: 180 characters).");
      return;
    }
    if (this.electionForm.get('spoiltBallots')?.invalid) {
      alert("Please fill in the Spoilt Ballots value (maximum length: 180 characters).");
      return;
    }
    if (this.electionForm.get('mkVotes')?.invalid) {
      alert("Please fill in the  mk Votes value (maximum length: 180 characters).");
      return;
    }
    if (this.electionForm.get('ancVotes')?.invalid) {
      alert("Please fill in the  anc Votes value (maximum length: 180 characters).");
      return;
    }
    if (this.electionForm.get('effVotes')?.invalid) {
      alert("Please fill in the  eff Votes value (maximum length: 180 characters).");
      return;
    }
    if (this.electionForm.get('ifpVotes')?.invalid) {
      alert("Please fill in the ifp Votes value (maximum length: 180 characters).");
      return;
    }

    if (this.electionForm.get('daVotes')?.invalid) {
      alert("Please fill in the da Votes value (maximum length: 180 characters).");
      return;
    }

    if (this.electionForm.get('actsaVotes')?.invalid) {
      alert("Please fill in the actsa Votes value (maximum length: 180 characters).");
      return;
    }

    const confirmation = await this.presentConfirmationForSubmit();
  
    if (!confirmation) {
       return
    }


    const loader = await this.loadingController.create({
      // message: 'Logging in...',
      cssClass: 'custom-loader-class',
      spinner:"dots"
    });
    await loader.present();
    const user = await this.auth.currentUser;

    if (user) {
      const userEmail = user.email;
      const vdNumber = formData.vdNumber;

      this.firestore
        .collection('electionData', (ref) =>
          ref.where('email', '==', userEmail).where('vdNumber', '==', vdNumber)
        )
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          if (querySnapshot.empty) {
            // If no document is found, display a message indicating that the voter turnout needs to be updated
            loader.dismiss();
            this.presentSuccessAlert("You cannot update ward votes for this voting station because you haven't updated the voter turnout. Please update the voter turnout first.");
          } else {
            // Proceed with updating the document
            querySnapshot.forEach((doc: any) => {
              const updatedDoc = {
                ancVotes: this.electionForm.get('ancVotes')?.value,
                daVotes: this.electionForm.get('daVotes')?.value,
                effVotes: this.electionForm.get('effVotes')?.value,
                ifpVotes: this.electionForm.get('ifpVotes')?.value,
                mkVotes: this.electionForm.get('mkVotes')?.value,
                actsaVotes: this.electionForm.get('actsaVotes')?.value,
                spoiltBallots: this.electionForm.get('spoiltBallots')?.value,
                // voterTurnout:  this.electionForm.get('voterTurnout')?.value,
                count: doc.data().count + 1,
                totalVotes: doc.data().totalVotes + this.electionForm.get('totalVotes')?.value,
              };
              this.docId = doc.id;
              this.updateDocument(doc.id, updatedDoc);
              loader.dismiss();
              this.presentSuccessAlert('Document updated successfully');
              this.count = updatedDoc.count;
            });
          }
        })
        .catch((error) => {
          loader.dismiss();
          console.error("Error fetching documents: ", error);
          this.presentSuccessAlert('Error fetching documents');
        });
    }
  }

  updateDocument(docId: string, updatedDoc: any) {
    this.firestore.collection('electionData').doc(docId).update(updatedDoc)
      .then(() => {
        console.log('Document updated successfully:', docId);
       // alert('Document updated successfully:' + docId);
        this.electionForm.reset();
      })
      .catch((error) => {
        this.presentSuccessAlert('Error updating document');
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

  async presentSuccessAlert(message:any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async presentConfirmationForSubmit() {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmation',
        message: 'Are you sure you want to submit the form?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'my-custom-alert',
            handler: () => {
              console.log('Confirmation canceled');
              resolve(false);
            }
          }, {
            text: 'Confirm',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });
  }
  
}
