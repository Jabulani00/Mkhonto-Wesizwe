import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController , AlertController, LoadingController} from '@ionic/angular';
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
  email: any;

  constructor(
    private loadingController: LoadingController,
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
      mkVotes: [0, Validators.required],
      ancVotes: [0, Validators.required],
      effVotes: [0, Validators.required],
      ifpVotes: [0, Validators.required],
      daVotes: [0, Validators.required],
      actsaVotes: [0, Validators.required],
      timestamp: [new Date()],
      spoiltBallots:[0, Validators.required],
      totalVotes:[0, Validators.required],
      email: [''] ,
      count:0
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
          this.email=data.email;
          this.electionForm.patchValue({ email: data.email });
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

  // async onSubmit() {
  //   const user = await this.auth.currentUser;
  //   const formData = { ...this.electionForm.value, userEmail: user?.email };
  
  //   const docId = this.generateDocId(formData);
  
  //   this.firestoreService.submitElectionFormData(formData, docId)
  //     .then(() => {
  //       alert("Form data submitted successfully to Firestore");
  //       console.log('Form data submitted successfully to Firestore');
  //       const vdNumberValue = this.electionForm.get('vdNumber')?.value;
  //       this.electionForm.reset();
  //       this.electionForm.patchValue({ vdNumber: vdNumberValue });
  //       this.initializeForm();
  //     })
  //     .catch((error) => {
  //       alert("Error submitting form try again");
  //       console.error('Error submitting form:', error);
  //     });
  // }
  


  async onSubmit() {

  const vdNumber = this.electionForm.get('vdNumber')?.value;

if (!vdNumber ){
  alert("select your voting station");
  return;
}

if (!vdNumber ){
  alert("fill in the Turnout value");
  return;
}

const loader = await this.loadingController.create({
  // message: 'Logging in...',
  cssClass: 'custom-loader-class',
  spinner:"dots"
});
await loader.present();

    try {
      const user = await this.auth.currentUser;
      if (!user) {
        loader.dismiss();
        console.error('No authenticated user found');
        alert('No authenticated user found');
        this.presentSuccessAlert("danger","No authenticated user found. login ");
        return;
      }
  
      const formData = { ...this.electionForm.value, userEmail: user.email };
      const vdNumber = this.electionForm.get('vdNumber')?.value;
      const newVoterTurnout = Number(this.electionForm.get('voterTurnout')?.value);
  
      // Check if there's a document with email and vdNumber
      const querySnapshot = await this.firestore.collection('electionData').ref
        .where('email', '==', user.email)
        .where('vdNumber', '==', vdNumber)
        .get();
  
      if (!querySnapshot.empty) {
        // If document exists, update voterTurnout field
        querySnapshot.forEach(async (doc: any) => {
          const currentVoterTurnout = doc.data().voterTurnout || 0;
          console.log("TurnOut:",currentVoterTurnout);
          const updatedVoterTurnout = currentVoterTurnout + newVoterTurnout;
  
          try {
            await doc.ref.update({ voterTurnout: updatedVoterTurnout });
            console.log('Document updated with voterTurnout');
           // alert('Document updated with voterTurnout');
            loader.dismiss();
            this.presentSuccessAlert("Success","Document updated with voterTurnout");
           // this.resetFormWithVdNumber();
          } catch (error) {
            console.error('Error updating document:', error);
            loader.dismiss();
          this.presentSuccessAlert("danger","Error updating document");
          }
        });
       } else {
      //  If document doesn't exist, create a new one
        formData.voterTurnout = newVoterTurnout; // Ensure voterTurnout is set in formData
        const docId = this.generateDocId(formData);
        try {
          await this.firestore.collection('electionData').doc(docId).set(formData);
          console.log('New document created with voterTurnout');
         // alert('New document created with voterTurnout');
          loader.dismiss();
          this.presentSuccessAlert("Success","New document created with voterTurnout");
         // this.resetFormWithVdNumber();
        } catch (error) {
          loader.dismiss();
          console.error('Error submitting form:', error);
          this.presentSuccessAlert("danger","Error submitting form try again");
         
        }
      }
    } catch (error) {
      loader.dismiss();
      console.error('Error getting documents:', error);
      this.presentSuccessAlert("dander","Error getting documents");
      //alert('Error getting documents');
    }
  }
  
  resetFormWithVdNumber() {
    const vdNumberValue = this.electionForm.get('vdNumber')?.value;
    this.electionForm.patchValue({ vdNumber: vdNumberValue });
    this.initializeForm();
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

  async presentSuccessAlert(color:any,message:any) {
    const alert = await this.alertController.create({
      header: color,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
