import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'temps',
    loadChildren: () => import('./temps/temps.module').then( m => m.TempsPageModule)
  },
  {
    path: 'registre-backup',
    loadChildren: () => import('./registre-backup/registre-backup.module').then( m => m.RegistreBackupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
