import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { LocalName } from 'src/app/enums/localName';
import { Interventions } from 'src/app/interfaces/Interventions';
import { Utilisateurs } from 'src/app/interfaces/Utilisateurs';
import { InterventionsService } from 'src/app/services/interventions.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';


interface InterventionParUtilisateur {
  utilisateur : string;
  nombre : number;
  etat : EtatIntervention;
  idIntervention : Array<number>;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  interventionParUtilisateur = [];
  @Output() refreshNavBarOutput = new EventEmitter();
  homeActif : boolean = true;

  constructor(private storage : StorageService,
              private interventionsService : InterventionsService,
              private utiliateursService : UtilisateursService,
              private navigate : NavController) { }

  ngOnInit() {
    this.refresh();
  }

  private async refresh(){
    const interventionParUtilisateur = await this.getInterventionByUtilisateur();
    this.interventionParUtilisateur = interventionParUtilisateur;
  }

  private async getInterventions(){
    return this.interventionsService.get();
  }

  private async getUtilisateurs(){
    return await this.utiliateursService.get();
  }

  public async getInterventionByUtilisateur(){
    
    const utilisateurs : Array<Utilisateurs> = await this.getUtilisateurs();

    const result = []
    const resultNouveau = await this.getInterventionByUtilisateurByEtat(EtatIntervention.Nouveau);
    const resultEnCours = await this.getInterventionByUtilisateurByEtat(EtatIntervention.EnCours);
    const resultEnAttente = await this.getInterventionByUtilisateurByEtat(EtatIntervention.EnAttente);
    const resultTermine = await this.getInterventionByUtilisateurByEtat(EtatIntervention.Termine);

    for(let utilisateur of utilisateurs){

      var tempResult = {
        utilisateur : utilisateur,
        totalNouveau : 0,
        idNouveau : [],
        totalEnCours : 0,
        idEncours : [],
        totalEnAttente : 0,
        idEnAttente : [],
        totalTermine : 0,
        idTermine : [],
      }

      for(let data of resultNouveau){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalNouveau = data.nombre;
          tempResult.idNouveau = data.idIntervention;
        }
      }
      
      for(let data of resultEnCours){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalEnCours = data.nombre
          tempResult.idEncours = data.idIntervention;
        }
      }

      for(let data of resultEnAttente){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalEnAttente = data.nombre
          tempResult.idEnAttente = data.idIntervention;
        }
      }
      
      for(let data of resultTermine){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalTermine = data.nombre
          tempResult.idTermine = data.idIntervention;
        }
      }

      result.push(tempResult);
    }

    return await result;
  }

  private async getInterventionByUtilisateurByEtat(EtatIntervention : EtatIntervention){
    const utilisateurs : Array<Utilisateurs> = await this.getUtilisateurs();
    const interventions : Array<Interventions> = await this.getInterventions();
    
    var result : Array<InterventionParUtilisateur> = [];
    var index = 0;

    for(let utilisateur of utilisateurs){

      try{
        result.push({
          utilisateur : utilisateur.libelle,
          nombre : 0,
          etat : EtatIntervention,
          idIntervention : []
        })
  
        for(let intervention of interventions){
          if(intervention.intervenant.id === utilisateur.id){
            if(intervention.etat === EtatIntervention){
              result[index].nombre++
              result[index].idIntervention.push(intervention.id);
            }
          }
        }
  
        index ++
      }catch(error) {
        console.error(error)
      }
      
    }

    return result;
  }

  public refreshNavBar(event){
    this.refreshNavBarOutput.emit();
    event.target.complete();
  }

  public viewDetail(utilisateur, etat){
    this.navigate.navigateRoot('interventions/' + utilisateur + '/' + etat);
  }

}
