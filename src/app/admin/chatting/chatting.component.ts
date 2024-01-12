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
  posts: Array<any> = [{
    PostId: 1,
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "Nikola Tesla inventions constitute numerous technological breakthroughs throughout his lifetime. Born in Smiljan, Croatia, in 1856, the math and physics genius contributed innovations that continue to impact our lives daily today. He held over three hundred patents, but was only recognized for some, indicating many of his ideas were tested and failed or never became well known. In 1882, upon graduation from the Technical University of Graz and Philosophy at the University of Prague, he drew the first sketches of his idea to build an electromagnetic motor. His first job entailed retailing DC power plants for ConEd which led to his immigration to the states in 1884.",
    PostImages: [ {
      ImageSrc: "assets/job/01.jpeg",
      Format: "image",
      ImageAlt: '1'
    }]
  }, {
    PostId: 2,
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "The electrical coil named for its inventor is one of Tesla's showiest inventions, and he used it to its full dramatic extent in demonstrations held in his New York City lab. The coil uses polyphase alternating currents -- another of Tesla's discoveries -- to create a transformer capable of producing very high voltages. It brought forth impressive crackling sparks and sheets of electric flame that impressed the electrically savvy and the layman alike. They're primarily used for entertainment today.",
    PostImages: [ {
      ImageSrc: "assets/job/01.jpeg",
      Format: "image",
      ImageAlt: '1'
    }, {
      ImageSrc: "assets/job/02.jpeg",
      Format: "image",
      ImageAlt: '2'
    }]
  }, {
    PostId: 3,
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "Tesla carried detailed plans for this AC motor in his head (a particular talent of his) until he could build a physical model the next year. The alternating current created magnetic poles that reversed themselves without mechanical aid, as DC motors required, and caused an armature (the revolving part of any electromechanical device) to whirl around the motor. This was his rotating magnetic field put into practice as a motor; within two years, he would use it in AC generators and transformers as well.",
    PostImages: [{
      ImageSrc: "assets/job/01.jpeg",
      Format: "image",
      ImageAlt: '1'
    }, {
      ImageSrc: "assets/job/02.jpeg",
      Format: "image",
      ImageAlt: '2'
    }, {
      ImageSrc: "assets/job/03.jpeg",
      Format: "image",
      ImageAlt: '3'
    }]
  }, {
    PostId: 4,
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "Tesla arrived in New York in 1884 and was hired as an engineer at Thomas Edison’s Manhattan headquarters. He worked there for a year, impressing Edison with his diligence and ingenuity. At one point Edison told Tesla he would pay $50,000 for an improved design for his DC dynamos. After months of experimentation, Tesla presented a solution and asked for the money. Edison demurred, saying, “Tesla, you don’t understand our American humor.” Tesla quit soon after.",
    PostImages: [{
      ImageSrc: "assets/job/01.jpeg",
      Format: "image",
      ImageAlt: '1'
    }, {
      ImageSrc: "assets/job/02.jpeg",
      Format: "image",
      ImageAlt: '2'
    }, {
      ImageSrc: "assets/job/03.jpeg",
      Format: "image",
      ImageAlt: '3'
    }, {
      ImageSrc: "assets/job/04.jpeg",
      Format: "image",
      ImageAlt: '4'
    }]
  }];
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
  imageIndex: number = 0;
  fileDetail: Array<any> = [];
  postJobForm: FormGroup;
  postJobDeatil: PostJobModal = new PostJobModal();
  postForm: any = null;
  profileURL: string = null;

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
    let currentUser = this.user.getInstance();
    if (currentUser && currentUser.Email) {
      let name = currentUser.Email.split("@");
      this.userName = name[0];
    }
    this.totalImageCount = this.posts.length;
    this.initForm();
    this.loadData();
  }

  loadData() {
    this.isPageReady = false;
    this.http.get("userposts/getAllUserPosts").then((res:ResponseModel) => {
      if (res.ResponseBody) {
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
        this.imageIndex = new Date().getTime();
        this.fileDetail.push({
          name: $`post_${this.imageIndex}`,
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
      this.imageIndex = new Date().getTime();
      this.fileDetail.push({
        name: $`profile_${this.imageIndex}`,
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
    $("#postJobModal").modal("show");
  }

  postPopup() {
    $("#postModal").modal("show");
  }

  get f() {
    return this.postJobForm.controls;
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
}
