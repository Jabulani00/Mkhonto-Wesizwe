import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';


@Component({
  selector: 'app-counter',
  templateUrl: './counter.page.html',
  styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit {
  electionForm!: FormGroup;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;

  constructor(private fb: FormBuilder,private firestoreService:FirestoreService) {
    this.loadMunicipalities();
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
    this.firestoreService.submitElectionFormData(formData)
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

  private submitElectionData() {
    // Simulate sending data to backend (replace with actual HTTP request)
    console.log('Election Data Submitted:', this.electionForm.value);

    // Reset form after successful submission
    this.electionForm.reset();
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
  
  
}
