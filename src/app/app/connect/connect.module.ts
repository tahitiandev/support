import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectPageRoutingModule } from './connect-routing.module';

import { ConnectPage } from './connect.page';
import { RefeshGetFirebaseComponent } from '../../utility/refesh-get-firebase/refesh-get-firebase.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConnectPage,
    RefeshGetFirebaseComponent
  ]
})
export class ConnectPageModule {}
