import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { InterventionsListeComponent } from './interventions/interventions-liste/interventions-liste.component';
import { RefeshGetFirebaseComponent } from 'src/app/utility/refesh-get-firebase/refesh-get-firebase.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    InterventionsListeComponent,
    RefeshGetFirebaseComponent
  ]
})
export class HomePageModule {}
