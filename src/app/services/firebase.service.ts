import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LocalName } from '../enums/localName';
import { Interventions } from '../interfaces/Interventions';
import { Utilisateurs } from '../interfaces/Utilisateurs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore : AngularFirestore,
              private storage : Storage) { }

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
                     if(parseData.deletedOn === null){
                       alldata.push(parseData)
                     }
                   }
                   this.storage.set(collectionName, alldata)
                 })
  }

  public async put(collectionName : LocalName, data : any){

    if(data.firebase === true){
      await this.firestore.collection(collectionName)
                                    .doc(data.documentId)
                                    .update(data)
    }
  }

  public async postAll(){
    const Utilisateurs : Array<Utilisateurs> = await this.storage.get(LocalName.Utilisateurs);
    const Interventions :Array<Interventions> = await this.storage.get(LocalName.Interventions);
    console.log(Interventions)
    
    await this.postAllByLocalName(
      LocalName.Utilisateurs,
      Utilisateurs
    );

    await this.postAllByLocalName(
      LocalName.Interventions,
      Interventions
    );

  }
  
  private async postAllByLocalName(localName : LocalName, datas : Array<any>){
    for(let data of datas){
      if(!data.firebase){
        await this.post(
          localName,
          data
        );
      }
      if(data.firebase && data.modifiedOn !== null){
        await this.put(
          localName,
          data
        );
      }
      if(data.firebase && data.deletedOn !== null){
        await this.put(
          localName,
          data
        );
      }
    }//for
  }

}
