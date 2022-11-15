import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterventionsPageRoutingModule } from './interventions-routing.module';

import { InterventionsPage } from './interventions.page';
import { InterventionsListeComponent } from './interventions-liste/interventions-liste.component';
import { InterventionsDetailsComponent } from './interventions-details/interventions-details.component';
import { RefeshGetFirebaseComponent } from 'src/app/utility/refesh-get-firebase/refesh-get-firebase.component';
import { PopupFiltresComponent } from './interventions-list/popup-filtres/popup-filtres.component';
import { PopupFiltreEtatComponent } from './interventions-list/popup-filtre-etat/popup-filtre-etat.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterventionsPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    InterventionsPage, 
    InterventionsListeComponent,
    InterventionsDetailsComponent,
    RefeshGetFirebaseComponent,
    PopupFiltresComponent,
    PopupFiltreEtatComponent
  ]
})
export class InterventionsPageModule {}
