import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController , AlertController} from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.page.html',
  styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit {
  electionForm!: FormGroup;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;
  votingStations: any;
  data: any;
  navController: NavController;
  voterRoll: any;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {this.navController = navCtrl;

    this.createForm();
    this.loadMunicipalities();
    this.initializeForm();
    this.electionForm.valueChanges.subscribe(() => this.getDoc());
  }

  ngOnInit() {
    this.electionForm.get('vdNumber')?.valueChanges.subscribe((vdNumber) => {
      this.updateVoterRoll(vdNumber);
    });

  }




  createForm() {
    this.electionForm = this.fb.group({
      municipality: ['', Validators.required],
      ward: ['', Validators.required],
      vdNumber: ['', Validators.required],
      leader: ['', Validators.required],
      cellNumber: ['', Validators.required],
      voterRoll: ['', Validators.required],
      voterTurnout: ['', Validators.required],
      spoiltBallots: ['', Validators.required],
      totalVotes: ['', Validators.required],
      mkVotes: [0, Validators.required],
      ancVotes: [0, Validators.required],
      effVotes: [0, Validators.required],
      ifpVotes: [0, Validators.required],
      daVotes: [0, Validators.required],
      timestamp: [new Date()],
      actsaVotes: [0, Validators.required],
    });
  }
  

  async initializeForm() {
    const user = await this.auth.currentUser;

    this.firestore.collection('Users').ref
      .where('email', '==', user?.email)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          const data = doc.data();
          this.electionForm.patchValue({
            municipality: data.municipality || '',
            ward: data.ward || '',
            cellNumber: data.cellNumber,
            leader:data.leader,
          
          });
        });
      })
      .catch((error: any) => {
        console.error('Error getting documents:', error);
      });
  }

  async onSubmit() {
    const user = await this.auth.currentUser;
    const formData = { ...this.electionForm.value, userEmail: user?.email };
  
    const docId = this.generateDocId(formData);
  
    this.firestoreService.submitElectionFormData(formData, docId)
      .then(() => {
        alert("Form data submitted successfully to Firestore");
        console.log('Form data submitted successfully to Firestore');
        const vdNumberValue = this.electionForm.get('vdNumber')?.value;
        this.electionForm.reset();
        this.electionForm.patchValue({ vdNumber: vdNumberValue });
        this.initializeForm();
      })
      .catch((error) => {
        alert("Error submitting form try again");
        console.error('Error submitting form:', error);
      });
  }
  

  generateDocId(formData: any): string {
    const { municipality, ward, vdNumber } = formData;
    const dateNow = new Date().toISOString().slice(0, 10);
    return `${municipality}-${ward}-${vdNumber}-${dateNow}`;
  }

  loadMunicipalities() {
    this.firestoreService.getMunicipalities().subscribe((municipalities: any[]) => {
      this.municipalities = municipalities;
    });
  }

  onMunicipalityChange(event: any) {
    const selectedMunicipality = event.detail.value;
    this.selectedMunicipalityWards = this.municipalities.find(municipality => municipality.municipality === selectedMunicipality)?.wards || [];
  }

  async getDoc() {
    const municipality = await this.electionForm.get('municipality')?.value;
    const ward = await this.electionForm.get('ward')?.value;

    this.firestore.collection('municipalities').valueChanges().subscribe((municipalities: any[]) => {
      this.data = municipalities;
      this.getVotingStationsForMunicipalityAndWard(municipality, ward);
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
    

         // Find and log the voterRoll for a voting Station
        

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

  


  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to SIGN OUT?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
         cssClass: 'my-custom-alert',
          handler: () => {
            console.log('Confirmation canceled');
          }
        }, {
          text: 'Confirm',
          handler: () => {
           
            
            this.auth.signOut().then(() => {
              this.navController.navigateForward("/login");
              this.presentToast()
        
        
            }).catch((error) => {
            
            });
  
  
  
          }
        }
      ]
    });
    await alert.present();
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    
    });
  
    await toast.present();
  }
}
