import { Component, OnInit } from '@angular/core';
import { LocalName } from 'src/app/enums/localName';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-refesh-get-firebase',
  templateUrl: './refesh-get-firebase.component.html',
  styleUrls: ['./refesh-get-firebase.component.scss'],
})
export class RefeshGetFirebaseComponent implements OnInit {

  constructor(private firebase : FirebaseService) { }

  ngOnInit() {}

  public async getDataFromFirebase(event){
    await this.firebase.getAll(LocalName.Interventions);
    await this.firebase.getAll(LocalName.Observations);
    await this.firebase.getAll(LocalName.Utilisateurs);
    await event.target.complete();
  }

}
