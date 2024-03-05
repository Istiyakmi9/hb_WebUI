import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AccountSetup, Index, JobPost, ManageFriend, Resume, ResumeMaker } from 'src/providers/constants';
import { JobpostComponent } from './jobpost/jobpost.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { ResumeComponent } from './resume/resume.component';
import { ResumeMakerComponent } from './resume-maker/resume-maker.component';
import { ManageFriendComponent } from './manage-friend/manage-friend.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: Index, component: IndexComponent},
  {path: JobPost, component: JobpostComponent},
  {path: AccountSetup, component: AccountSetupComponent},
  {path: Resume, component: ResumeComponent},
  {path: ResumeMaker, component: ResumeMakerComponent},
  {path: ManageFriend, component: ManageFriendComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
