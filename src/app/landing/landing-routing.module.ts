import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { Index, JobPost } from 'src/providers/constants';
import { JobpostComponent } from './jobpost/jobpost.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: Index, component: IndexComponent},
  {path: JobPost, component: JobpostComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
