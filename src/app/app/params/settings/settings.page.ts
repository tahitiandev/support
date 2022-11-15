import { Component, OnInit } from '@angular/core';
import { LocalName } from 'src/app/enums/localName';
import { Interventions } from 'src/app/interfaces/Interventions';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InterventionsService } from 'src/app/services/interventions.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  nbInterventionNonEnvoyee : number = 0;

  constructor(private firebase : FirebaseService,
              private interventionService : InterventionsService) { }

  ngOnInit() {
    this.interventionNonEnvoyee();
  }

  public async postAllToFirebase(){
    await this.firebase.postAll();
  }

  public async getAllFromFirebase(){
    await this.firebase.getAll(LocalName.Interventions);
    await this.firebase.getAll(LocalName.Utilisateurs);
    await this.firebase.getAll(LocalName.Observations);
  }

  private async interventionNonEnvoyee(){
    const Interventions : Array<Interventions> = await this.interventionService.get();
    const interventionNonEnvoyee = Interventions.filter(intervention => intervention.firebase === false);
    this.nbInterventionNonEnvoyee = interventionNonEnvoyee.length;
  }


}
