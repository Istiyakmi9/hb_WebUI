import { Component, OnInit } from '@angular/core';
import { Toast, UserDetail } from 'src/providers/common.service';
import { iNavigation } from 'src/providers/iNavigation';
import { UserService } from 'src/providers/userService';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true
})
export class NavbarComponent implements OnInit {
  userName: string = null;

  constructor(private nav: iNavigation,
              private user: UserService) {}

  ngOnInit(): void {
    let currentUser = this.user.getInstance();
    if (currentUser && currentUser.FirstName) {
      this.userName = currentUser.FirstName;
    }
  }

  LogoutUser() {
    this.nav.logout();
    Toast("Log out successfully");
    this.nav.navigate("/", null);
  }
}
