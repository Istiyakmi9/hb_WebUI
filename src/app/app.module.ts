import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JoblistingComponent } from './joblisting/joblisting.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailComponent } from './blogdetail/blogdetail.component';
import { ElementsComponent } from './elements/elements.component';
import { JobdetailComponent } from './jobdetail/jobdetail.component';
import { iNavigation } from 'src/providers/iNavigation';
import { AjaxService } from 'src/providers/ajax.service';
import { JwtService } from 'src/auth/jwtService';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    JoblistingComponent,
    AboutComponent,
    ContactComponent,
    BlogComponent,
    BlogdetailComponent,
    ElementsComponent,
    JobdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    AjaxService,
    iNavigation,
    JwtService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
