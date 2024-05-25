import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  imageData: any[] = [];
  filteredImageData: any[] = [];
  municipalities: string[] = [];
  wards: string[] = [];
  filteredWards: string[] = [];
  selectedMunicipality: string = '';
  wardSearchQuery: string = '';
  isModalOpen: boolean = false;
  modalTitle: string = '';
  selectedImageUrl: string = '';

  constructor(private firestore: AngularFirestore, private modalController: ModalController) { }

  ngOnInit() {
    this.fetchImageData();
  }

  fetchImageData() {
    this.firestore.collection('vdCollection').valueChanges().subscribe((data: any[]) => {
      this.imageData = data.map(item => ({ ...item, createdAt: this.formatDate(item.createdAt) }));
      this.filteredImageData = this.imageData;
      this.municipalities = Array.from(new Set(this.imageData.map(item => item.municipalities))).sort();
      this.wards = Array.from(new Set(this.imageData.map(item => item.ward).filter(ward => ward))).sort();
    });
  }

  formatDate(date: any) {
    if (!date) return null;
    return new Date(date.seconds * 1000).toLocaleString();
  }

  filterByMunicipality() {
    this.filterImageData();
  }

  searchWard(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredWards = this.wards.filter(ward => ward && ward.toLowerCase().includes(query));
    this.filterImageData();
  }

  selectWard(ward: string) {
    this.wardSearchQuery = ward;
    this.filteredWards = [];
    this.filterImageData();
  }

  filterImageData() {
    this.filteredImageData = this.imageData.filter(item => {
      return (!this.selectedMunicipality || item.municipalities === this.selectedMunicipality) &&
             (!this.wardSearchQuery || (item.ward && item.ward.toLowerCase().includes(this.wardSearchQuery.toLowerCase())));
    });
  }

  async openImageModal(imageUrl: string, vdStation: string) {
    this.isModalOpen = true;
    this.selectedImageUrl = imageUrl;
    this.modalTitle = vdStation;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
