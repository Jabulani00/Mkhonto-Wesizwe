import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.page.html',
  styleUrls: ['./upload-file.page.scss'],
})
export class UploadFilePage implements OnInit {
  selectedFileName: string = '';
  selectedFile: any;
  name: string = '';
  ContentsOfFile: any = [];
  tableHeaders: string[] = [];

  constructor(private location: Location, private firestore: AngularFirestore,   private loadingController: LoadingController,) { }
  ngOnInit(){
  }
  goBack() {
    this.location.back();
  }
 


  onFileChange(event: any) {
    this.selectedFile = event.target;
    const file = this.selectedFile.files[0];
    this.selectedFileName = file ? file.name : '';
  }

  async documentExists(row: any): Promise<boolean> {
    const querySnapshot = await firstValueFrom(this.firestore.collection('electionData', ref => ref
        .where('userEmail', '==', row.userEmail)
        .where('vdNumber', '==', row.vdNumber)
    ).get());

    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            const userEmail = data.email;
            const vdNumber = data.vdNumber;
            alert(`A document with email: ${userEmail} and vdNumber: ${vdNumber} already exists for the file ${this.selectedFileName}. Skipping upload.`);
            console.log(`Document with email: ${userEmail} and vdNumber: ${vdNumber} already exists.`);
        });
        return true;
    }
    return false;
}



 
async readAndUploadFileContent() {
  if (!this.selectedFileName) {
    alert('Please select a file.');
    return;
  }

  if (!this.selectedFile.files || this.selectedFile.files.length === 0) {
    alert("No file selected.");
    return;
  }

  const file = this.selectedFile.files[0];
  this.name = file.name;
  const reader = new FileReader();

  reader.onload = async (e) => {
    const data = e.target?.result as string;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    this.ContentsOfFile = XLSX.utils.sheet_to_json(sheet);

    console.log(this.ContentsOfFile);

    try {
      for (const row of this.ContentsOfFile) {
        if (!this.isRowValid(row)) {
          console.error('Invalid row:', row);
          return;  // Stop execution if an invalid row is found
        }
      }

      const loader = await this.loadingController.create({
        cssClass: 'custom-loader-class',
        spinner: "dots"
      });
      loader.present();

      for (const row of this.ContentsOfFile) {
        const exists = await this.documentExists(row);
        if (exists) {
          continue; // Skip uploading this row
        }

        const querySnapshot = await firstValueFrom(this.firestore.collection('municipalities', ref => 
          ref.where('municipality', '==', row.municipality)
            .where('wards', 'array-contains', { ward: row.ward })
        ).get());

        let totalVoterRoll = 0;
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc: any) => {
            const municipalityData = doc.data();
            const ward = municipalityData.wards.find((ward: any) => ward.ward === row.ward);
            if (ward && ward.votingStations) {
              ward.votingStations.forEach((station: any) => {
                totalVoterRoll += station.voterRoll;
              });
            }
          });
          console.log('Total Voter Roll for Ward', row.ward, ':', totalVoterRoll);
        } else {
          console.log('Ward', row.ward, 'not found');
        }

        const docId = this.generateDocId(row);
        await this.firestore.collection('electionData').doc(docId).set(row);
      }

      loader.dismiss();
      this.resetFileInput();
      alert('Data uploaded successfully');
      this.selectedFileName = "";
    } catch (error) {
      console.error('Error uploading data: ', error);
    }
  };
  reader.readAsBinaryString(file);
}

private isRowValid(row: any): boolean {
  const requiredFields = ['municipality', 'ward', 'vdNumber'];
  const numericFields = ['voterRoll', 'voterTurnout', 'effVotes', 'ancVotes', 'mkVotes', 'ifpVotes', 'daVotes', 'actsaVotes'];
  for (const field of requiredFields) {
    if (row[field] === undefined || row[field] === null || row[field] === '') {
      return false;
    }
  }
  for (const field of numericFields) {
    if (row[field] !== undefined && row[field] !== null && isNaN(row[field])) {
      alert(`Invalid value for ${field}: ${row[field]}. Please enter a numeric value.`);
      return false;
    }
  }
  return true;
}

private generateDocId(row: any): string {
  const date = Date.now();
  return `${row.municipality}-${row.ward}-${row.vdNumber}-${date}`;
}

resetFileInput() {
  this.selectedFileName = '';
  this.ContentsOfFile = null;
  this.selectedFile.value = ''; // Clear the file input element
  this.name = ''; // Clear the filename
}

}