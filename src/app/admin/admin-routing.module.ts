import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Client, Dashboard, Employee, JobPost, ManageClient, ManageEmployee, Profile } from 'src/providers/constants';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { EmployeeComponent } from './employee/employee.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: Dashboard, component: DashboardComponent},
  {path: Client, component: ClientComponent},
  {path: ManageClient, component: ManageClientComponent},
  {path: Employee, component: EmployeeComponent},
  {path: ManageEmployee, component: ManageEmployeeComponent},
  {path: Profile, component: ProfileComponent},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
