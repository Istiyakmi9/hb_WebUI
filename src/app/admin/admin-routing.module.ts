import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { Client, Employee, ManageClient, ManageEmployee } from 'src/providers/constants';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { EmployeeComponent } from './employee/employee.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';

const routes: Routes = [
  {path: Client, component: ClientComponent},
  {path: ManageClient, component: ManageClientComponent},
  {path: Employee, component: EmployeeComponent},
  {path: ManageEmployee, component: ManageEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
