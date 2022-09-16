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

  private ajoutOuSupprimeDesJoursDuneDate(jour : number, date : Date){

    var finDeSemaine = new Date()
    finDeSemaine.setDate(date.getDate() + jour)

    return finDeSemaine

  }

  async getDateDebutEtFinDeSemaine(dateRecherche : Date){

    var jourDeLaSemaine = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");

    var periode = {
      dateDebut : new Date(),
      dateFin : new Date(),
      dateRecherche : dateRecherche
    }

    switch(jourDeLaSemaine[dateRecherche.getDay()]){
      case 'Lundi':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(0,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(6,dateRecherche)
        break;
      case 'Mardi':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(-1,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(5,dateRecherche)
        break;
      case 'Mercredi':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(-2,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(4,dateRecherche)
        break;
      case 'Jeudi':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(-3,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(3,dateRecherche)
        break;
      case 'Vendredi':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(-4,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(2,dateRecherche)
        break;
      case 'Samedi':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(-5,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(1,dateRecherche)
        break;
      case 'Dimanche':
        periode.dateDebut = this.ajoutOuSupprimeDesJoursDuneDate(-6,dateRecherche)
        periode.dateFin = this.ajoutOuSupprimeDesJoursDuneDate(0,dateRecherche)
        break;
    }

    return periode
  }

  public parseDateDDmmYYYY(date : Date){
    // JOUR
    var jourTmp = date.getDate();
    var jour = jourTmp.toString()
    if(jourTmp < 10){
      jour = '0' + jour;
    }
    
    // MOIS
    var moisTmp = date.getMonth() + 1;
    var mois = moisTmp.toString()
    
    if(moisTmp < 10){
      mois = '0' + mois;
    }
    
    // DATE COMPLETE
    var dateComplete = jour + "/" + mois+ "/" + date.getFullYear();

    return dateComplete;
  }

  public convertSecondToTime(seconds){
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);
    return result;
  }

}
