import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-get-doc',
  templateUrl: './get-doc.page.html',
  styleUrls: ['./get-doc.page.scss'],
})
export class GetDocPage implements OnInit {

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    //this.exportToSpreadsheet();
  }

  exportToSpreadsheet() {
    this.firestore.collection('municipalities').valueChanges().subscribe((data: any[]) => {
      // Process the data to extract the necessary fields
      const formattedData: any[] = [];

      data.forEach(municipality => {
        const municipalityName = municipality.municipality;
        const province = municipality.province;

        if (municipality.wards && municipality.wards.length > 0) {
          municipality.wards.forEach((ward:any) => {
            const wardNumber = ward.ward;
            
            if (ward.votingStations && ward.votingStations.length > 0) {
              ward.votingStations.forEach((votingStation:any) => {
                formattedData.push({
                  Municipality: municipalityName,
                  Province: province,
                  Ward: wardNumber,
                  'Voting Station Name': votingStation.name,
                  'Voter Roll': votingStation.voterRoll
                });
              });
            }
          });
        }
      });

      // Convert the processed data to a worksheet and then to a workbook
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Municipalities');
      
      // Write the workbook to a file
      XLSX.writeFile(wb, 'MunicipalitiesData.xlsx');
    });
  }
}


