import { Component, OnInit } from '@angular/core';
import { Interventions } from 'src/app/interfaces/Interventions';
@Component({
  selector: 'app-interventions',
  templateUrl: './interventions.page.html',
  styleUrls: ['./interventions.page.scss'],
})
export class InterventionsPage implements OnInit {

  interventionsListeActif : boolean = true;
  interventionsDetailsInput : Interventions;

  constructor() { }

  ngOnInit() {

  }

  private switchInterventionsListeActif(){
    this.interventionsListeActif = !this.interventionsListeActif;
  }

  public async getInterventionOutput(intervention : Interventions){
    this.interventionsDetailsInput = await intervention;
    this.switchInterventionsListeActif();
  }

  public closeInterventionDetail(){
    this.switchInterventionsListeActif();
  }

}
