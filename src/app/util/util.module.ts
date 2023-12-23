import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilRoutingModule } from './util-routing.module';
import { UtilComponent } from './util.component';
import { BreadcrumsComponent } from './breadcrums/breadcrums.component';


@NgModule({
  declarations: [
    UtilComponent,
    BreadcrumsComponent
  ],
  imports: [
    CommonModule,
    UtilRoutingModule
  ],
  exports: [
    BreadcrumsComponent
  ]
})
export class UtilModule { }
