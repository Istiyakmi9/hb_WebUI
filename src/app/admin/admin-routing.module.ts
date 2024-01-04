import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { Client, Dashboard, ManageClient } from 'src/providers/constants';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: Dashboard, component: DashboardComponent},
  {path: Client, component: ClientComponent},
  {path: ManageClient, component: ManageClientComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
