import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router'; // Import Router
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { FirestoreService } from '../services/firestore.service';

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
  selectedMunicipality:any;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;
  ward: string = '';

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




  // async loadMunicipalities() {
  //   this.firestoreService.getMunicipalities().subscribe((municipalities: string[] | unknown[]) => {
  //     if (Array.isArray(municipalities)) {
  //       this.municipalities = municipalities as string[];
  //     } else {
  //       console.error('Invalid type for municipalities');
  //     }
  //   });
  // }

  onRoleChange() {
    if (this.selectedRole === 'GroundAdmin') {
      this.loadMunicipalities();
    }
  }

  // onMunicipalityChange() {
  //   const selectedMunicipalityObject = this.municipalities.find(municipality => municipality === this.selectedMunicipality);
  //   this.selectedMunicipalityWards = selectedMunicipalityObject && typeof selectedMunicipalityObject === 'object' ? selectedMunicipalityObject.wards || [] : [];
  // }



  async Register() {
    if (this.name =='') 
      {
        alert("Enter your full name")
        return;
      }

    if (this.email =='') 
      {
        alert("Enter email Address")
        return;
      }
      if (this.password =='') 
      {
        alert("Enter password")
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
      .then((userCredential: any) => { // Explicitly specify type
        if (userCredential.user) {
          this.db.collection('Users').add(
            {
              name:this.name,
              email: this.email,
              status: "pending",
              role : this.selectedRole,
            }
          )
            .then(() => {
              loader.dismiss();


              console.log('User data added successfully');
              this.router.navigate(['/profile']);
            })
            
            .catch((error: any) => { // Explicitly specify type
              loader.dismiss();

              console.error('Error adding user data:', error);
            });
        } else {
          console.error('User credential is missing');
        }
      })
      .catch((error: any) => { // Explicitly specify type
        console.error('Error creating user:', error);
      });
  }

}
