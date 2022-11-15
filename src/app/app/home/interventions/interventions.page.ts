import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Interventions } from 'src/app/interfaces/Interventions';
@Component({
  selector: 'app-interventions',
  templateUrl: './interventions.page.html',
  styleUrls: ['./interventions.page.scss'],
})
export class InterventionsPage implements OnInit {

  interventionsListeActif : boolean = true;
  interventionsDetailsInput : Interventions;
  interventionListeInput : any;

  constructor(private route : ActivatedRoute) { }

  ngOnInit() {
    this.getParams();
  }

  private getParams(){
    const utilisateurId = this.route.snapshot.params['utilisateurId'];
    const etat = this.route.snapshot.params['etat'];
    
    if(utilisateurId !== undefined){
      this.interventionListeInput = [utilisateurId, etat];
    }
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
