import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../landing/landing.module')
    .then(m => m.LandingModule)
  },
  {
    matcher: (url) => {
      if(url[0].path.split(/\/(.*)/s)[0] == "admin") {
        return {
          consumed: url
        };
      }
      return null;
    },
    path: '',
    loadChildren: () => import('../admin/admin.module')
    .then(m => m.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
