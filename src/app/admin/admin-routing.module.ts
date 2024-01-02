import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { Client, ManageClient } from 'src/providers/constants';
import { ManageClientComponent } from './manage-client/manage-client.component';

const routes: Routes = [
  {path: Client, component: ClientComponent},
  {path: ManageClient, component: ManageClientComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
