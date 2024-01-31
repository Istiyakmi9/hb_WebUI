import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Chatting, Index } from 'src/providers/constants';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements DoCheck {

  isIndexPage: boolean = false;

  constructor(private router: Router) {}

  ngDoCheck(): void {
    let route = this.router.url;
    if (route.includes(Index))
      this.isIndexPage = true;
    else
      this.isIndexPage = false;
  }
}
