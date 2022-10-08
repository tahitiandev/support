import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
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
  debutPeriode : Date;
  finPeriode : Date;
  formulaire : FormGroup = new FormGroup({
    dateSelected : new FormControl('')
  });
  tempsTotal = 0
  isGaffa : boolean = false;

  constructor(private utility : UtilityService,
              private interventionService : InterventionsService,
              private alertController : AlertController) { }

  ngOnInit() {
  }

  private async refresh(){
    await this.getDate();
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
    const interventionsGaffa : Array<Interventions> = await interventionsTimerNotNull.filter(interventions => interventions.gaffa === false);
    if(this.isGaffa){
      return interventionsTimerNotNull;
    }else{
      return interventionsGaffa;
    }
  }

  public async getDate(){
    
    const data = await this.formulaire.value
    const date = await new Date(data['dateSelected']);
    const periode = await this.getPeriode(date);

    const result = await this.getInterventionParPeriode(
      new Date(periode.dateDebut),
      new Date(periode.dateFin)
    )
    this.interventions = await result;
    await this.calculeTempsTotal(result);
    
    this.debutPeriode = periode.dateDebut;
    this.finPeriode = periode.dateFin;
  
  }

  public parseDateDDmmYYYY(date : Date){
    return this.utility.parseDateDDmmYYYY(date);
  }

  private async calculeTempsTotal(interventions : Array<Interventions>){
    var tempsTotal = 0;
    await interventions.map(interventions => tempsTotal += interventions.timer);
    this.tempsTotal = tempsTotal;
  }

  convertSecondToTime(seconds){
    const result = this.utility.convertSecondToTime(seconds)
    return result;
  }
  convertSEcondToDate(seconds, returnDate : boolean){
    return this.utility.convertSecondToDate(seconds, returnDate);
  }

  public async refreshChrono(intervention : Interventions){
    const alert = await this.alertController.create({
      header: 'Souhaitez-vous reporter cette tâche à la semaine prochaine ?',
      buttons: [
        {
          text : 'Non',
          handler : async () => {
            await this.gaffa(intervention);
          }
        },
        {
          text : 'Oui',
          handler : async () => {
            await this.interventionService.refreshChrono(intervention);
            await this.refresh();
          }
        }
      ],
    });

    await alert.present();
  }

  public async gaffa(intervention : Interventions){
    intervention.gaffa = !intervention.gaffa
    await this.interventionService.put(intervention);
    await this.refresh();
  }

  public async filtreGaffa(){
    this.isGaffa = !this.isGaffa;
    await this.refresh();
  }

}
