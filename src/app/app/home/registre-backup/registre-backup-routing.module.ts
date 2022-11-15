import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistreBackupPage } from './registre-backup.page';

const routes: Routes = [
  {
    path: '',
    component: RegistreBackupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistreBackupPageRoutingModule {}
