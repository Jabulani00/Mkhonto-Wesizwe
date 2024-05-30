import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface User {
  email: string;
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
})
export class ValidationPage implements OnInit {
  users!: Observable<User[]>;
  allUsers: User[] = []; // Store the original list of users
  filteredUsers: User[] = [];
  filterName: string = '';
  filterEmail: string = '';
  filterStatus: string = ''; // New filter for status

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.users = this.firestore
      .collection<User>('Users', (ref) =>
        ref.where('role', 'in', ['RegionAdmin', 'SuperAdmin'])
      )
      .valueChanges();

    this.users.subscribe(users => {
      this.allUsers = users;
      this.applyFilters();
    });
  }

  applyFilters() {
    const nameFilter = this.filterName.toLowerCase();
    const emailFilter = this.filterEmail.toLowerCase();
    const statusFilter = this.filterStatus.toLowerCase();

    this.filteredUsers = this.allUsers.filter(user => {
      const matchesName = user.name.toLowerCase().includes(nameFilter);
      const matchesEmail = user.email.toLowerCase().includes(emailFilter);
      const matchesStatus = statusFilter ? user.status.toLowerCase() === statusFilter : true;
      return matchesName && matchesEmail && matchesStatus;
    });
  }

  approveUser(user: User) {
    const usersRef = this.firestore.collection('Users', ref =>
      ref.where('email', '==', user.email)
    );

    usersRef.get().toPromise().then(querySnapshot => {
      if (querySnapshot && !querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const userDocRef = this.firestore.collection('Users').doc(docId);

        userDocRef.update({ status: 'active' })
          .then(() => console.log('User approved successfully'))
          .catch(error => {
            console.error('Error updating user:', error);
          });
      } else {
        console.error('User document with the provided email does not exist');
      }
    }).catch(error => {
      console.error('Error fetching user document:', error);
    });
  }

  declineUser(user: User) {
    const usersRef = this.firestore.collection('Users', ref =>
      ref.where('email', '==', user.email)
    );

    usersRef.get().toPromise().then(querySnapshot => {
      if (querySnapshot && !querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const userDocRef = this.firestore.collection('Users').doc(docId);

        userDocRef.update({ status: 'denied' })
          .then(() => console.log('User declined successfully'))
          .catch(error => {
            console.error('Error updating user:', error);
          });
      } else {
        console.error('User document with the provided email does not exist');
      }
    }).catch(error => {
      console.error('Error fetching user document:', error);
    });
  }
}
