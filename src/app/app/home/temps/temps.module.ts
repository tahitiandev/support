import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TempsPageRoutingModule } from './temps-routing.module';

import { TempsPage } from './temps.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TempsPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [TempsPage]
})
export class TempsPageModule {}
