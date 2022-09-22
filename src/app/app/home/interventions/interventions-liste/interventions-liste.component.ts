import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { LocalName } from 'src/app/enums/localName';
import { Filtres } from 'src/app/interfaces/Filtres';
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
  filtres : Filtres;  

  constructor(private interventionService : InterventionsService,
              private alertController : AlertController,
              private utilisateurService : UtilisateursService,
              private utility : UtilityService) { }

  ngOnInit() {
    this.refresh();
  }

  private async refresh(){

    // init Filtres
    const filtres = await this.getFiltreFromStorage();
    this.filtres = filtres;

    // Si recherche par par home.ts
    if(this.interventionListeInput !== undefined){
      const intervention = await this.interventionService.getInterventionByUtilisateurAndEtat(
        +this.interventionListeInput[0],
        this.interventionListeInput[1],
      )
      await this.filtre(intervention);
    }
    
    // Si recherche initialise
    if(this.interventionListeInput === undefined){
      const interventions : Array<Interventions> = await this.get();
      await this.filtre(interventions);
    }
  }

  private async filtre(interventions : Array<Interventions>){
    if(this.filtres.Gaffa === undefined){
      this.filtres.Gaffa = true;
    }

    if(this.filtres.Gaffa){
      const response = await interventions.filter(intervention => !intervention.gaffa);
      this.interventions = this.utility.orderByIdDesc(response);
    }

    if(!this.filtres.Gaffa){
      this.interventions = interventions;
    }

    if(this.filtres.Etats.length > 0){
      
      const response : Array<Interventions> = [];
      
      for(let etat of this.filtres.Etats){
        await this.interventions.map(intervention => {
          if(intervention.etat === etat){
            response.push(intervention);
          }
        });
      }

      this.interventions = this.utility.orderByIdDesc(response);
    }

  }

  public async get(){
    return await this.interventionService.get(true);
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
              intervenant : null,
              gaffa : false
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
    const user : Utilisateurs = await this.utility.getUserActif();

    const inputs : Array<AlertInput> = [];
    await utilisateurs.map(utilisateurs => inputs.push({
      type : 'radio',
      label : utilisateurs.libelle,
      value : utilisateurs,
      checked : user.id === utilisateurs.id ? true : false
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
              timer : 0,
              gaffa : interventions.gaffa
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

  public async messageRefreshChrono(intervention : Interventions, slidingItem){
    const alert = await this.alertController.create({
      header: 'Voulez-vous réellement remettre le chrono à 0',
      buttons: [
        {
          text : 'Oui',
          handler : async () => { 
            await this.refreshChrono(intervention,slidingItem);
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

  public async refreshChrono(intervention : Interventions,slidingItem){
    await this.interventionService.refreshChrono(intervention);
    await this.refresh();
    slidingItem.close();
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

  private async getFiltreFromStorage(){
    const filtres : Filtres = await this.utility.getFiltre();
    this.filtres = filtres;
    return filtres;
  }

  public async filtreMessage(){
    const alert = await this.alertController.create({
      header: 'Choisir le type de filtre',
      buttons: [
        {
          text : 'Filtre par ETAT',
          handler : async () => {
            await this.filtreParEtat();
          }
        },
        {
          text : this.filtres.Gaffa ? 'Afficher tout' : 'Masquer les Gaffa',
          handler : async () => {
            this.filtres.Gaffa = !this.filtres.Gaffa;
            await this.utility.setFiltre(this.filtres);
            await this.refresh();
            console.log(this.interventions)
          }
        },
      ],
    });

    await alert.present();
  }

  public async filtreParEtat(){
    const alert = await this.alertController.create({
      header: 'Choisir les etat à conserver',
      inputs : [
        {
          type : 'checkbox',
          label : EtatIntervention.Nouveau,
          value : EtatIntervention.Nouveau,
          checked : this.filtres.Etats.filter(etat => etat === EtatIntervention.Nouveau).length > 0 ? true : false
        },
        {
          type : 'checkbox',
          label : EtatIntervention.EnCours,
          value : EtatIntervention.EnCours,
          checked : this.filtres.Etats.filter(etat => etat === EtatIntervention.EnCours).length > 0 ? true : false
        },
        {
          type : 'checkbox',
          label : EtatIntervention.Termine,
          value : EtatIntervention.Termine,
          checked : this.filtres.Etats.filter(etat => etat === EtatIntervention.Termine).length > 0 ? true : false
        },
      ],
      buttons: [
        {
          text : 'Annuler',
          handler : () => {
          }
        },
        {
          text : 'Valider',
          handler : async (Etats) => {

            this.filtres.Etats = Etats;
            await this.utility.setFiltre(this.filtres);
            await this.refresh();

          }
        },
      ],
    });

    await alert.present();
  }


}
