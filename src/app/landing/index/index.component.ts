import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { UserService } from 'src/providers/userService';
import 'bootstrap';
import { iNavigation } from 'src/providers/iNavigation';
import { Dashboard, Profile } from 'src/providers/constants';
import { AjaxService } from 'src/providers/ajax.service';
import { ResponseModel } from 'src/auth/jwtService';
import { ToLocateDate, Toast } from 'src/providers/common.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({transform: 'scale(0.5)'}),
        animate('150ms', style({transform: 'scale(1)'}))
      ]),
      transition('visible => void', [
        style({transform: 'scale(1)'}),
        animate('150ms', style({transform: 'scale(0.5)'}))
      ]),
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({opacity: 1}),
        animate('50ms', style({opacity: 0.8}))
      ])
    ])
  ]
})
export class IndexComponent implements OnInit, AfterViewChecked {

  rightMenu: Array<any> =[{
    Icon: "fa-solid fa-earth-americas",
    Title: "Post reach",
    Detail: "",
    Total: 0
  }, {
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
  leftMenu: Array<any> =[{
    Icon: "fa-solid fa-chart-column",
    Title: "Ads Manager",
  }, {
    Icon: "fa-solid fa-bullhorn",
    Title: "Ad Center",
  }, {
    Icon: "fa-solid fa-chart-pie",
    Title: "Meta Business Suite",
  }, {
    Icon: "fa-solid fa-gauge",
    Title: "Professional Dashboard",
  }, {
    Icon: "fa-solid fa-address-card",
    Title: "Feeds",
  }, {
    Icon: "fa-solid fa-users-viewfinder",
    Title: "Groups",
  }, {
    Icon: "fa-solid fa-file-video",
    Title: "Video",
  }, {
    Icon: "fa-solid fa-clock-rotate-left",
    Title: "Memories",
  }, {
    Icon: "fa-regular fa-bookmark",
    Title: "Saved",
  }, {
    Icon: "fa-solid fa-flag",
    Title: "Pages",
  }, {
    Icon: "fa-solid fa-calendar-check",
    Title: "Events",
  }];
  posts: Array<any> = [];
  userName: string = null;
  showCount:boolean = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage: Item = this.posts[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;
  currentImgSlide: Array<any> = [];
  previews: Array<any> = [];
  isPageReady: boolean = false;
  isLoading: boolean = false;
  fileDetail: Array<any> = [];
  profileURL: string = null;
  imgBaseUrl: string = null;
  currentUser: any = null;
  isFilesizeExceed: boolean = false;

  constructor(private user: UserService,
              private nav: iNavigation,
              private http: AjaxService) {}

  ngAfterViewChecked(): void {
    $('[data-bs-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });

    $('[data-bs-toggle="tooltip"]').on('click', function () {
      $(this).tooltip('dispose');
    });
  }

  ngOnInit(): void {
    this.currentUser = this.user.getInstance();
    if (this.currentUser && this.currentUser.Email) {
      let name = this.currentUser.Email.split("@");
      this.userName = name[0];
    }
    this.totalImageCount = this.posts.length;
    this.imgBaseUrl = environment.baseImgUrl;
    this.loadData();
  }

  loadData() {
    this.isPageReady = false;
    this.http.get("userposts/getAllUserPosts").then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.bindData(res.ResponseBody);
        this.isPageReady = true;
        Toast("Page loaded");
      }
    }).catch(e => {
      this.isPageReady = true;
    })
  }

  bindData(res: any) {
    this.posts = res;
    if (this.posts) {
      this.posts.forEach(x => {
        x.PostedOn = ToLocateDate(x.PostedOn);
        if (x.Files && x.Files.length > 0) {
          x.Files.forEach(y => {
            if (y.FilePath.includes(".jpg") || y.FilePath.includes(".png") || y.FilePath.includes(".jpeg"))
              y.Format = "image"
            else
              y.Format = "video"

            y.FilePath = this.imgBaseUrl + y.FilePath;
          })
        }
      })
    }
  }

  onPreviewImage(index: number, img: any): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentImgSlide = img;
    this.currentLightboxImage = this.currentImgSlide[index];
  }

  onAnimationEnd(event: any) {
    if(event.toState === 'void') {
      this.showMask = false;
    }
  }

  onClosePreview() {
    this.previewImage = false;
  }

  next(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.currentIndex = this.currentIndex + 1;
    if(this.currentIndex > this.currentImgSlide.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.currentImgSlide[this.currentIndex];
  }

  prev(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.currentIndex = this.currentIndex - 1;
    if(this.currentIndex < 0) {
      this.currentIndex = this.currentImgSlide.length - 1;
    }
    this.currentLightboxImage = this.currentImgSlide[this.currentIndex];
  }

  profilefireBrowser() {
    $("#uploadProfile").click();
  }

  fireBrowserFile() {
    $("#uploadPost").click();
  }

  uploadMessageImg(event: any) {
    if (event.target.files) {
      let selectedfile = event.target.files;
      for (let i = 0; i < selectedfile.length; i++) {
        const reader = new FileReader();
        var type = "";
        if(selectedfile[i].type.indexOf('image')> -1){
          type = 'image';
        } else if(selectedfile[i].type.indexOf('video')> -1){
          type = 'video';
        }
        reader.onload = (e: any) => {
          this.previews.push({
            Url: e.target.result,
            Format: type
          });
        };
        reader.readAsDataURL(selectedfile[i]);
        let file = <File>selectedfile[i];
        let imageIndex = new Date().getTime();
        this.fileDetail.push({
          name: $`post_${imageIndex}`,
          file: file
        });
      }
      let totalFileSize = this.fileDetail.map(x => x.file.size).reduce((acc, curr)=> {return acc+curr;}, 0)/(1024*1024);
      if (totalFileSize > 6)
        this.isFilesizeExceed = true;
      else
        this.isFilesizeExceed = false;
    }
  }

  uploadProfileImg(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.profileURL = event.target.result;
      };
      let selectedfile = event.target.files;
      let file = <File>selectedfile[0];
      let imageIndex = new Date().getTime();
      this.fileDetail.push({
        name: $`profile_${imageIndex}`,
        file: file
      });
    }
  }

  gotoMainMenu() {
    this.nav.navigate(Dashboard, null);
  }

  fullTextView(e: any) {
    e.target.parentElement.previousElementSibling.classList.remove("description-container");
    e.target.classList.add('d-none');
  }

  viewProfile() {
    this.nav.navigate(Profile, null);
  }
}

interface Item {
  ImageSrc: string;
  ImageAlt: string;
}
