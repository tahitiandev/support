import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { Interventions } from 'src/app/interfaces/Interventions';
import { Utilisateurs } from 'src/app/interfaces/Utilisateurs';
import { InterventionsService } from 'src/app/services/interventions.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-interventions-liste',
  templateUrl: './interventions-liste.component.html',
  styleUrls: ['./interventions-liste.component.scss'],
})
export class InterventionsListeComponent implements OnInit {

  interventions : Array<Interventions> = [];
  @Output() interventionOutput = new EventEmitter<Interventions>();

  constructor(private interventionService : InterventionsService,
              private alertController : AlertController,
              private utilisateurService : UtilisateursService,
              private utility : UtilityService) { }

  ngOnInit() {
    this.refresh();
  }

  private async refresh(){
    const interventions = await this.get();
    this.interventions = interventions;
  }

  public async get(){
    return await this.interventionService.get();
  }

  public async post(){
    const alert = await this.alertController.create({
      header: 'Créer une intervention',
      inputs : [
        {
          type : 'text',
          name : 'objet',
          label : 'Objet',
          placeholder : 'Objet'
        },
        {
          type : 'textarea',
          name : 'description',
          label : 'Description',
          placeholder : 'Description'
        },
        
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response : Interventions) => {

            const intervention : Interventions = {
              id : 1,
              objet : response.objet,
              description : response.description,
              etat : EtatIntervention.Nouveau,
              observations : [],
              createdBy : null,
              createdOn : await new Date(),
              modifiedBy : null,
              modifiedOn : null,
              deletedBy : null,
              deletedOn : null,
              firebase : false,
              documentId : null,
              intervenant : null
            }

            await this.postChooseUser(intervention);

          }
        }
      ],
    });

    await alert.present();
  }

  private async postChooseUser(intervention : Interventions){

    const utilisateurs :  Array<Utilisateurs> = await this.utilisateurService.get();

    const inputs : Array<AlertInput> = [];
    await utilisateurs.map(utilisateurs => inputs.push({
      type : 'radio',
      label : utilisateurs.libelle,
      value : utilisateurs
    }))

    const alert = await this.alertController.create({
      header: 'Choisir un intervenant',
      inputs : inputs,
      buttons: [
        {
          text : 'Valider',
          handler : async (utilisateur : Utilisateurs) => {

            intervention.intervenant = utilisateur;
            this.postChooseEtape(intervention);

          }
        }
      ],
    });

    await alert.present();
  }

  private async postChooseEtape(intervention : Interventions){

    const inputs : Array<AlertInput> = [
      {
        type : 'radio',
        label : EtatIntervention.Nouveau,
        value : EtatIntervention.Nouveau
      },
      {
        type : 'radio',
        label : EtatIntervention.EnCours,
        value : EtatIntervention.EnCours
      },
      {
        type : 'radio',
        label : EtatIntervention.Termine,
        value : EtatIntervention.Termine
      },
    ];

    const alert = await this.alertController.create({
      header: 'Choisir un intervenant',
      inputs : inputs,
      buttons: [
        {
          text : 'Valider',
          handler : async (etat : EtatIntervention) => {

            intervention.etat = etat;

            await this.interventionService.postIntervention(intervention);
            await this.refresh();

          }
        }
      ],
    });

    await alert.present();
  }

  public async delete(intervention : Interventions){
    await this.interventionService.delete(intervention);
    await this.refresh();
  }

  public async update(interventions : Interventions){
    const alert = await this.alertController.create({
      header: 'Créer un utilisateur',
      inputs : [
        {
          type : 'text',
          name : 'objet',
          value : interventions.objet,
          placeholder : 'objet'
        },
        {
          type : 'text',
          name : 'description',
          value : interventions.description,
          label : 'description',
          placeholder : 'description'
        },
        
      ],
      message: 'This is an alert!',
      buttons: [
        {
          text : 'Valider',
          handler : async (response : Interventions) => {

            const intervention : Interventions = {
              id : interventions.id,
              objet : response.objet,
              description : response.description,
              etat : interventions.etat,
              observations : interventions.observations,
              createdBy : interventions.createdBy,
              createdOn : interventions.createdOn,
              modifiedBy : interventions.modifiedBy,
              modifiedOn : await new Date(),
              deletedBy : interventions.deletedBy,
              deletedOn : interventions.deletedOn,
              firebase : interventions.firebase,
              documentId : interventions.documentId,
              intervenant : null
            }

            await this.interventionService.put(intervention);
            await this.refresh();

          }
        }
      ],
    });
    
    await alert.present();
  }

  public goToInterventionsDetails(id : number){
    this.utility.navigateTo('interventions-details/' + id)
  }

  public emitIntervention(intervention : Interventions){
    this.interventionOutput.emit(intervention);
  }

}