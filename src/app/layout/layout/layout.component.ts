import { Component, DoCheck } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AccountSetup, Index, JobPost, ManageFriend, Resume } from 'src/providers/constants';
import { LoaderComponent } from '../loader/loader.component';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { NgClass } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [NavbarComponent, NgClass, SidemenuComponent, LoaderComponent, RouterOutlet]
})
export class LayoutComponent implements DoCheck {

  isIndexPage: boolean = false;
  isAccountSetup: boolean = false;

  constructor(private router: Router) {}

  ngDoCheck(): void {
    let route = this.router.url;
    if (route.includes(Index) || route.includes(JobPost) || route.includes(Resume) || route.includes(ManageFriend))
      this.isIndexPage = true;
    else
      this.isIndexPage = false;

    if (route.includes(AccountSetup))
      this.isAccountSetup = true;
    else
      this.isAccountSetup = false;
  }
}
