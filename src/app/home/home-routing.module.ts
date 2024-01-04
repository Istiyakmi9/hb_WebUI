import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailComponent } from './blogdetail/blogdetail.component';
import { ContactComponent } from './contact/contact.component';
import { ElementsComponent } from './elements/elements.component';
import { JobdetailComponent } from './jobdetail/jobdetail.component';
import { JoblistingComponent } from './joblisting/joblisting.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: "", component:LandingpageComponent},
  {path: "home", component:LandingpageComponent},
  {path: "joblisting", component:JoblistingComponent},
  {path: "about", component:AboutComponent},
  {path: "contact", component:ContactComponent},
  {path: "blog", component:BlogComponent},
  {path: "blogdetail", component:BlogdetailComponent},
  {path: "elements", component:ElementsComponent},
  {path: "jobdetail", component:JobdetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
