import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistreBackupPageRoutingModule } from './registre-backup-routing.module';

import { RegistreBackupPage } from './registre-backup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistreBackupPageRoutingModule
  ],
  declarations: [RegistreBackupPage]
})
export class RegistreBackupPageModule {}
