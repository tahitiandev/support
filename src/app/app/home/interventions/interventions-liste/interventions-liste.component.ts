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
  isPopupFiltresActifs : boolean = false; 
  isPopupFiltreEtatActifs : boolean = false; 

  constructor(private interventionService : InterventionsService,
              private alertController : AlertController,
              private utilisateurService : UtilisateursService,
              private utility : UtilityService) { }

  ngOnInit() {
    this.refresh();
    // this.a()
  }

  private async a(){
    const b = await this.interventionService.get();
    const a = await b.find(s => s.id === 91)
    console.log(a)
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

    
    if(this.filtres.Etats === undefined){
      this.filtres.Etats = [];
      this.filtres.Etats.push(EtatIntervention.Termine)
    }else{
      
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

    await this.utility.setFiltre(this.filtres);

  }

  public convertSecondToDate(date : Date){
    return this.utility.convertSecondToDate(date);
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

            // A REVOIR
            // if(etat === EtatIntervention.EnCours){
            //   const interv = await this.interventionService.getLastIntervention();
            //   this.startChrono(interv);
            //   setTimeout(async() => {
            //     await this.refresh();
            //   }, 2000);
            // }

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
  interventionActif : Interventions;

  public startChrono(intervention : Interventions, slidingItem?){
    this.chronoActif = true;
    this.chronoActifInterventionId = intervention.id;
    this.interventionService.startChrono(intervention);
    this.interventionActif = intervention;
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
          handler : async (etatIntervention : EtatIntervention) => {

            if(etatIntervention !== intervention.etat){
              if(etatIntervention === EtatIntervention.EnAttente){
                intervention.etat = etatIntervention;
                await this.postPlaceholder(intervention, slidingItem);
              }
              if(etatIntervention !== EtatIntervention.EnAttente){
                intervention.etat = etatIntervention;
                await this.interventionService.put(intervention);
                slidingItem.close();
                this.refresh();
              }
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public async postPlaceholder(intervention : Interventions,slidingItem){
    const alert = await this.alertController.create({
      header: 'Souhaitez-vous rajouter un placeholder ?',
      inputs : [
        {
          type : 'text',
          label : EtatIntervention.Nouveau,
          name : 'placeholder'
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (data) => {
                intervention.placeholder = data.placeholder;
                await this.interventionService.put(intervention);
                await this.refresh();
                await slidingItem.close();
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
          }
        },
      ],
    });

    await alert.present();
  }

  public async filtreGaffa(){
    this.filtres.Gaffa = !this.filtres.Gaffa;
    await this.utility.setFiltre(this.filtres);
    await this.refresh();
    this.isPopupFiltresActifs = false;
  }

  public togglePopupFiltres(){
    this.isPopupFiltresActifs = !this.isPopupFiltresActifs;
  }
  public togglePopupFiltreEtat(){
    this.isPopupFiltresActifs = false;
    this.isPopupFiltreEtatActifs = !this.isPopupFiltreEtatActifs;
  }

  public closePopUpFiltreEtat(){
    this.isPopupFiltreEtatActifs = !this.isPopupFiltreEtatActifs;
  }

  public async filtreParEtat(){
    this.isPopupFiltresActifs = false;
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
          label : EtatIntervention.EnAttente,
          value : EtatIntervention.EnAttente,
          checked : this.filtres.Etats.filter(etat => etat === EtatIntervention.EnAttente).length > 0 ? true : false
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

  public showDescription(index){
    const elem = document.getElementById("description-" + index);
    elem.classList.remove('description-hide')
  }
  public removeDescription(index){
    const elem = document.getElementById("description-" + index);
    elem.classList.add('description-hide')
  }
}
