import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

interface UserData {
  name: string;
  email: string;
  status: string;
  role: string;
  municipality?: string;
  ward?: string;
  leader: string;
  cellNumber: string;
  counterSubmitsCount: number;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';
  selectedRole: string = '';
  selectedWard: string = '';
  selectedMunicipality: any;
  municipalities: any[] = [];
  selectedMunicipalityWards: any[] = [];
  cellNumber: any;
  leader: any;

  ward: string = '';

  municipalitySearchText: string = '';
  wardSearchText: string = '';
  filteredMunicipalities: any[] = [];
  filteredWards: any[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loadMunicipalities();
  }

  ngOnInit() {
    this.filteredMunicipalities = [...this.municipalities];
    this.filteredWards = [...this.selectedMunicipalityWards];
  }

  loadMunicipalities() {
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
      this.selectedMunicipalityWards = [];
      this.filteredWards = [];
    }
  }

  onRoleChange() {
    if (this.selectedRole === 'GroundForce') {
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

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async Register() {
    if (!this.name) {
      this.showAlert('Enter your full name');
      return;
    }

    if (!this.email) {
      this.showAlert('Enter email address');
      return;
    }

    if (!this.password) {
      this.showAlert('Enter password');
      return;
    }

    if (this.password !== this.confirm_password) {
      this.showAlert('Passwords do not match');
      return;
    }

    if (!this.selectedRole) {
      this.showAlert('Select a role');
      return;
    }

    if (this.selectedRole === 'GroundForce' && (!this.selectedMunicipality || !this.selectedWard)) {
      this.showAlert('Select both municipality and ward for GroundForce role');
      return;
    }

    if (this.selectedRole === 'RegionAdmin' && !this.selectedMunicipality) {
      this.showAlert('Select a municipality for RegionAdmin role');
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Registering you...',
      cssClass: 'custom-loader-class'
    });

    await loader.present();

    this.Auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential: any) => {
        if (userCredential.user) {
          const userData: UserData = {
            name: this.name,
            email: this.email,
            status: 'pending',
            role: this.selectedRole,
            leader: this.leader,
            cellNumber: this.cellNumber,
            counterSubmitsCount: 0,
          };

          if (this.selectedRole === 'GroundForce') {
            userData.municipality = this.selectedMunicipality;
            userData.ward = this.selectedWard;
          } else if (this.selectedRole === 'RegionAdmin') {
            userData.municipality = this.selectedMunicipality;
          }

          // Create a custom ID by concatenating name and email
          const customId = `${this.name.replace(/\s+/g, '_').toLowerCase()}_${this.email.replace(/[^\w.-]+/g, '_').toLowerCase()}`;

          this.db.collection('Users').doc(customId).set(userData)
            .then(() => {
              loader.dismiss();
              console.log('User data added successfully');
              this.router.navigate(['/profile']);
            })
            .catch((error: any) => {
              loader.dismiss();
              console.error('Error adding user data:', error);
              this.showAlert('Error adding user data. Please try again.');
            });
        } else {
          loader.dismiss();
          console.error('User credential is missing');
          this.showAlert('User credential is missing. Please try again.');
        }
      })
      .catch((error: any) => {
        loader.dismiss();
        console.error('Error creating user:', error);
        this.showAlert('Error creating user: ' + error.message);
      });
  }
}
