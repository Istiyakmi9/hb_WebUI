import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilRoutingModule } from './util-routing.module';
import { UtilComponent } from './util.component';
import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { AllownumberDirective } from './directives/allownumber.directive';
import { DecimalnumberDirective } from './directives/decimalnumber.directive';
import { PreLoadTableComponent } from './pre-load-table/pre-load-table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { IautocompleteComponent } from './iautocomplete/iautocomplete.component';


@NgModule({
  declarations: [
    UtilComponent,
    BreadcrumsComponent,
    AllownumberDirective,
    DecimalnumberDirective,
    PreLoadTableComponent,
    PaginationComponent,
    IautocompleteComponent
  ],
  imports: [
    CommonModule,
    UtilRoutingModule
  ],
  exports: [
    BreadcrumsComponent,
    AllownumberDirective,
    DecimalnumberDirective,
    PreLoadTableComponent,
    PaginationComponent,
    IautocompleteComponent
  ]
})
export class UtilModule { }
