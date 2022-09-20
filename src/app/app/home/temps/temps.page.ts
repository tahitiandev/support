import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Interventions } from 'src/app/interfaces/Interventions';
import { InterventionsService } from 'src/app/services/interventions.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-temps',
  templateUrl: './temps.page.html',
  styleUrls: ['./temps.page.scss'],
})
export class TempsPage implements OnInit {

  interventions : Array<Interventions> = [];
  debutPeriode : string;
  finPeriode : string;
  formulaire : FormGroup = new FormGroup({
    dateSelected : new FormControl('')
  });
  tempsTotal = 0

  constructor(private utility : UtilityService,
              private interventionService : InterventionsService) { }

  ngOnInit() {
  }

  public async getPeriode(date : Date){
    const periode = await this.utility.getDateDebutEtFinDeSemaine(date)
    return periode
  }

  public async getInterventions(){
    return await this.interventionService.get();
  }

  private async getInterventionParPeriode(debut : Date, fin : Date){
    const interventions : Array<Interventions> = await this.getInterventions();
    const interventionsTimerNotNull : Array<Interventions> = await interventions.filter(interventions => interventions.timer !== undefined);
    const interventionsDateDebut = await interventionsTimerNotNull.filter(interventions => new Date(interventions.modifiedOn) >= debut);
    const interventionsDateFin = await interventionsDateDebut.filter(interventions => new Date(interventions.modifiedOn) <= fin);
    console.log(interventionsTimerNotNull)
    return interventionsTimerNotNull;
  }

  public async getDate(){
    
    const data = await this.formulaire.value
    const date = await new Date(data['dateSelected']);
    const periode = await this.getPeriode(date);

    const result = await this.getInterventionParPeriode(
      new Date(periode.dateDebut),
      new Date(periode.dateFin)
    )
    this.interventions = result;
    this.calculeTempsTotal(result);
    
    this.debutPeriode = this.utility.parseDateDDmmYYYY(periode.dateDebut);
    this.finPeriode = this.utility.parseDateDDmmYYYY(periode.dateFin);
  
  }

  private calculeTempsTotal(interventions : Array<Interventions>){
    var tempsTotal = 0;
    interventions.map(interventions => tempsTotal += interventions.timer);
    this.tempsTotal = tempsTotal;
  }

  convertSecondToTime(seconds){
    const result = this.utility.convertSecondToTime(seconds)
    return result;
  }

}
