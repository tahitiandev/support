import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterventionsPageRoutingModule } from './interventions-routing.module';

import { InterventionsPage } from './interventions.page';
import { InterventionsListeComponent } from './interventions-liste/interventions-liste.component';
import { InterventionsDetailsComponent } from './interventions-details/interventions-details.component';
import { RefeshGetFirebaseComponent } from 'src/app/utility/refesh-get-firebase/refesh-get-firebase.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterventionsPageRoutingModule
  ],
  declarations: [
    InterventionsPage, 
    InterventionsListeComponent,
    InterventionsDetailsComponent,
    RefeshGetFirebaseComponent
  ]
})
export class InterventionsPageModule {}
