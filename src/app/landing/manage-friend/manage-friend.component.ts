import { Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { Toast } from 'src/providers/common.service';
import { Index } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { UserService } from 'src/providers/userService';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-manage-friend',
    templateUrl: './manage-friend.component.html',
    styleUrls: ['./manage-friend.component.scss'],
    standalone: true,
    imports: [TitleCasePipe]
})
export class ManageFriendComponent implements OnInit {

  rightMenu: Array<any> =[{
    Icon: "fa-solid fa-users",
    Title: "Post engagement",
    Detail: "",
    Total: 0
  }, {
    Icon: "fa-solid fa-thumbs-up",
    Title: "New Page likes",
    Detail: "",
    Total: 0
  }, {
    Icon: "fa-solid fa-bullhorn",
    Title: "Create promotion",
    Detail: "",
    Total: 0
  }];
  currentUser: any = null;
  isPageReady: boolean = false;
  userName: string = null;
  friendList: Array <any> = [];
  filterFriendList: Array <any> = [];
  page: number = 1;

  constructor( private nav: iNavigation,
               private user: UserService,
               private http: AjaxService) {}

  ngOnInit(): void {
    this.currentUser = this.user.getInstance();
    if (this.currentUser && this.currentUser.firstName) {
      this.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
    }
    this.loadData();
  }

  loadData() {
    this.isPageReady = false;
    this.friendList= [];
    this.http.get("user/getFriends").then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.friendList = res.ResponseBody;
        this.filterFriendList = res.ResponseBody;
        this.filterFriendList.forEach(x => {
          x.isFriend = true;
        });
        this.isPageReady = true;
      }
    }).catch(e => {
      this.isPageReady = true;
    })
  }

  goToHome() {
    this.nav.navigate(Index, null);
  }

  filterFriend(e: any) {
    let value = e.target.value;
    if (value && value != "") {
      let data = {
        SearchString: value,
        PageIndex: this.page,
        PageSize: 10
      }
      this.http.post("user/filterFriend", data).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.filterFriendList = res.ResponseBody;
          if (this.filterFriendList.length > 0) {
            this.filterFriendList = this.filterFriendList.filter(x => x.userId != this.currentUser.userId);
            this.filterFriendList.forEach(x => {
              if (this.friendList.length > 0) {
                let existUser = this.friendList.find(i => i.userId == x.userId);
                if (existUser != null)
                  x.isFriend = true;
                else
                  x.isFriend = false;
              } else {
                x.isFriend = false;
              }
            })
          }
        }
      })
    } else {
      this.resetFilter(e);
    }
  }

  resetFilter(e: any) {
    e.target.value = "";
    this.loadData();
  }

  addFriend(item: any) {
    if (item) {
      this.http.get(`user/manageFriend/${item.userId}`).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          Toast(res.ResponseBody);
        }
      })
    }
  }
}
