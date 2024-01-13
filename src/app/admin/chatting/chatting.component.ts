import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { UserService } from 'src/providers/userService';
import 'bootstrap';
import { iNavigation } from 'src/providers/iNavigation';
import { Dashboard } from 'src/providers/constants';
import { AjaxService } from 'src/providers/ajax.service';
import { ResponseModel } from 'src/auth/jwtService';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss'],
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
export class ChattingComponent implements OnInit, AfterViewChecked {

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
  postMessage: string = null;
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
  postJobForm: FormGroup;
  postJobDeatil: PostJobModal = new PostJobModal();
  postForm: any = null;
  profileURL: string = null;
  imgBaseUrl: string = null;
  contries: Array<any> = [];
  currencies: Array<any> = [];
  currentUser: any = null;

  constructor(private user: UserService,
              private nav: iNavigation,
              private http: AjaxService,
              private fb: FormBuilder) {}

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
    this.initForm();
    this.loadData();
  }

  loadData() {
    this.isPageReady = false;
    this.http.get("userposts/getAllUserPosts").then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.posts = res.ResponseBody;
        if (this.posts) {
          this.posts.forEach(x => {
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
        console.log(this.posts)
        this.isPageReady = true;
        Toast("Page loaded");
      }
    }).catch(e => {
      this.isPageReady = true;
    })
  }

  initForm() {
    this.postJobForm = this.fb.group({
      UserPostId: new FormControl(this.postJobDeatil.UserPostId),
      ShortDescription: new FormControl(this.postJobDeatil.ShortDescription),
      CompleteDescription: new FormControl(this.postJobDeatil.CompleteDescription),
      CatagoryTypeId: new FormControl(this.postJobDeatil.CatagoryTypeId),
      CountryId: new FormControl(this.postJobDeatil.CountryId),
      IsHRAAllowance: new FormControl(this.postJobDeatil.IsHRAAllowance),
      HRAAllowanceAmount: new FormControl(this.postJobDeatil.HRAAllowanceAmount),
      IsTravelAllowance: new FormControl(this.postJobDeatil.IsTravelAllowance),
      TravelAllowanceAmount: new FormControl(this.postJobDeatil.TravelAllowanceAmount),
      IsFoodAllowance: new FormControl(this.postJobDeatil.IsFoodAllowance),
      FoodAllowanceAmount: new FormControl(this.postJobDeatil.FoodAllowanceAmount),
      IsForeignReturnCompulsory: new FormControl(this.postJobDeatil.IsForeignReturnCompulsory),
      MinimunDaysRequired: new FormControl(this.postJobDeatil.MinimunDaysRequired),
      MinimunCTC: new FormControl(this.postJobDeatil.MinimunCTC),
      MaximunCTC: new FormControl(this.postJobDeatil.MaximunCTC),
      IsOTIncluded: new FormControl(this.postJobDeatil.IsOTIncluded),
      MaxOTHours: new FormControl(this.postJobDeatil.MaxOTHours),
      Bonus: new FormControl(this.postJobDeatil.Bonus),
      SalaryCurrency: new FormControl(this.postJobDeatil.SalaryCurrency),
      MinAgeLimit: new FormControl(this.postJobDeatil.MinAgeLimit),
      MaxAgeLimit: new FormControl(this.postJobDeatil.MaxAgeLimit),
      NoOfPosts: new FormControl(this.postJobDeatil.NoOfPosts),
      ContractPeriodInMonths: new FormControl(this.postJobDeatil.ContractPeriodInMonths)
    })
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

  savePost() {
    if ((this.postMessage && this.postMessage != "") || this.previews.length > 0) {
      let postimg = [];
      if (this.previews.length > 0) {
        for (let i = 0; i < this.previews.length; i++) {
          postimg.push({
            ImageSrc: this.previews[i].Url,
            Format: this.previews[i].Format,
            ImageAlt: i+1
          })
        }
      }

      this.posts.unshift({
        PostId: this.posts.length + 1,
        UserImage: "assets/face.jpg",
        UserName: this.userName,
        PostedOn: new Date(),
        PostDetail: this.postMessage,
        PostImages: postimg
      });
      $("#postModal").modal("hide");
      this.postMessage = null;
      this.previews = [];
    }
  }

  saveJobPost() {
    this.isLoading = true;
    if (this.postJobForm.valid) {
      let formData = new FormData();
      if (this.fileDetail.length > 0) {
        for (let i = 0; i < this.fileDetail.length; i++) {
          formData.append("postImages", this.fileDetail[i].file)
        }
      }
      formData.append("userPost", JSON.stringify(this.postJobForm.value));
      this.http.post("userposts/uploadUserPosts", formData).then(res => {
        if (res.ResponseBody) {
          $("#postJobModal").modal("hide");
          Toast("Message posted successfully");
          this.isLoading = false;
        }
      }).catch(e => {
        this.isLoading = false;
      })
    } else {
      ErrorToast("Please fill the mandatory filled");
    }
  }

  eidtPost(item: any) {
    this.isLoading = true;
    if (item && item.UserPostId > 0) {
      this.http.get(`userposts/getUserPostByUserPostId/${item.UserPostId}`).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          if (res.ResponseBody.UserPost && res.ResponseBody.UserPost.length > 0) {
            this.postJobDeatil = res.ResponseBody.UserPost[0];
            if (this.postJobDeatil.FileDetail != null && this.postJobDeatil.FileDetail != "[]")
              this.fileDetail = JSON.parse(this.postJobDeatil.FileDetail);
          }

          this.contries = res.ResponseBody.Countries;
          this.currencies = res.ResponseBody.currencies;
          this.initForm();
          $("#postJobModal").modal("show");
          this.isLoading = false;
        }
      }).catch(e => {
        this.isLoading = false;
      })
    }
  }

  deletePost(item: any) {
    if (item) {
      this.posts = this.posts.filter(x => x.PostId != item.PostId);
      // this.http.get(``).then(res => {
      //   if (res.ResponseBody) {
      //     Toast("Post deleted successfully");
      //     this.isLoading = false;
      //   }
      // }).catch(e => {
      //   this.isLoading = false;
      // })
    }
  }

  gotoMainMenu() {
    this.nav.navigate(Dashboard, null);
  }

  postJobPopup() {
    this.postJobDeatil = new PostJobModal();
    this.initForm();
    $("#postJobModal").modal("show");
  }

  postPopup() {
    $("#postModal").modal("show");
  }

  get f() {
    return this.postJobForm.controls;
  }

  fullTextView(e: any) {
    e.target.parentElement.previousElementSibling.classList.remove("description-container");
    e.target.classList.add('d-none');
  }

  reset() {
    this.postJobForm.reset();
  }
}

interface Item {
  ImageSrc: string;
  ImageAlt: string;
}

class PostJobModal {
  UserPostId: number = 0;
  ShortDescription: string = null;
  CompleteDescription: string = null;
  CatagoryTypeId: number = 0;
  CountryId: number = 0;
  IsHRAAllowance: boolean = false;
  HRAAllowanceAmount: number = 0;
  IsTravelAllowance: boolean = false;
  TravelAllowanceAmount: number = 0;
  IsFoodAllowance: boolean = false;
  FoodAllowanceAmount: number = 0;
  IsForeignReturnCompulsory: boolean = false;
  MinimunDaysRequired: number = 0;
  MinimunCTC: number = 0;
  MaximunCTC: number = 0;
  IsOTIncluded: boolean = false;
  MaxOTHours: number = 0;
  Bonus: number = 0;
  SalaryCurrency: string = null;
  MinAgeLimit: number = 0;
  MaxAgeLimit: number = 0;
  NoOfPosts: number = 0;
  ContractPeriodInMonths: number = 0;
  Files: Array<any> = [];
  FileDetail: string = null;
}
