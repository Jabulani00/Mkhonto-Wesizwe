import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.page.html',
  styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit {
  electionForm!: FormGroup;

  constructor(private fb: FormBuilder,private afs: AngularFirestore) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.electionForm = this.fb.group({
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
    });
  }

  onSubmit() {
    const formData = this.electionForm.value;


     // Check if any form field is empty
  const emptyFields = Object.keys(formData).filter(key => formData[key] === '');
  if (emptyFields.length > 0) {
    // Display an error message or highlight the empty fields
    console.error('Some fields are empty:', emptyFields);
    return; // Prevent form submission
  }
    // Add your collection name where you want to store the data
    this.afs.collection('electionData').add(formData)
      .then(() => {
        alert("Form data submitted successfully to Firestore");
        console.log('Form data submitted successfully to Firestore');
        // Optionally, display a success message to the user
      })
      .catch((error) => {
        alert("Error submitting form try again");
        console.error('Error submitting form:', error);
        // Optionally, display an error message to the user
      });
  }

  private submitElectionData() {
    // Simulate sending data to backend (replace with actual HTTP request)
    console.log('Election Data Submitted:', this.electionForm.value);

    // Reset form after successful submission
    this.electionForm.reset();
  }
}
