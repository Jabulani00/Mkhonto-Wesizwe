import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { FirestoreService } from '../services/firestore.service';

interface UserData {
  name: string;
  email: string;
  status: string;
  role: string;
  municipality?: string;
  ward?: string;
  leader:string;
  cellNumber:string;
  counterSubmitsCount:number;
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
  cellNumber:any;
  leader:any;

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
    private loadingController: LoadingController
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

  async Register() {
    if (this.name === '') {
      alert("Enter your full name");
      return;
    }

    if (this.email === '') {
      alert("Enter email Address");
      return;
    }

    if (this.password === '') {
      alert("Enter password");
      return;
    }

    if (this.password !== this.confirm_password) {
      console.error('Passwords do not match');
      return;
    }

    const loader = await this.loadingController.create({
      message: '|Registering you...',
      cssClass: 'custom-loader-class'
    });

    await loader.present();

    this.Auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential: any) => {
        if (userCredential.user) {
          const userData: UserData = {
            name: this.name,
            email: this.email,
            status: "pending",
            role: this.selectedRole,
            leader:this.leader,
            cellNumber:this.cellNumber,
            counterSubmitsCount:0,

          };

          if (this.selectedRole === 'GroundForce') {
            userData.municipality = this.selectedMunicipality;
            userData.ward = this.selectedWard;
          } else if (this.selectedRole === 'RegionAdmin') {
            userData.municipality = this.selectedMunicipality;
          }

          this.db.collection('Users').add(userData)
            .then(() => {
              loader.dismiss();
              console.log('User data added successfully');
              this.router.navigate(['/profile']);
            })
            .catch((error: any) => {
              loader.dismiss();
              console.error('Error adding user data:', error);
            });
        } else {
          console.error('User credential is missing');
        }
      })
      .catch((error: any) => {
        console.error('Error creating user:', error);
      });
  }
}