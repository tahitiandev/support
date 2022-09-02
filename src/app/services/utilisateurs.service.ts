import { Injectable } from '@angular/core';
import { LocalName } from '../enums/localName';
import { Utilisateurs } from '../interfaces/Utilisateurs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {

  constructor(private storageService : StorageService) { }

  public async get(){
    const utilisateurs : Array<Utilisateurs> = await this.storageService.get(LocalName.Utilisateurs);
    return utilisateurs;
  }

  public async postUtilisateurs (utilisateurs : Array<Utilisateurs>){
    await this.storageService.postDatas(
      LocalName.Utilisateurs,
      utilisateurs
    );
  }

  public async postUtilisateur(utilisateur : Utilisateurs){
    await this.storageService.postData(
      LocalName.Utilisateurs,
      utilisateur
    )
  }

  public async delete(utilisateur : Utilisateurs){
    await this.storageService.delete(
      LocalName.Utilisateurs,
      utilisateur
    );
  }

  public async put(utilisateur){
    await this.storageService.put(
      LocalName.Utilisateurs,
      utilisateur
    )
  }


}
