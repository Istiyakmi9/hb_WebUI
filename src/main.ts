/// <reference types="@angular/localize" />

// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
// import { HomeModule } from './app/home/home.module';
// import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppHttpIntercepter } from 'src/auth/app.intercepter';
import {
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { UserService } from 'src/providers/userService';
import { JwtService } from 'src/auth/jwtService';
import { iNavigation } from 'src/providers/iNavigation';
import { AjaxService } from 'src/providers/ajax.service';
import { Routes, provideRouter, withHashLocation } from '@angular/router';
import {
  Dashboard,
  Client,
  ManageClient,
  Employee,
  ManageEmployee,
  Profile,
  AccountSetup,
  Index,
  JobPost,
  ManageFriend,
  Resume,
  ResumeMaker,
} from './providers/constants';

const routes: Routes = [
  {
    path: '',
    // path: 'landing',
    loadComponent: () =>
      import('./app/home/presentation/home/home.component').then(
        (c) => c.HomeComponent
      ),
    // pathMatch: 'full',
    children: [
      // home module
      {
        path: '',
        loadComponent: () =>
          import(
            './app/home/presentation/landingpage/landingpage.component'
          ).then((c) => c.LandingpageComponent),
      },
      {
        path: 'home',
        loadComponent: () =>
          import(
            './app/home/presentation/landingpage/landingpage.component'
          ).then((c) => c.LandingpageComponent),
      },
      {
        path: 'joblisting',
        loadComponent: () =>
          import(
            './app/home/presentation/joblisting/joblisting.component'
          ).then((c) => c.JoblistingComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./app/home/presentation/about/about.component').then(
            (c) => c.AboutComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./app/home/presentation/contact/contact.component').then(
            (c) => c.ContactComponent
          ),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./app/home/presentation/blog/blog.component').then(
            (c) => c.BlogComponent
          ),
      },
      {
        path: 'blogdetail',
        loadComponent: () =>
          import(
            './app/home/presentation/blogdetail/blogdetail.component'
          ).then((c) => c.BlogdetailComponent),
      },
      {
        path: 'elements',
        loadComponent: () =>
          import('./app/home/presentation/elements/elements.component').then(
            (c) => c.ElementsComponent
          ),
      },
      {
        path: 'jobdetail',
        loadComponent: () =>
          import('./app/home/presentation/jobdetail/jobdetail.component').then(
            (c) => c.JobdetailComponent
          ),
      },
    ],
  },
  {
    matcher: customMatcher('admin'),
    path: '',
    loadComponent: () =>
      import('./app/layout/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    //Admin Module
    children: [
      {
        path: Dashboard,
        loadComponent: () =>
          import('./app/admin/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: Client,
        loadComponent: () =>
          import('./app/admin/client/client.component').then(
            (c) => c.ClientComponent
          ),
      },
      {
        path: ManageClient,
        loadComponent: () =>
          import('./app/admin/manage-client/manage-client.component').then(
            (c) => c.ManageClientComponent
          ),
      },
      {
        path: Employee,
        loadComponent: () =>
          import('./app/admin/employee/employee.component').then(
            (c) => c.EmployeeComponent
          ),
      },
      {
        path: ManageEmployee,
        loadComponent: () =>
          import('./app/admin/manage-employee/manage-employee.component').then(
            (c) => c.ManageEmployeeComponent
          ),
      },
      {
        path: Profile,
        loadComponent: () =>
          import('./app/admin/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
    ],
  },
  {
    matcher: customMatcher('home'),
    path: '',
    loadComponent: () =>
      import('./app/layout/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      // Landing Module
      {
        path: '',
        loadComponent: () =>
          import('./app/home/presentation/index/index.component').then(
            (c) => c.IndexComponent
          ),
      },
      {
        path: Index,
        loadComponent: () =>
          import('./app/home/presentation/index/index.component').then(
            (c) => c.IndexComponent
          ),
      },
      {
        path: JobPost,
        loadComponent: () =>
          import('./app/home/presentation/jobpost/jobpost.component').then(
            (c) => c.JobpostComponent
          ),
      },
      {
        path: AccountSetup,
        loadComponent: () =>
          import(
            './app/home/presentation/account-setup/account-setup.component'
          ).then((c) => c.AccountSetupComponent),
      },
      {
        path: Resume,
        loadComponent: () =>
          import('./app/home/presentation/resume/resume.component').then(
            (c) => c.ResumeComponent
          ),
      },
      {
        path: ResumeMaker,
        loadComponent: () =>
          import(
            './app/home/presentation/resume-maker/resume-maker.component'
          ).then((c) => c.ResumeMakerComponent),
      },
      {
        path: ManageFriend,
        loadComponent: () =>
          import(
            './app/home/presentation/manage-friend/manage-friend.component'
          ).then((c) => c.ManageFriendComponent),
      },
    ],
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule), //, AppRoutingModule, HomeModule
    AjaxService,
    iNavigation,
    JwtService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpIntercepter,
      multi: true,
    },
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
function customMatcher(name: string) {
  return (url) => {
    if (url[0].path.split(/\/(.*)/s)[0] == name) {
      return {
        consumed: url,
      };
    }
    return null;
  };
}
