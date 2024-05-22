import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  imageData: any[] = [];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.fetchImageData();
  }

  fetchImageData() {
    this.firestore.collection('vdCollection').valueChanges().subscribe((data: any[]) => {
      // Format createdAt date
      this.imageData = data.map(item => ({ ...item, createdAt: this.formatDate(item.createdAt) }));
    });
  }

  // Function to format date
  formatDate(date: any) {
    if (!date) return null;
    return new Date(date.seconds * 1000).toLocaleString();
  }
}
