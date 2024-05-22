import { Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { UserService } from 'src/providers/userService';
import { NgClass } from '@angular/common';
import { BreadcrumsComponent } from '../../common/breadcrums/breadcrums.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [BreadcrumsComponent, NgClass],
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  allJobType: Array<any> = [];
  selectedInterests: Array<number> = [];
  filterjobType: Array<any> = [];
  currentUser: any = null;
  isPageReady: boolean = false;

  constructor(private http: AjaxService, private user: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.user.getInstance();
    this.getJobType();
  }

  getJobType() {
    this.isLoading = true;
    this.isPageReady = false;
    this.http
      .get('userposts/getAllJobType')
      .then((res: ResponseModel) => {
        if (res.ResponseBody) {
          this.allJobType = res.ResponseBody;
          this.filterjobType = res.ResponseBody;
          this.isLoading = false;
          this.isPageReady = true;
        }
      })
      .catch((e) => {
        this.isLoading = false;
        this.isPageReady = true;
      });
  }

  addInterested() {
    if (this.selectedInterests.length > 0) {
      this.isLoading = true;
      this.http
        .post('user/updateUserInterest', this.selectedInterests)
        .then((res) => {
          if (res.ResponseBody) {
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    }
  }

  selectInterest(e: any) {
    let target = e.target.classList;
    let id = Number(e.target.getAttribute('data-value'));
    if (target.contains('active')) {
      target.remove('active');
      let index = this.selectedInterests.indexOf(id);
      this.selectedInterests.splice(index, 1);
    } else {
      target.add('active');
      this.selectedInterests.push(id);
    }
  }

  filterInterest(e: any) {
    let value = e.target.value;
    if (value && value != '') {
      this.filterjobType = this.allJobType.filter((x) =>
        x.JobTypeName.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      e.target.value = '';
      this.filterjobType = this.allJobType;
    }
  }

  resetFilter(e: any) {
    e.target.value = '';
  }
}
