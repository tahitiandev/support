import { Injectable } from '@angular/core';
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

}
