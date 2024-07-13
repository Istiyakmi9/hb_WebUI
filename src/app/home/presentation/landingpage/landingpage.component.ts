import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss'],
    standalone: true,
    imports: [FormsModule, RouterLink]
})
export class LandingpageComponent implements OnInit {

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

}
