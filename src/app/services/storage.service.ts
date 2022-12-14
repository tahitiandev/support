import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalName } from '../enums/localName';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage : Storage,
              private firebase : FirebaseService) {
    this.setStorage();
   }

  private async setStorage(){
    await this.storage.create();
  }

  public async initLocalName(localName: LocalName, isConnect? : boolean){
    const data = await this.get(localName);
    if(data === null){
      await this.storage.set(localName, []);
      if(isConnect){
        await this.deconnexion();
      }
    }
  }

  public async initLocalNameForObject(localName: LocalName){
    const data = await this.get(localName);
    if(data === null){
      await this.storage.set(
        localName,
        {}
      )
    }
  }

  public async postDatas(localName : LocalName, data : Array<any>){
    await this.storage.set(localName, data);
  }

  public async postData(localName : LocalName, data){
    // Partie localstorage    
    const all = await this.get(localName);
    data.id = await this.generateId(localName);
    data.createdOn = await new Date();
    all.push(data);
    await this.postDatas(localName, all);

    // Partie firebase
    if(window.navigator.onLine){
      await this.firebase.post(
        localName,
        data
      )
    }
  }

  public async get(localName : LocalName, orderDesc? : boolean){
    const response = await this.storage.get(localName);
    if(response === null){
      return response;
    }
    else{
      const result = response.filter(data => data.deletedOn === null);
      if(orderDesc){
        return this.orderByIdDesc(result);
      }else{
        return this.orderById(result);
      }
    }
  }

  private async getIndex(localName : LocalName, data : any){

    const all = await this.get(localName);
    const index = await all.findIndex(all => all.id === data.id);

    return index;
  }

  public async put(localName : LocalName, data){

    // Partie localstorage
    this.putLocalStorageOnly(
      localName,
      data
    )

    // Partie firebase
    await this.firebase.put(
      localName,
      data
    )

  }

  public async putLocalStorageOnly(localName : LocalName, data){

    const all = await this.get(localName);
    const index = await this.getIndex(localName, data);
    data.modifiedOn = await new Date();
    all[index] = data;

    await this.postDatas(localName, all);

  }

  

  public async delete(localName : LocalName, data){
    // Partie localstorage
    const all = await this.get(localName);

    const index = await this.getIndex(localName, data);
    data.deletedOn = await new Date();
    all[index] = data;

    await this.postDatas(localName, all);

    // Partie firebase
    if(window.navigator.onLine){
      await this.firebase.put(
        localName,
        data
      )
    }
  }

  private orderById(data : Array<any>){
    return data.sort((a,b) => {
      let x  = a.id ;
      let y  = b.id;
      if(x < y){
        return -1;
      }else{
        return 1;
      }
      return 0;
    })
  
  }
  private orderByIdDesc(data : Array<any>){
    return data.sort((a,b) => {
      let x  = a.id ;
      let y  = b.id;
      if(x > y){
        return -1;
      }else{
        return 1;
      }
      return 0;
    })
  }

  private async generateId(localName : LocalName){
    const data = await this.get(localName);
    if(data.length === 0){
      return 0
    }
    else{
      const id = data[data.length - 1].id + 1
      return id;
    }
  }

  public async postConnectAutorisationValue(setValue : boolean){
    const connect = await this.get(LocalName.Connect);
    connect.autorisation = setValue;
    this.storage.set(
      LocalName.Connect,
      connect
    );
  }

  public async resetLocalStorage(localName : LocalName){
    await this.postDatas(
      localName,
      []
    );
  }

  public async deconnexion(){
    await this.storage.set(
      LocalName.Connect,
      [
        {
          id : 0,
          autorisation : false,
          utilisateur : null
        }
      ]
    )
  }

  public async connexion(infoConnexion){
    await this.storage.set(
      LocalName.Connect,
      infoConnexion
    )
  }

}
