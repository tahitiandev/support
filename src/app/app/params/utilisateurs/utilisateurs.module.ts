import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UtilisateursPageRoutingModule } from './utilisateurs-routing.module';

import { UtilisateursPage } from './utilisateurs.page';
import { RefeshGetFirebaseComponent } from 'src/app/utility/refesh-get-firebase/refesh-get-firebase.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilisateursPageRoutingModule
  ],
  declarations: [
    UtilisateursPage,
    RefeshGetFirebaseComponent
  ]
})
export class UtilisateursPageModule {}
