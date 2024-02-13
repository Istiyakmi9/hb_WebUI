import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSetup, Index, JobPost } from 'src/providers/constants';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements DoCheck {

  isIndexPage: boolean = false;
  isAccountSetup: boolean = false;

  constructor(private router: Router) {}

  ngDoCheck(): void {
    let route = this.router.url;
    if (route.includes(Index) || route.includes(JobPost))
      this.isIndexPage = true;
    else
      this.isIndexPage = false;

    if (route.includes(AccountSetup))
      this.isAccountSetup = true;
    else
      this.isAccountSetup = false;
  }
}
