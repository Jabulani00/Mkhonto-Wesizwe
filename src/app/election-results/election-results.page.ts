import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-election-results',
  templateUrl: './election-results.page.html',
  styleUrls: ['./election-results.page.scss'],
})
export class ElectionResultsPage implements OnInit {
  electionForm!: FormGroup;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;

  constructor(private fb: FormBuilder,private firestoreService:FirestoreService,private auth:AngularFireAuth) {
  
  }

  ngOnInit() {
    this.createForm();
  
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
      mkPercentage: ['', Validators.required],
      ancVotes: ['', Validators.required],
      ancPercentage: ['', Validators.required],
      effVotes: ['', Validators.required],
      effPercentage: ['', Validators.required],
      ifpVotes: ['', Validators.required],
      ifpPercentage: ['', Validators.required],
      nfpVotes: ['', Validators.required],
      nfpPercentage: ['', Validators.required],
      daVotes: ['', Validators.required],
      daPercentage: ['', Validators.required],
      udmVotes: ['', Validators.required],
      udmPercentage: ['', Validators.required],
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
    
    // Assuming you have a reference to your Firestore collection
    const collectionRef = this.firestoreService.getCollectionRef('electionData');

    const querySnapshot = await collectionRef.ref.where('userEmail', '==', user?.email).get(); // Use ref here
    
    // Iterate over the documents matching the query
    querySnapshot.forEach((doc:any) => {
      // Merge existing data with new data
      const updatedData = { ...doc.data(), ...dataToUpdate };
      // Update the document with the merged data
      collectionRef.doc(doc.id).update(updatedData)
        .then(() => {
          alert("Document updated successfully in Firestore");
          console.log('Document updated successfully in Firestore');
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
