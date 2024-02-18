import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AccountSetup, Index, JobPost, ResumeMaker } from 'src/providers/constants';
import { JobpostComponent } from './jobpost/jobpost.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { ResumeMakerComponent } from './resume-maker/resume-maker.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: Index, component: IndexComponent},
  {path: JobPost, component: JobpostComponent},
  {path: ResumeMaker, component: ResumeMakerComponent},
  {path: AccountSetup, component: AccountSetupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
