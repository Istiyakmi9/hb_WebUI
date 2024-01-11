import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Dashboard } from 'src/providers/constants';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements DoCheck {

  isDashboard: boolean = false;

  constructor(private router: Router) {}

  ngDoCheck(): void {
    let route = this.router.url;
    if (route.includes(Dashboard))
      this.isDashboard = true;
    else
      this.isDashboard = false;
  }
}
