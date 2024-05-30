import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  // Default admin credentials
  defaultAdminEmail: string = 'admin@mk.com';
  defaultAdminPassword: string = '@MK1234';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private navController: NavController,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Please enter email and password', 'danger');
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Logging in...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();
    const userCredential = await this.auth.signInWithEmailAndPassword(this.email, this.password);
    try {
      if (this.email === this.defaultAdminEmail && this.password === this.defaultAdminPassword) {
        loader.dismiss();
        this.router.navigate(['/super-admin']);
        return;
      }

      const userQuerySnapshot = await firebase
        .firestore()
        .collection('Users')
        .where('email', '==', this.email)
        .get();

      if (userQuerySnapshot.empty) {
        loader.dismiss();
        this.presentToast('User does not exist', 'danger');
        return;
      }

      const userData = userQuerySnapshot.docs[0].data();

      if (userData['status'] === 'active') {
       // const userCredential = await this.auth.signInWithEmailAndPassword(this.email, this.password);
        loader.dismiss();
        const user = userCredential.user;

        //if( user ){

        switch (userData['role']) {
          case 'RegionAdmin':
            this.router.navigate(['/region']);
            break;
          case 'GroundForce':
            this.router.navigate(['/counter']);
            break;
          case 'SuperAdmin':
            this.router.navigate(['/super-admin']);
            break;
          default:
            this.router.navigate(['/counter']);
            break;
        }
      } else {
        loader.dismiss();
        this.auth.signOut();
        this.presentToast(
          userData['status'] === 'denied'
            ? 'You are not allowed in the system'
            : 'Your account is pending. Please wait for admin approval.',
          userData['status'] === 'pending' ? 'warning' : 'danger'
        );
        if (userData['status'] === 'pending') {
          this.router.navigate(['/profile']);
        }
      }
    } catch (error) {
      loader.dismiss();
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage.includes('wrong-password')) {
            this.auth.signOut();
          this.presentToast('Incorrect password', 'danger');
        } else {
          this.presentToast(errorMessage, 'danger');
        }
      } else {
        this.presentToast('An unexpected error occurred', 'danger');
      }
      
    }
  }
}
