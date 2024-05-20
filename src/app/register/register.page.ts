import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

interface UserData {
  name: string;
  email: string;
  status: string;
  role: string;
  municipality?: string;
  ward?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name = '';
  email = '';
  password = '';
  confirm_password = '';
  selectedRole = '';
  selectedWard = '';
  selectedMunicipality: any;
  municipalities: any[] = [];
  selectedMunicipalityWards: any[] = [];
  filteredMunicipalities: any[] = [];
  filteredWards: any[] = [];

  municipalitySearchText = '';
  wardSearchText = '';

  constructor(
    private firestoreService: FirestoreService,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.loadMunicipalities();
  }

  ngOnInit() {
    this.filteredMunicipalities = [...this.municipalities];
    this.filteredWards = [...this.selectedMunicipalityWards];
  }

  private loadMunicipalities() {
    this.firestoreService.getMunicipalities().subscribe((municipalities: any[]) => {
      this.municipalities = municipalities;
      this.filteredMunicipalities = [...municipalities];
    });
  }

  onMunicipalityChange(event: any) {
    const selectedMunicipality = event.detail.value;
    const selectedMunicipalityObject = this.municipalities.find(municipality => municipality.municipality === selectedMunicipality);

    if (selectedMunicipalityObject) {
      this.selectedMunicipalityWards = selectedMunicipalityObject.wards || [];
      this.filteredWards = [...this.selectedMunicipalityWards];
    } else {
      this.resetWards();
    }
  }

  onRoleChange() {
    if (this.selectedRole === 'GroundWorker' || this.selectedRole === 'RegionAdmin') {
      this.loadMunicipalities();
    }
  }

  filterMunicipalities(event: any) {
    const searchText = event.detail.value.toLowerCase();
    this.filteredMunicipalities = this.municipalities.filter(municipality =>
      municipality.municipality.toLowerCase().includes(searchText)
    );
  }

  filterWards(event: any) {
    const searchText = event.detail.value.toLowerCase();
    this.filteredWards = this.selectedMunicipalityWards.filter((ward: { ward: string }) =>
      ward.ward.toLowerCase().includes(searchText)
    );
  }

  async Register() {
    if (!this.validateInput()) return;

    const loader = await this.loadingController.create({
      message: 'Registering you...',
      cssClass: 'custom-loader-class'
    });

    await loader.present();

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(this.email, this.password);

      if (userCredential.user) {
        const userData: UserData = {
          name: this.name,
          email: this.email,
          status: 'pending',
          role: this.selectedRole,
          municipality: this.selectedMunicipality,
          ward: this.selectedRole === 'GroundWorker' ? this.selectedWard : undefined
        };

        await this.db.collection('Users').add(userData);
        loader.dismiss();
        console.log('User data added successfully');
        this.router.navigate(['/profile']);
      } else {
        throw new Error('User credential is missing');
      }
    } catch (error) {
      loader.dismiss();
      console.error('Error during registration:', error);
    }
  }

  private validateInput(): boolean {
    if (!this.name) {
      alert("Enter your full name");
      return false;
    }
    if (!this.email) {
      alert("Enter email address");
      return false;
    }
    if (!this.password) {
      alert("Enter password");
      return false;
    }
    if (this.password !== this.confirm_password) {
      alert('Passwords do not match');
      return false;
    }
    return true;
  }

  private resetWards() {
    this.selectedMunicipalityWards = [];
    this.filteredWards = [];
  }
}
