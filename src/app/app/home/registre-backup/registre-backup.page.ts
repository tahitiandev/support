import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';
import * as XLSX from 'xlsx';
import { Storage } from '@ionic/storage-angular';
import { FileResponse, RegistreBackup } from 'src/app/interfaces/Registre-backup';
import { LocalName } from 'src/app/enums/localName';

@Component({
  selector: 'app-registre-backup',
  templateUrl: './registre-backup.page.html',
  styleUrls: ['./registre-backup.page.scss'],
})
export class RegistreBackupPage implements OnInit {

  constructor(private utility : UtilityService,
              private storage : Storage) { }

  ngOnInit() {
  }

  exceltoJson = {};
  registreBackup : FileResponse;
  
  onFileChange(event: any) {
    this.exceltoJson = {};
    let headerJson = {};
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    console.log("filename", target.files[0].name);
    this.exceltoJson['filename'] = target.files[0].name;
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      
      for (var i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        this.exceltoJson[`sheet${i + 1}`] = data;
        const headers = this.get_header_row(ws);
        headerJson[`header${i + 1}`] = headers;
        //  console.log("json",headers)
      }
      this.exceltoJson['headers'] = headerJson;

      this.setLocalStorage();
    };
  }

  get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
      // console.log("cell",cell)
      var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
    }
    return headers;
  }

  ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

 private async setLocalStorage(){
  await this.saveXlsOnLocalStorage();
  const reponse = await this.getRegistreBackupFromLocalStorage();
  this.registreBackup = await reponse;
 }

 private async saveXlsOnLocalStorage(){
  // var data : FileResponse = {
  //   filename : this.exceltoJson.filename,
  //   sheet1 : this.exceltoJson.sheet1,
  //   sheet2 : this.exceltoJson.sheet2,
  //   headers : this.exceltoJson.headers
  // }
  const data = this.exceltoJson;
  await this.storage.set(
    LocalName.RegistreBackup,
    data
    )
 }

 private async getRegistreBackupFromLocalStorage(){
  const registreBackup : FileResponse = await this.storage.get(LocalName.RegistreBackup);
  return registreBackup;
 }

}
