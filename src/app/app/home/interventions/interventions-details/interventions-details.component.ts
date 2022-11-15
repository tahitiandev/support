import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { Interventions } from 'src/app/interfaces/Interventions';
import { Observations } from 'src/app/interfaces/Observations';
import { Utilisateurs } from 'src/app/interfaces/Utilisateurs';
import { InterventionsService } from 'src/app/services/interventions.service';
import { ObservationsService } from 'src/app/services/observations.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Storage } from '@ionic/storage-angular';
import { LocalName } from 'src/app/enums/localName';
@Component({
  selector: 'app-interventions-details',
  templateUrl: './interventions-details.component.html',
  styleUrls: ['./interventions-details.component.scss'],
})
export class InterventionsDetailsComponent implements OnInit {

  @Input() interventionsDetailsInput : Interventions;
  @Output() isInterventionDetailClose = new EventEmitter();
  observations : Array<Observations> = [];

  constructor(private alertController : AlertController,
              private interventionService : InterventionsService,
              private utilisateurService : UtilisateursService,
              private utility : UtilityService,
              private observationService : ObservationsService,
              private storage : Storage) { }

  ngOnInit() {
    this.refresh();
  }

  private async refresh(){
    const observations = await this.getObservations();
    this.observations = observations;
  }

  public async getObservations(){
    const observations : Array<Observations> = await this.observationService.getObservationByInterventionId(this.interventionsDetailsInput.id);
    return observations;
  }

  public closeInterventionsDetails(){
    this.isInterventionDetailClose.emit();
  }

  public async updateEtat(intervention : Interventions){
    const alert = await this.alertController.create({
      header: 'Modifier l\'etat',
      inputs : [
        {
          type : 'radio',
          name : EtatIntervention.Nouveau,
          label : EtatIntervention.Nouveau,
          checked : intervention.etat === EtatIntervention.Nouveau ? true : false,
          value : EtatIntervention.Nouveau
        },
        {
          type : 'radio',
          name : EtatIntervention.EnCours,
          label : EtatIntervention.EnCours,
          checked : intervention.etat === EtatIntervention.EnCours ? true : false,
          value : EtatIntervention.EnCours
        },
        {
          type : 'radio',
          name : EtatIntervention.EnAttente,
          label : EtatIntervention.EnAttente,
          checked : intervention.etat === EtatIntervention.EnAttente ? true : false,
          value : EtatIntervention.EnAttente
        },
        {
          type : 'radio',
          name : EtatIntervention.Termine,
          label : EtatIntervention.Termine,
          checked : intervention.etat === EtatIntervention.Termine ? true : false,
          value : EtatIntervention.Termine
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (EtatIntervention : EtatIntervention) => {

            if(EtatIntervention !== intervention.etat){
              intervention.etat = EtatIntervention
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public async updateUtilisateur(intervention : Interventions){

    const utilisateurs : Array<Utilisateurs> = await this.utilisateurService.get();
    const inputs : Array<AlertInput> = [];

    utilisateurs.map(utilisateurs => {
      inputs.push({
        type : 'radio',
        label : utilisateurs.libelle,
        name : utilisateurs.libelle,
        value : utilisateurs
      })
    })

    const alert = await this.alertController.create({
      header: 'Modifier l\'intervenant',
      inputs : inputs,
      buttons: [
        {
          text : 'Valider',
          handler : async (intervenant : Utilisateurs) => {

            if(intervenant !== intervention.intervenant){
              intervention.intervenant = intervenant
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public async updateDescription(intervention : Interventions){

    const alert = await this.alertController.create({
      header: 'Modifier l\'intervenant',
      inputs : [
        {
          type : 'textarea',
          name : 'description',
          value : intervention.description
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response) => {

            console.log(response.description)

            if(response.description !== intervention.description){
              intervention.description = response.description;
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public textarea(texte){
    return this.utility.textareaRetourChariot(texte);
  }

  public async updateObjet(intervention : Interventions){

    const alert = await this.alertController.create({
      header: 'Modifier l\'objet',
      inputs : [
        {
          type : 'textarea',
          name : 'objet',
          value : intervention.objet
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response) => {

            if(response.objet !== intervention.objet){
              intervention.objet = response.objet;
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }


  public async postObservation(intervention : Interventions){

    const alert = await this.alertController.create({
      header: 'Ajouter une observation',
      inputs : [
        {
          type : 'textarea',
          name : 'description'
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response) => {

            const createdBy = await this.storage.get(LocalName.Connect);
            
            const observation : Observations = {
              id : await this.observationService.generateId(intervention.id),
              description : response.description,
              createdBy : createdBy[0].utilisateur.libelle,
              createdOn : await new Date(),
              modifiedBy : null,
              modifiedOn : null,
              deletedBy : null,
              deletedOn : null,
              firebase : null,
              documentId : null,
              interventionId : intervention.id
            };

            await this.observationService.post(observation);
            await this.refresh();

          }
        }
      ],
    });

    await alert.present();
  }

  public toDateTime(secs) {
    const date = this.utility.convertSecondToDate(secs);
    return date;
  }

  
  public async updateGaffaOfFirebase(intervention : Interventions, isGaffa : boolean){

    var checked = true

    if(isGaffa){
      checked = intervention.gaffa
    }
    if(!isGaffa){
      checked = intervention.firebase
    }

    const alert = await this.alertController.create({
      header: 'Ajouter une observation',
      inputs : [
        {
          type : 'radio',
          label : 'Oui',
          value : true,
          checked : checked
        },
        {
          type : 'radio',
          label : 'Non',
          value : false,
          checked : !checked
        }
      ],
      buttons: [
        {
          text : 'Valider',
          
          handler : async (response) => {

            if(isGaffa){
              intervention.gaffa = response;
            }
            
            if(!isGaffa){
              intervention.firebase = response;
              this.utility.popUp('La fonction a été désactivée car elle peut egendrer des erreurs')
            }

            if(isGaffa){ // Condition temporaire pour éviter de update la valeur firebase
              await this.interventionService.put(intervention);
            }
            await this.refresh();

          }
        }
      ],
    });

    await alert.present();
  }

  public convertSecondToTime(seconds){
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);
    return result;
  }

  public async refreshChrono(intervention : Interventions){
    await this.interventionService.refreshChrono(intervention);
    await this.refresh();
  }

  public async messageRefreshChrono(intervention : Interventions,){
    const alert = await this.alertController.create({
      header: 'Voulez-vous réellement remettre le chrono à 0',
      buttons: [
        {
          text : 'Oui',
          handler : async () => { 
            await this.refreshChrono(intervention);
          }
        },
        {
          text : 'Non',
          handler : async () => { 
            await this.utility.popUp('Opération annulée');
          }
        }
      ],
    });

    await alert.present();
  }


}
