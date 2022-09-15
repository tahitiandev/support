import { Injectable } from '@angular/core';
import { EtatIntervention } from '../enums/EtatsIntervention';
import { LocalName } from '../enums/localName';
import { Interventions } from '../interfaces/Interventions';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class InterventionsService {

  constructor(private storage : StorageService) { }

  public async get(){
    return await this.storage.get(LocalName.Interventions);
  }

  public async getInterventionByUtilisateurAndEtat(utilisateurId : number, etat : EtatIntervention){
    const interventions : Array<Interventions> = await this.get();
    const interventionByEtat = await interventions.filter(intervention => intervention.etat === etat);
    const interventionByUtilisateur = await interventionByEtat.filter(intervention => intervention.intervenant.id === utilisateurId);
    return interventionByUtilisateur
    
  }

  public async postIntervention(intervention : Interventions){
    await this.storage.postData(
      LocalName.Interventions,
      intervention
    )
  }

  public async postInterventions(interventions: Array<Interventions>){
    await this.storage.postDatas(
      LocalName.Interventions,
      interventions
    );
  }

  public async delete(intervention : Interventions){
    await this.storage.delete(
      LocalName.Interventions,
      intervention
    );
  }

  public async put(intervention : Interventions){
    await this.storage.put(
      LocalName.Interventions,
      intervention
    );
  }

  public async searchInterventionById(id : number){
    const interventions = await this.get();
    const response = await interventions.find(interventions => interventions.id === id);
    return response;
  }

  compteur : number = 0;
  compteurActif : boolean = false;

  public startChrono(intervention : Interventions){

    if(intervention.etat === EtatIntervention.Nouveau){
      intervention.etat = EtatIntervention.EnCours;
      this.put(intervention);
    }

    if(intervention.timer !== undefined){
      this.compteur = intervention.timer;
    }else{
      this.compteur = 0;
    }
    this.compteurActif = true;
    const eventChrono = setInterval(() => {
      if(this.compteurActif){
        intervention.timer = this.compteur;
        this.storage.put(
          LocalName.Interventions,
          intervention
          );
        this.compteur++
      }else{
        clearInterval(eventChrono);
      }
    },1000);

    eventChrono
    
  }

  public stopChrono(intervention : Interventions){
    this.compteurActif = false;

    intervention.timer = this.compteur;
    this.put(intervention);
    
  }

}
