import { Component, OnInit } from '@angular/core';
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
}


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  interventionParUtilisateur = [];

  constructor(private storage : StorageService,
              private interventionsService : InterventionsService,
              private utiliateursService : UtilisateursService) { }

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
    const resultTermine = await this.getInterventionByUtilisateurByEtat(EtatIntervention.Termine);

    for(let utilisateur of utilisateurs){

      var tempResult = {
        utilisateur : utilisateur,
        totalNouveau : 0,
        totalEnCours : 0,
        totalTermine : 0
      }

      for(let data of resultNouveau){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalNouveau = data.nombre
        }
      }

      for(let data of resultEnCours){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalEnCours = data.nombre
        }
      }

      for(let data of resultTermine){
        if(data.utilisateur === utilisateur.libelle){
          tempResult.totalTermine = data.nombre
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

      result.push({
        utilisateur : utilisateur.libelle,
        nombre : 0,
        etat : EtatIntervention
      })

      for(let intervention of interventions){
        if(intervention.intervenant.libelle === utilisateur.libelle){
          if(intervention.etat === EtatIntervention){
            result[index].nombre++
          }
        }
      }

      index ++
      
    }

    return result;
  }

}
