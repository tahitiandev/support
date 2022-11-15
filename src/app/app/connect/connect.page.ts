import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LocalName } from 'src/app/enums/localName';
import { Utilisateurs } from 'src/app/interfaces/Utilisateurs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {

  connectForm : FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
});

  constructor(private storage : StorageService,
              private alertController : AlertController,
              private utilisateursService : UtilisateursService,
              private firebase : FirebaseService,
              private utility : UtilityService) {
                this.deconnexion();
               }

  ngOnInit() {
  }

  public async onSubmit(){
    const data = await this.connectForm.value;
    const utilisateurs : Array<Utilisateurs> = await this.storage.get(LocalName.Utilisateurs);

    const isUtilisateursExiste = await utilisateurs.find(utilisateurs => utilisateurs.username === data['username']);

    if(isUtilisateursExiste){

      const password = data['password'];

      if(isUtilisateursExiste.password === password){
        
        const infoConnexion = [
          {
            id : 0,
            autorisation : true,
            utilisateur : await this.utilisateursService.getUtilisateurByLogin(data['username'])
          }
        ]

        await this.storage.resetLocalStorage(LocalName.Connect);
        await this.storage.connexion(infoConnexion);
        this.utility.navigateTo('/');
      }

    }else{
      this.connectForm.patchValue({
        username : '',
        password : ''
      })
      console.log('L\'utilisateurs n\'existe pas');
    }
  }

  private async deconnexion(){
    await this.storage.deconnexion();
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

          }
        }
      ],
    });

    await alert.present();
  }

  public async syncToFirebase(){
    await this.firebase.getAll(LocalName.Interventions);
    await this.firebase.getAll(LocalName.Utilisateurs);
    await this.firebase.getAll(LocalName.Observations);
  }

}
