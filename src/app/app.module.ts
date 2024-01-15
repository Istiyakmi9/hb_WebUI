import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { iNavigation } from 'src/providers/iNavigation';
import { AjaxService } from 'src/providers/ajax.service';
import { JwtService } from 'src/auth/jwtService';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppHttpIntercepter } from 'src/auth/app.intercepter';
import { ToastComponent } from './toast/toast.component';
import { HomeModule } from './home/home.module';
import { UserService } from 'src/providers/userService';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule
  ],
  providers: [
    AjaxService,
    iNavigation,
    JwtService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpIntercepter,
      multi: true
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
