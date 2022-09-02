import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalName } from '../enums/localName';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage : Storage) {
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
        await this.postData(
          LocalName.Connect,
          {
            id : 0,
            autorisation : false
          }
        )
      }
    }
  }

  public async postDatas(localName : LocalName, data : Array<any>){
    await this.storage.set(localName, data);
  }

  public async postData(localName : LocalName, data){
    const all = await this.get(localName);
    data.id = await this.generateId(localName);
    data.createdOn = await new Date();
    all.push(data);
    await this.postDatas(localName, all);
  }

  public async get(localName : LocalName){
    const response = await this.storage.get(localName);
    if(response === null){
      return response;
    }
    else{
      const result = response.filter(data => data.deletedOn === null);
      return this.orderById(result);
    }
  }

  private async getIndex(localName : LocalName, data : any){

    const all = await this.get(localName);
    const index = await all.findIndex(all => all.id === data.id);

    return index;
  }

  public async put(localName : LocalName, data){

    const all = await this.get(localName);

    const index = await this.getIndex(localName, data);
    data.modifiedOn = await new Date();
    all[index] = data;

    await this.postDatas(localName, all);

  }

  public async delete(localName : LocalName, data){
    const all = await this.get(localName);

    const index = await this.getIndex(localName, data);
    data.deletedOn = await new Date();
    all[index] = data;

    await this.postDatas(localName, all);
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

}
