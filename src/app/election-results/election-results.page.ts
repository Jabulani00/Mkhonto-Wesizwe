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
  docId:any;
  data: any;
  votingStations: any;
  ward: any;

  constructor(private firestore: AngularFirestore,private fb: FormBuilder,private firestoreService:FirestoreService,private auth:AngularFireAuth) {
    this.createForm();
    this.initializeForm();

  }

  ngOnInit() {
   //this.createForm();
    
  
  }

  createForm() {

    this.electionForm = this.fb.group({
      // municipality: ['', Validators.required],
      // ward: ['', Validators.required],
      vdNumber: ['', Validators.required],
      // leader: ['', Validators.required],
      // cellNumber: ['', Validators.required],
      // voterRoll: ['', Validators.required],
      // voterTurnout: ['', Validators.required],
      // spoiltBallots: ['', Validators.required],
      // totalVotes: ['', Validators.required],
      mkVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // mkPercentage: ['', Validators.required],
      ancVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // ancPercentage: ['', Validators.required],
      effVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // effPercentage: ['', Validators.required],
      ifpVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // ifpPercentage: ['', Validators.required],
      nfpVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // nfpPercentage: ['', Validators.required],
      daVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // daPercentage: ['', Validators.required],
      udmVotes: ['', Validators.required, Validators.pattern('^[0-9]*$')],
      // udmPercentage: ['', Validators.required],
      abcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      alVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      aadpVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      actsaVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      araVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      acdpVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      actVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      acmVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      ahcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      aicVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      amcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      apcVotes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }


  async onSubmit() {
    const formData = this.electionForm.value;
    const user = await this.auth.currentUser;
    
    // Check if any form field is empty
    const emptyFields = Object.keys(formData).filter(key => formData[key] === '');
    if (emptyFields.length > 0) {
      // Display an error message or highlight the empty fields
      console.error('Some fields are empty:', emptyFields);
      return; // Prevent form submission
    }
    
  
  if (user) {
    const userEmail = user.email;
    const vdNumber = formData.vdNumber;

    this.firestore.collection('electionData', ref => ref.where('userEmail', '==', userEmail)
    .where('vdNumber', '==', vdNumber))
      .get()
      .toPromise()
      .then((querySnapshot:any) => {
        querySnapshot.forEach((doc:any) => {
          // Display the document ID
          console.log("Document ID:", doc.id);

          // Add the user input to the fetched data
          const updatedDoc = {
            ancVotes: doc.data().ancVotes + this.electionForm.get('ancVotes')?.value,
            daVotes: doc.data().daVotes + this.electionForm.get('daVotes')?.value,
            effVotes: doc.data().effVotes + this.electionForm.get('effVotes')?.value,
            ifpVotes: doc.data().ifpVotes + this.electionForm.get('ifpVotes')?.value,
            mkVotes: doc.data().mkVotes + this.electionForm.get('mkVotes')?.value,
            nfpVotes: doc.data().nfpVotes + this.electionForm.get('nfpVotes')?.value,
            udmVotes: doc.data().udmVotes + this.electionForm.get('udmVotes')?.value,
            spoiltBallots: doc.data().spoiltBallots + this.electionForm.get('spoiltBallots')?.value,
          };
          this.docId= doc.id;
          console.log(updatedDoc)
          // Update the document in Firestore
          this.updateDocument(doc.id, updatedDoc);
        });
      })
      .catch(error => {
        console.error("Error fetching documents: ", error);
      });
  }
  

}




updateDocument(docId: string, updatedDoc: any) {
  // Update the document in Firestore
  this.firestore.collection('electionData').doc(docId).update(updatedDoc)
    .then(() => {
      console.log('Document updated successfully:', docId);
      alert('Document updated successfully:'+ docId);
    })
    .catch((error) => {
      console.error('Error updating document:', error);
    });
}


async getDoc( municipalities:any,ward:any) {


  this.firestore.collection('municipalities').valueChanges().subscribe((doc: any[]) => {
    console.log(doc);
    this.data=doc;
    this.getVotingStationsForMunicipalityAndWard(municipalities,ward);
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

  async initializeForm() {
  const user = await this.auth.currentUser;

  // Check if user is logged in
  if (user) {
    // Query Firestore to retrieve document where email matches the current user's email
    this.firestore.collection('Users').ref
      .where('email', '==', user?.email)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          const data = doc.data();
          // Populate form fields with retrieved data
          this.municipalities = data.municipality || ''; // Assuming these fields exist in the document
          this.ward = data.ward || '';
          // Populate other form fields as needed
          this.getDoc( this.municipalities,this.ward);
        });
      })
      .catch((error: any) => {
        console.error('Error getting documents:', error);
      });
  } else {
    console.error('User is not logged in.'); // Handle case where user is not logged in
  }
}

}
