import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    loadChildren: () => import('./home/home.module')
    .then(m => m.HomeModule)
  },
  {
    matcher: (url) => {
      if(url[0].path.split(/\/(.*)/s)[0] == "admin" || url[0].path.split(/\/(.*)/s)[0] == "home") {
        return {
          consumed: url
        };
      }
      return null;
    },
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./layout/layout.module')
    .then(m => m.LayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
