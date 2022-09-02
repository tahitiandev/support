import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Utilisateurs } from 'src/app/interfaces/Utilisateurs';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.page.html',
  styleUrls: ['./utilisateurs.page.scss'],
})
export class UtilisateursPage implements OnInit {

  utilisateurs : Array<Utilisateurs> = [];

  constructor(private utilisateursService : UtilisateursService,
              private alertController : AlertController) { }

  ngOnInit() {
    this.refresh();
  }

  private async refresh(){
    const utilisateurs = await this.getUtilisateurs();
    this.utilisateurs = utilisateurs;
  }

  private async getUtilisateurs(){
    const utilisateurs = await this.utilisateursService.get();
    return utilisateurs;
  }

  public async postUtilisateur(){
    const alert = await this.alertController.create({
      header: 'Créer un utilisateur',
      inputs : [
        {
          type : 'text',
          name : 'libelle',
          label : 'Libellé',
          placeholder : 'Libellé'
        },
        {
          type : 'text',
          name : 'username',
          placeholder : 'Nom d\'utilisateur'
        },
        {
          type : 'text',
          name : 'password',
          placeholder : 'Mot de passe'
        },
        {
          type : 'checkbox',
          name : 'isRoot',
          placeholder : 'Super admin'
        }
      ],
      buttons: [
        {
          text : 'Valider',
          handler : async (response : Utilisateurs) => {

            const isRoot = response.isRoot.toString() == 'on' ? true : false;

            const utilisateur : Utilisateurs = {
              id : 1,
              libelle : response.libelle,
              username : response.username,
              password : response.password,
              isRoot : isRoot,
              createdBy : null,
              createdOn : new Date(),
              modifiedBy : null,
              modifiedOn : null,
              deletedBy : null,
              deletedOn : null,
              documentId :null,
              firebase : false
            }

            await this.utilisateursService.postUtilisateur(utilisateur);
            await this.refresh();

          }
        }
      ],
    });

    await alert.present();
  }

  public async delete(utilisateur : Utilisateurs){
    await this.utilisateursService.delete(utilisateur);
    await this.refresh();
  }

  public async update(utilisateurs : Utilisateurs){
    const alert = await this.alertController.create({
      header: 'Créer un utilisateur',
      inputs : [
        {
          type : 'text',
          name : 'libelle',
          value : utilisateurs.libelle,
          placeholder : 'Libellé'
        },
        {
          type : 'text',
          name : 'username',
          value : utilisateurs.username,
          placeholder : 'Nom d\'utilisateur'
        },
        {
          type : 'password',
          name : 'password',
          value : utilisateurs.password,
          placeholder : 'Mot de passe'
        },
        {
          type : 'checkbox',
          name : 'isRoot',
          checked : utilisateurs.isRoot.toString() == 'on' ? true : false,
          placeholder : 'Super admin'
        }
      ],
      message: 'This is an alert!',
      buttons: [
        {
          text : 'Valider',
          handler : async (response : Utilisateurs) => {

            const isRoot = response.isRoot.toString() == 'on' ? true : false;

            const utilisateur : Utilisateurs = {
              id : utilisateurs.id,
              libelle : response.libelle,
              username : response.username,
              password : response.password,
              isRoot : isRoot,
              createdBy : null,
              createdOn : new Date(),
              modifiedBy : null,
              modifiedOn : null,
              deletedBy : null,
              deletedOn : null,
              documentId :null,
              firebase : false
            }

            await this.utilisateursService.put(utilisateur);
            await this.refresh();

          }
        }
      ],
    });

    await alert.present();
  }

}
