import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-slip-take',
  templateUrl: './slip-take.page.html',
  styleUrls: ['./slip-take.page.scss'],
})
export class SlipTakePage implements OnInit {
  uploadForm!: FormGroup;
  capturedImageUrl: string | undefined;
  municipalities: any[] = [];
  selectedMunicipalityWards: any;
  votingStations: any;
  data: any;
  voterRoll: any;
  ward: any;
  email: any;
  cellNumber: any;
  name: any;
  leader: any;
  municipality: any;

  municipalitySearchText: string = '';
  wardSearchText: string = '';
  filteredMunicipalities: any[] = [];
  filteredWards: any[] = [];
  selectedMunicipality:any;
  selectedWard:any;

  mun:any;
war:any;

  constructor(

    private firestore: AngularFirestore,private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
    this.createForm();
  this.initializeForm();
  this.loadMunicipalities()
  
  }

  

  ngOnInit() {

  }

  createForm() {
    this.uploadForm = this.fb.group({
      vdNumber: ['',Validators.required,,Validators.maxLength(150)],
    });
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!image.dataUrl) {
        throw new Error('No image data found');
      }

      this.capturedImageUrl = image.dataUrl;
    } catch (error) {
      console.error('Error taking photo', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'There was an error taking the photo. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async onSubmit() {
    if (!this.capturedImageUrl) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please take a photo first.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const vdNumber = this.uploadForm.get('vdNumber')?.value;
    if (!vdNumber) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'VD Station is required.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
     


    const confirmation = await this.presentConfirmationForSubmit();
  
    if (!confirmation) {
       return
    }

    
    try {
      const blob = this.dataURLtoBlob(this.capturedImageUrl);
      const filePath = `images/${new Date().getTime()}.jpg`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, blob);

      const loading = await this.loadingController.create({
        message: 'Uploading...',
      });
      await loading.present();

      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            await this.saveToFirestore(vdNumber, downloadURL);
            await loading.dismiss();
          })
        )
        .subscribe();
    } catch (error) {
      console.error('Error uploading image', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'There was an error uploading the image. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  async saveToFirestore(vdStation: string, imageUrl: string) {
    const id = this.firestore.createId();
    await this.firestore.collection('vdCollection').doc(id).set({
      vdStation: vdStation,
      imageUrl: imageUrl,
      createdAt: new Date(),
      email:this.email,
      cellNumber:this.cellNumber,
      ward : this.ward ,
      name : this.name,
      municipalities :this.municipality,
      leader :  this.leader
    });

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Image and VD Station saved successfully.',
      buttons: ['OK'],
    });
    await alert.present();

    // Reset the form and captured image URL
    this.uploadForm.reset();
    this.capturedImageUrl = undefined;
  }


  async getVotingStationsForMunicipalityAndWard(municipalityName: string, wardName: string) {

  if(!this.selectedMunicipality  && !this.selectedWard ){

    const chaniIndex = this.data.findIndex((entry: any) => entry.municipality === this.selectedMunicipality);

    if (chaniIndex !== -1) {
      const chaniMunicipality = this.data[chaniIndex];
      const wardIndex = chaniMunicipality.wards.findIndex((ward: any) => ward.ward === this.selectedWard);

      if (wardIndex !== -1) {
        const ward = await chaniMunicipality.wards[wardIndex];
        this.votingStations = await ward.votingStations;
    

         // Find and log the voterRoll for a voting Station
        

        console.log(`Voting stations for ward ${this.selectedWard} in ${this.selectedMunicipality} municipality:`);
      } else {
        console.log(`Ward ${this.selectedWard} not found in ${this.selectedMunicipality} municipality.`);
        this.votingStations = [];
      }
    } else {
      console.log(`Municipality ${this.selectedMunicipality} not found.`);
      this.votingStations = [];
    }
    return
  }



    const chaniIndex = this.data.findIndex((entry: any) => entry.municipality === municipalityName);

    if (chaniIndex !== -1) {
      const chaniMunicipality = this.data[chaniIndex];
      const wardIndex = chaniMunicipality.wards.findIndex((ward: any) => ward.ward === wardName);

      if (wardIndex !== -1) {
        const ward = await chaniMunicipality.wards[wardIndex];
        this.votingStations = await ward.votingStations;
    

         // Find and log the voterRoll for a voting Station
        

        console.log(`Voting stations for ward ${wardName} in ${municipalityName} municipality:`);
      } else {
        console.log(`Ward ${wardName} not found in ${municipalityName} municipality.`);
        this.votingStations = [];
      }
    } else {
      console.log(`Municipality ${municipalityName} not found.`);
      this.votingStations = [];
    }
  }



   
  async getDoc(municipalities: any, ward: any) {
    this.firestore.collection('municipalities').valueChanges().subscribe((doc: any[]) => {
      this.data = doc;
      this.getVotingStationsForMunicipalityAndWard(municipalities, ward);
    });
  }

  async initializeForm() {
    const user = await this.auth.currentUser;

    if (user) {
      this.firestore.collection('Users').ref
        .where('email', '==', user?.email)
        .get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            this.municipalities = data.municipality || '';
            this.ward = data.ward || '';
            this.email = data.email;
            this.name = data.name;
            this.cellNumber=data.cellNumber,
            this.municipality= data.municipality;
            this.leader = data.leader
           
        
            this.getDoc(this.municipalities, this.ward);
          });
        })
        .catch((error: any) => {
          console.error('Error getting documents:', error);
        });
    } else {
      console.error('User is not logged in.');
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
      //  ward.ward.toLowerCase().includes(searchText);
    );
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
   
    this.uploadForm.patchValue({ vdNumber: selectedMunicipality });


    if (selectedMunicipalityObject) {
      this.selectedMunicipalityWards = selectedMunicipalityObject.wards || [];
      this.filteredWards = [...this.selectedMunicipalityWards];
    } else {
      this.selectedMunicipalityWards = [];
      this.filteredWards = [];
    }
  }


  async presentConfirmationForSubmit() {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmation',
        message: 'Are you sure you want to submit the form?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'my-custom-alert',
            handler: () => {
              console.log('Confirmation canceled');
              resolve(false);
            }
          }, {
            text: 'Confirm',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });
  }
  
}