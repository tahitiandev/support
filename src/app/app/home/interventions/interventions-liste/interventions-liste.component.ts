import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { Filtre } from 'src/app/enums/Filtre';
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
  @Input() interventionListeInput;
  etatTermineActif : boolean = false;

  constructor(private interventionService : InterventionsService,
              private alertController : AlertController,
              private utilisateurService : UtilisateursService,
              private utility : UtilityService) { }

  ngOnInit() {
    this.refresh();
  }

  private async refresh(){
    const filtre = await this.utility.getFiltre();
    this.etatTermineActif = filtre.EtatIntervention;
    if(this.interventionListeInput !== undefined){
      const intervention = await this.interventionService.getInterventionByUtilisateurAndEtat(
        +this.interventionListeInput[0],
        this.interventionListeInput[1],
      )
      this.interventions = intervention
    }else{
      const interventions : Array<Interventions> = await this.get();
      if(this.etatTermineActif){
        this.interventions = interventions;
      }else{
        this.interventions = interventions.filter(interventions => interventions.etat !== EtatIntervention.Termine);
      }
    }
    console.log(this.interventions)
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
        value : EtatIntervention.Nouveau,
        checked : true
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

  public async delete(intervention : Interventions,slidingItem){
    await this.interventionService.delete(intervention);
    await this.refresh();
    slidingItem.close();
  }

  public async update(interventions : Interventions,slidingItem){
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
              createdBy : interventions.createdBy,
              createdOn : interventions.createdOn,
              modifiedBy : interventions.modifiedBy,
              modifiedOn : await new Date(),
              deletedBy : interventions.deletedBy,
              deletedOn : interventions.deletedOn,
              firebase : interventions.firebase,
              documentId : interventions.documentId,
              intervenant : null,
              timer : 0
            }

            await this.interventionService.put(intervention);
            await this.refresh();
            slidingItem.close();

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

  public async filtreEtat(){
    const filtre = await this.utility.getFiltre();

    if(filtre.EtatIntervention === undefined){
      filtre.EtatIntervention = false;
      this.utility.setFiltre(filtre);
      this.etatTermineActif = false;
    }
    if(filtre.EtatIntervention){
      filtre.EtatIntervention = false;
      this.utility.setFiltre(filtre);
      this.etatTermineActif = false;
    }else{
      filtre.EtatIntervention = true;
      this.utility.setFiltre(filtre);
      this.etatTermineActif = true;
    }

    this.refresh();
  }

  chronoActif : boolean = false;
  chronoActifInterventionId : number;

  public startChrono(intervention : Interventions, slidingItem){
    this.chronoActif = true;
    this.chronoActifInterventionId = intervention.id;
    this.interventionService.startChrono(intervention);
    slidingItem.close();
  }
  
  public stopChrono(intervention : Interventions,slidingItem){
    this.chronoActif = false;
    this.interventionService.stopChrono(intervention);
    slidingItem.close();
  }

  public convertSecondToTime(seconds){
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);
    return result;
  }

  public async updateEtat(intervention : Interventions,slidingItem){
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
              slidingItem.close();
              this.refresh();
            }

          }
        }
      ],
    });

    await alert.present();
  }

}
