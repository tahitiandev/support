import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { Interventions } from 'src/app/interfaces/Interventions';
import { Utilisateurs } from 'src/app/interfaces/Utilisateurs';
import { InterventionsService } from 'src/app/services/interventions.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-interventions-details',
  templateUrl: './interventions-details.component.html',
  styleUrls: ['./interventions-details.component.scss'],
})
export class InterventionsDetailsComponent implements OnInit {

  @Input() interventionsDetailsInput : Interventions;
  @Output() isInterventionDetailClose = new EventEmitter();

  constructor(private alertController : AlertController,
              private interventionService : InterventionsService,
              private utilisateurService : UtilisateursService,
              private utlity : UtilityService) { }

  ngOnInit() {}

  public closeInterventionsDetails(){
    this.isInterventionDetailClose.emit();
  }

  public async updateEtat(intervention : Interventions){
    const alert = await this.alertController.create({
      header: 'Modifier l\'etat',
      inputs : [
        {
          type : 'radio',
          name : EtatIntervention.Nouveau,
          label : EtatIntervention.Nouveau,
          checked : intervention.etat === EtatIntervention.Nouveau ? true : false,
          value : EtatIntervention.Nouveau
        },
        {
          type : 'radio',
          name : EtatIntervention.EnCours,
          label : EtatIntervention.EnCours,
          checked : intervention.etat === EtatIntervention.EnCours ? true : false,
          value : EtatIntervention.EnCours
        },
        {
          type : 'radio',
          name : EtatIntervention.Termine,
          label : EtatIntervention.Termine,
          checked : intervention.etat === EtatIntervention.Termine ? true : false,
          value : EtatIntervention.Termine
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (EtatIntervention : EtatIntervention) => {

            if(EtatIntervention !== intervention.etat){
              intervention.etat = EtatIntervention
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public async updateUtilisateur(intervention : Interventions){

    const utilisateurs : Array<Utilisateurs> = await this.utilisateurService.get();
    const inputs : Array<AlertInput> = [];

    utilisateurs.map(utilisateurs => {
      inputs.push({
        type : 'radio',
        label : utilisateurs.libelle,
        name : utilisateurs.libelle,
        value : utilisateurs
      })
    })

    const alert = await this.alertController.create({
      header: 'Modifier l\'intervenant',
      inputs : inputs,
      buttons: [
        {
          text : 'Valider',
          handler : async (intervenant : Utilisateurs) => {

            if(intervenant !== intervention.intervenant){
              intervention.intervenant = intervenant
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public async updateDescription(intervention : Interventions){

    const alert = await this.alertController.create({
      header: 'Modifier l\'intervenant',
      inputs : [
        {
          type : 'textarea',
          name : 'description',
          value : intervention.description
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response) => {

            console.log(response.description)

            if(response.description !== intervention.description){
              intervention.description = response.description;
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  public textarea(texte){
    return this.utlity.textareaRetourChariot(texte);
  }

  public async updateObjet(intervention : Interventions){

    const alert = await this.alertController.create({
      header: 'Modifier l\'objet',
      inputs : [
        {
          type : 'textarea',
          name : 'objet',
          value : intervention.objet
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response) => {

            if(response.objet !== intervention.objet){
              intervention.objet = response.objet;
              await this.interventionService.put(intervention);
              this.interventionsDetailsInput = intervention;
            }

          }
        }
      ],
    });

    await alert.present();
  }

  

}
