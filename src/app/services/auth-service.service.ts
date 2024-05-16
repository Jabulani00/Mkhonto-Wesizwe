import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Import firebase
import 'firebase/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  user: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth,private auth:AngularFireAuth) {
    this.user = this.afAuth.authState;
  }

  getCurrentUserEmail(): Observable<string | null> {
    return this.user.pipe(
      map(user => user ? user.email : null)
    );
  }
}
