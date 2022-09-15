import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { LocalName } from '../enums/localName';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private route : NavController,
              private alertController : AlertController,
              private storage : Storage) { }

  public navigateTo(url : string){
    this.route.navigateRoot(url);
  }

  public async popUp(message : string){
    const alert = await this.alertController.create({
      header: 'Information',
      message: message,
      buttons: [
        {
          text : 'Ok',
          handler :  () => {

          }
        }
      ],
    });

    await alert.present();
  }

  public textareaRetourChariot(texte){
    return texte.replace(/\r?\n/g, ' <br> ');
  }

  public returnInternetConnexion() : boolean{
    return window.navigator.onLine;
  }

  public async getFiltre(){
    return await this.storage.get(
      LocalName.Filtres
    );
  }

  public async setFiltre(filtres){
    await this.storage.set(
      LocalName.Filtres,
      filtres
    )
  }

}
