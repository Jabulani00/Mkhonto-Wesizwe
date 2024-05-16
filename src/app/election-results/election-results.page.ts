import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-election-results',
  templateUrl: './election-results.page.html',
  styleUrls: ['./election-results.page.scss'],
})
export class ElectionResultsPage implements OnInit {
  electionForm: FormGroup;
  results: any; // Assuming you have a model for election results

  constructor(
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService
  ) {
    this.electionForm = this.formBuilder.group({
      ancVotes: ['', Validators.required],
      ancPercentage: ['', Validators.required],
      effVotes: ['', Validators.required],
      effPercentage: ['', Validators.required],
      // Add other form controls for different parties
    });
  }

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.firestoreService.getResults().subscribe((data:any) => {
      this.results = data;
      // Populate form with fetched data
      this.electionForm.patchValue({
        ancVotes: this.results.ancVotes,
        ancPercentage: this.results.ancPercentage,
        effVotes: this.results.effVotes,
        effPercentage: this.results.effPercentage,
        // Patch values for other parties
      });
    });
  }

  onSubmit() {
    if (this.electionForm.valid) {
      // Assuming you have a method in your ElectionService to update results
      // this.firestoreService.updateResults(this.electionForm.value).subscribe((response:any) => {
      //   // Handle response, maybe show a success message
      // }, (error:any) => {
      //   // Handle error, maybe show an error message
      // });
    } else {
      // Form is invalid, show error message or handle accordingly
    }
  }
}
