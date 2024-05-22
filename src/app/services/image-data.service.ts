// services/image-data.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  imageData: { vdStation: string, imageUrl: string }[] = [];

  constructor() { }

  addImageData(vdStation: string, imageUrl: string) {
    this.imageData.push({ vdStation, imageUrl });
  }

  getImageData() {
    return this.imageData;
  }
}
