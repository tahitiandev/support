import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private firebase : FirebaseService) { }

  ngOnInit() {
  }

  public async postAllToFirebase(){
    await this.firebase.postAll();
  }

  public async getAllFromFirebase(){
    await this.getAllFromFirebase();
  }

}
