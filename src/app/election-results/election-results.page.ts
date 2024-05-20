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

  constructor(private firestore: AngularFirestore,private fb: FormBuilder,private firestoreService:FirestoreService,private auth:AngularFireAuth) {
    this.createForm();
    this.getDoc();
  }

  ngOnInit() {
   //this.createForm();
    
  
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
    
    // Construct the data to be updated
    const dataToUpdate = { ...formData };
    
    const collectionRef = this.firestoreService.getCollectionRef('electionData');
alert(user?.email);
  // Query documents where userEmail is equal to the current user's email
  const querySnapshot = await collectionRef.ref.where('userEmail', '==', user?.email).get();

  // If there's no document matching the user's email, create a new one
  if (querySnapshot.empty) {
    // Create a new document with the form data
    collectionRef.add({ ...formData, userEmail: user?.email })
      .then(() => {
        alert("New document created successfully in Firestore");
        console.log('New document created successfully in Firestore');
        // Optionally, display a success message to the user
        // Reset form after successful submission
        alert('New document created successfully in Firestore');
        this.electionForm.reset();
      })
      .catch((error:any) => {
        alert("Error creating new document. Please try again.");
        console.error('Error creating new document:', error);
        // Optionally, display an error message to the user
      });
  } else {
    // There's an existing document, update it
    querySnapshot.forEach((doc:any) => {
      const existingData = doc.data();
      // Update the existing document with the form data
      Object.keys(formData).forEach(key => {
        // Check if the key exists in both form data and existing data
        if (formData.hasOwnProperty(key) && existingData.hasOwnProperty(key)) {
          // Add the value from the form data to the existing value in the database
          existingData[key] += formData[key];
        }
      });
      
      // Update the document with the updated data
      collectionRef.doc(doc.id).update(existingData)
        .then(() => {
          alert("Document updated successfully in Firestore");
          console.log('Document updated successfully in Firestore');
          alert('Document updated successfully in Firestore');
          // Optionally, display a success message to the user
          // Reset form after successful submission
          this.electionForm.reset();
        })
        .catch((error:any) => {
          alert("Error updating document. Please try again.");
          console.error('Error updating document:', error);
          // Optionally, display an error message to the user
        });
    });
  }

}


async getDoc(){
  const user = await this.auth.currentUser;
  if (user) {
    const userEmail = user.email;

    this.firestore.collection('electionData', ref => ref.where('userEmail', '==', userEmail))
      .valueChanges()
      .subscribe((docs: any[]) => {
        // Iterate through each document in the filtered collection
        docs.forEach(doc => {
          // Add the user input to the fetched data
          const updatedDoc = {
            ancVotes: doc.ancVotes + this.electionForm.get('ancVotes')?.value,
            daVotes: doc.daVotes + this.electionForm.get('daVotes')?.value,
            effVotes: doc.effVotes + this.electionForm.get('effVotes')?.value,
            ifpVotes: doc.ifpVotes + this.electionForm.get('ifpVotes')?.value,
            mkVotes: doc.mkVotes + this.electionForm.get('mkVotes')?.value,
            nfpVotes: doc.nfpVotes + this.electionForm.get('nfpVotes')?.value,
            spoiltBallots: doc.spoiltBallots + this.electionForm.get('spoiltBallots')?.value,
          };

          // Update the document in Firestore
     this.updateDocument(doc.id, updatedDoc);
        });
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


}
