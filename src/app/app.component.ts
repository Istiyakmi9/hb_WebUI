import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/providers/common.service';
import { iNavigation } from 'src/providers/iNavigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'open_jobs';
  pageName: string = "";
  navRouter: Subscription = null;

  constructor(private nav: iNavigation,
              private router: Router,
              private commonService: CommonService) {
    this.navRouter = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.pageName = event.url.replace("/", "")
        this.commonService.SetCurrentPageName(this.pageName);
        this.nav.manageLocalSessionKey(this.pageName);
        this.nav.pushRoute(this.pageName);
      }
    });
  }

  ngOnDestroy(): void {
    this.navRouter.unsubscribe();
  }

  closeToast() {
    document.getElementById("toast").classList.add("d-none");
    let $Toast = document.getElementById("toast");
    let $Error = document.getElementById("warning-box");
    let $Warning = document.getElementById("error-box");
    if ($Toast) {
      $Toast.classList.add("d-none");
      $Error.classList.add("d-none");
      $Warning.classList.add("d-none");
    }
  }

}
