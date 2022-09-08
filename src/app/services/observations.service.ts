import { Injectable } from '@angular/core';
import { LocalName } from '../enums/localName';
import { Observations } from '../interfaces/Observations';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ObservationsService {

  constructor(private storage : StorageService) { }

  public async get(){
    return await this.storage.get(LocalName.Observations);
  }

  public async getObservationByInterventionId(interventionId : number){
    const observations : Array<Observations> = await this.get();
    return observations.filter(observations => observations.interventionId === interventionId);
  }

  public async post(observation : Observations){
    await this.storage.postData(
      LocalName.Observations,
      observation
    )
  }

  public async generateId (interventionId : number){
    var observation = await this.get();
    observation = observation.filter(observation => observation.interventionId === interventionId);
    
    if(observation.length === 0){
      return 0
    }
    else{
      const id = observation[observation.length - 1].id + 1
      return id;
    }
  }

}
