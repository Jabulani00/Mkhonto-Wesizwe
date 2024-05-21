import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.page.html',
  styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit {
  electionForm!: FormGroup;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;
  vdNumbers: any[] = [];
votingStations : any;
  

  constructor(private firestore: AngularFirestore,private fb: FormBuilder,private firestoreService:FirestoreService,private auth:AngularFireAuth) {
    this.loadMunicipalities();
    this.initializeForm();
    this.getDoc();
  }

  ngOnInit() {
    this.createForm();
    this.electionForm.valueChanges.subscribe(() => {
      this.getDoc(); // Call getDoc() whenever form values change
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
      mkVotes: ['', Validators.required],
      // mkPercentage: ['', Validators.required],
      ancVotes: ['', Validators.required],
      // ancPercentage: ['', Validators.required],
      effVotes: ['', Validators.required],
      // effPercentage: ['', Validators.required],
      ifpVotes: ['', Validators.required],
      // ifpPercentage: ['', Validators.required],
      nfpVotes: ['', Validators.required],
      // nfpPercentage: ['', Validators.required],
      daVotes: ['', Validators.required],
      // daPercentage: ['', Validators.required],
      udmVotes: ['', Validators.required],
      // udmPercentage: ['', Validators.required],
      timestamp: [new Date()],
      // actsaVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      abcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      alVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      aadpVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      araVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      acdpVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      actVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      acmVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      ahcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      aicVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      amcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // apcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  async initializeForm() {
    const user = await this.auth.currentUser;

    // Query Firestore to retrieve document where email is 'mike'
this.firestore.collection('Users').ref
      .where('email', '==', user?.email)
      .get()
      .then((querySnapshot:any) => {
        querySnapshot.forEach((doc:any) => {
          const data = doc.data();
          // Populate form fields with retrieved data
          this.electionForm.patchValue({
            municipality: data.municipality || '', // Assuming these fields exist in the document
            ward: data.ward || '',
            // Populate other form fields as needed
          });
        });
      })
      .catch((error:any) => {
        console.error('Error getting documents:', error);
      });
  }

  async onSubmit() {
   
    const user = await this.auth.currentUser;
    const formData = { ...this.electionForm.value, userEmail:user?.email };

    //const formData = this.electionForm.value;


     // Check if any form field is empty
  const emptyFields = Object.keys(formData).filter(key => formData[key] === '');
  if (emptyFields.length > 0) {
    // Display an error message or highlight the empty fields
    console.error('Some fields are empty:', emptyFields);
    return; // Prevent form submission
  }
  const docId = this.generateDocId(formData);
    // Add your collection name where you want to store the data
    this.firestoreService.submitElectionFormData(formData,docId)
    .then(() => {
      alert("Form data submitted successfully to Firestore");
      console.log('Form data submitted successfully to Firestore');
      // Optionally, display a success message to the user
      // Reset form after successful submission
      this.electionForm.reset();
    })
    .catch((error) => {
      alert("Error submitting form try again");
      console.error('Error submitting form:', error);
      // Optionally, display an error message to the user
    });
  }

  generateDocId(formData: any): string {
    const municipality = formData.municipality;
    const ward = formData.ward;
    const vdNumber = formData.vdNumber;
    const now = new Date();
    const dateNow = now.toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    return `${municipality}-${ward}-${vdNumber}-${dateNow}`;
  }




  private submitElectionData() {
    // Simulate sending data to backend (replace with actual HTTP request)
    console.log('Election Data Submitted:', this.electionForm.value);

    // Reset form after successful submission
    this.electionForm.reset();
  }


  loadMunicipalities() {

    this.firestoreService.getMunicipalities().subscribe((municipalities: any[]) => {
      this.municipalities = municipalities;
      const municipality = this.electionForm.get('municipality')?.value;
      const ward = this.electionForm.get('ward')?.value;
    });
  }

  onMunicipalityChange(event: any) {
    const selectedMunicipality = event.detail.value;
    this.selectedMunicipalityWards = this.municipalities.find(municipality => municipality.municipality === selectedMunicipality)?.wards || [];
  }
data:any;
  async getDoc() {
    const municipality =await this.electionForm.get('municipality')?.value;
    const ward =await  this.electionForm.get('ward')?.value;
    console.log(municipality);
    console.log( ward)
    this.firestore.collection('municipalities').valueChanges().subscribe((doc: any[]) => {
      console.log(doc);
      this.data=doc;
      this.getVotingStationsForMunicipalityAndWard(municipality, ward);
    });
    
  }

  async getVotingStationsForMunicipalityAndWard(municipalityName: string, wardName: string) {
    // Filter the array of municipalities to find the one with the matching name
    // Find the index of the municipality "CHANI"
const chaniIndex = this.data.findIndex((entry:any) => entry.municipality === municipalityName);

if (chaniIndex !== -1) {
  const chaniMunicipality = this.data[chaniIndex];

  // Find the ward "FFFFFFF" within the municipality "CHANI"
  const wardIndex = chaniMunicipality.wards.findIndex((ward:any) => ward.ward === wardName);

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
}
