import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ClientComponent } from './client/client.component';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { UtilModule } from '../util/util.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';


@NgModule({
  declarations: [
    ClientComponent,
    ManageClientComponent,
    DashboardComponent,
    EmployeeComponent,
    ManageEmployeeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UtilModule
  ]
})
export class AdminModule { }
