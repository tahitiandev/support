import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalName } from './enums/localName';
import { StorageService } from './services/storage.service';
import { UtilityService } from './services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public navBarFirst = [];
  public navBarreSecond = [];

  constructor(private storage : StorageService,
              private storages : Storage,
              private utility : UtilityService ) {
  }

  ngOnInit(): void {
    this.onInit();
  }

  private async onInit(){
    await this.setUtilisateurs();
    await this.setInterventions();
    await this.setConnect();
    await this.connexion();
  }

  private async setUtilisateurs(){
    await this.storage.initLocalName(LocalName.Utilisateurs);
  }

  private async setInterventions(){
    await this.storage.initLocalName(LocalName.Interventions);
  }

  private async setConnect(){
    await this.storage.initLocalName(LocalName.Connect, true);    
  }

  public async connexion(){
    
    const connect = await this.storages.get('Connect');

    if(!connect[0].autorisation){
      this.navBarFirst = [
        { title: 'Se connecter', url: 'connect', icon: 'warning' },
        { title: 'Actualiser', url: '/', icon: 'warning' },
      ];
      this.navBarreSecond = [];
      this.utility.navigateTo('/connect')
    }

    if(connect[0].autorisation){
      this.navBarFirst = [
        { title: 'Accueil', url: '/home', icon: 'home' },
        { title: 'Interventions', url: '/interventions', icon: 'hammer' }
      ];
      
      this.navBarreSecond = [
        { title: 'Utilisateurs', url: '/utilisateurs', icon: 'happy' },
        { title: 'Paramétrages', url: '/utilisateurs', icon: 'build' },
        { title: 'Se deconnecter', url: '/connect', icon: 'happy' },
      ]
    }

  }

}
