import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-slip-take',
  templateUrl: './slip-take.page.html',
  styleUrls: ['./slip-take.page.scss'],
})
export class SlipTakePage implements OnInit {
  uploadForm: FormGroup;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.uploadForm = this.fb.group({
      vdStation: ['', Validators.required],
    });
  }

  ngOnInit() {}

  

  async takePhoto() {
    if (this.uploadForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please enter a valid VD Station.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

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

      const loading = await this.loadingController.create({
        message: 'Uploading...',
      });
      await loading.present();

      const blob = this.dataURLtoBlob(image.dataUrl);
      const filePath = `images/${new Date().getTime()}.jpg`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, blob);

      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            await this.saveToFirestore(downloadURL);
            await loading.dismiss();
          })
        )
        .subscribe();
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

  async saveToFirestore(imageUrl: string) {
    const vdStation = this.uploadForm.get('vdStation')?.value;
    if (!vdStation) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'VD Station is required.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const id = this.firestore.createId();
    await this.firestore.collection('vdCollection').doc(id).set({
      vdStation: vdStation,
      imageUrl: imageUrl,
      createdAt: new Date(),
    });

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Image and VD Station saved successfully.',
      buttons: ['OK'],
    });
    await alert.present();

    // Reset the form
    this.uploadForm.reset();
  }
}