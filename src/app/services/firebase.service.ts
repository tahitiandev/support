import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LocalName } from '../enums/localName';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore : AngularFirestore,
              private storage : StorageService) { }

  public async post(collectionName : LocalName, data : any){
    
    if(!data.firebase){
      data.firebase = true;
      await this.firestore.collection(collectionName).add(data);
      await this.getAll(collectionName);
    }
  }

  public async getAll(collectionName : LocalName){
    this.firestore.collection(collectionName)
                 .snapshotChanges()
                 .subscribe((result) => {
                   var alldata = [];
                   for(let data of result){
                     var parseData : any = data.payload.doc.data();
                     parseData.documentId = data.payload.doc.id;                     
                     alldata.push(parseData)
                   }
                   this.storage.postDatas(collectionName, alldata)
                 })
  }

  public async put(collectionName : LocalName, data : any){

    if(data.firebase === true){
      await this.firestore.collection(collectionName)
                                    .doc(data.documentId)
                                    .update(data)
                data.isModified = false;
    }
  }

}
