import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss'],
    standalone: true,
    imports: [FormsModule]
})
export class LandingpageComponent implements OnInit {

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

}
