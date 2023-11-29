import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JoblistingComponent } from './joblisting/joblisting.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailComponent } from './blogdetail/blogdetail.component';
import { ElementsComponent } from './elements/elements.component';
import { JobdetailComponent } from './jobdetail/jobdetail.component';

const routes: Routes = [
  {path: "", component:HomeComponent},
  {path: "home", component:HomeComponent},
  {path: "joblisting", component:JoblistingComponent},
  {path: "about", component:AboutComponent},
  {path: "contact", component:ContactComponent},
  {path: "blog", component:BlogComponent},
  {path: "blogdetail", component:BlogdetailComponent},
  {path: "elements", component:ElementsComponent},
  {path: "jobdetail", component:JobdetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
