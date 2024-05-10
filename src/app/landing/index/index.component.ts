import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { UserService } from 'src/providers/userService';
import 'bootstrap';
import { iNavigation } from 'src/providers/iNavigation';
import { Dashboard, JobPost, ManageFriend, Profile, Resume, ResumeMaker } from 'src/providers/constants';
import { AjaxService } from 'src/providers/ajax.service';
import { ResponseModel } from 'src/auth/jwtService';
import { ErrorToast, ToLocateDate, Toast } from 'src/providers/common.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { autoCompleteModal } from 'src/app/util/iautocomplete/iautocomplete.component';
import { AllownumberDirective } from '../../util/directives/allownumber.directive';
import { IautocompleteComponent } from '../../util/iautocomplete/iautocomplete.component';
import { NgClass, NgStyle, UpperCasePipe, TitleCasePipe, DatePipe } from '@angular/common';
declare var $: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    animations: [
        trigger('animation', [
            transition('void => visible', [
                style({ transform: 'scale(0.5)' }),
                animate('150ms', style({ transform: 'scale(1)' }))
            ]),
            transition('visible => void', [
                style({ transform: 'scale(1)' }),
                animate('150ms', style({ transform: 'scale(0.5)' }))
            ]),
        ]),
        trigger('animation2', [
            transition(':leave', [
                style({ opacity: 1 }),
                animate('50ms', style({ opacity: 0.8 }))
            ])
        ])
    ],
    standalone: true,
    imports: [NgClass, NgStyle, FormsModule, ReactiveFormsModule, IautocompleteComponent, AllownumberDirective, UpperCasePipe, TitleCasePipe, DatePipe]
})
export class IndexComponent implements OnInit, AfterViewChecked {

  rightMenu: Array<any> = [{
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
  leftMenu: Array<any> = [{
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

  totalRecords: number = 0;
  totalPages: number = 0;
  isNextPageLoaded: boolean = false;
  posts: Array<any> = [];
  userName: string = null;
  postMessage: string = null;
  showCount: boolean = false;
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
  jobTypes: Array<any> = [];
  currentUser: any = null;
  uploadedFile: Array<any> = [];
  isFilesizeExceed: boolean = false;
  allJobType: Array<any> = [];
  selectedInterests: Array<number> = [];
  jobCategory: Array<any> = [{
    CategoryId: 1,
    CategoryName: "Blue Collar Job",
    JobType: "Electrician, Plumber, Fitter, Carpenter, Welder, Constrction Worker, Machine operator, Driver",
    ImgUrl: "assets/blue_collar.png"
  }, {
    CategoryId: 2,
    CategoryName: "Grey Collar Job",
    JobType: "Teachers, Chef, Firefighter, Engineers, School administrator, Police officers, Lab technicians",
    ImgUrl: "assets/grey_collar.png"
  }, {
    CategoryId: 3,
    CategoryName: "White Collar Job",
    JobType: "Accountant, Actuary, Architect, Doctor, Human Resources Manager, Information Security Analyst, Professor",
    ImgUrl: "assets/white_collar.png"
  }];
  page: number = 1;
  countryData: autoCompleteModal = null;
  currenciesData: autoCompleteModal = null;
  jobTypeData: autoCompleteModal = null;

  constructor(private user: UserService,
    private nav: iNavigation,
    private http: AjaxService,
    private fb: FormBuilder) { }

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
    if (this.currentUser && this.currentUser.FirstName) {
      if (this.currentUser.LastName)
        this.userName = this.currentUser.FirstName + " " + this.currentUser.LastName;
      else
        this.userName = this.currentUser.FirstName;
    }
    this.countryData = new autoCompleteModal();
    this.countryData.data = [];
    this.countryData.placeholder = "Select Country";
    this.countryData.className = "disable-field"; 
    this.currenciesData = new autoCompleteModal();
    this.currenciesData.data = [];
    this.currenciesData.placeholder = "Select Country";
    this.currenciesData.className = "disable-field"; 
    this.jobTypeData = new autoCompleteModal();
    this.jobTypeData.data = [];
    this.jobTypeData.placeholder = "Select Country";
    this.jobTypeData.className = "disable-field"; 
    this.posts = [];
    this.totalImageCount = this.posts.length;
    this.imgBaseUrl = environment.baseImgUrl;
    this.isPageReady = false;
    this.loadData();
  }

  navigateToResumeMaker() {
    this.nav.navigate(ResumeMaker, null);
  }

  bindData(res: any) {    
    if (res && res.length > 0) {
      this.totalRecords = res[0].TotalRecords;
      this.totalPages = parseInt((this.totalRecords / 10).toString()) + (this.totalRecords % 10 > 0 ? 1 : 0);
      res.forEach(x => {
        x.PostedOn = ToLocateDate(x.PostedOn);
        if (x.Files && x.Files.length > 0) {
          x.Files.forEach(y => {
            if (y.FilePath.includes(".jpg") || y.FilePath.includes(".png") || y.FilePath.includes(".jpeg") || y.FilePath.includes(".gif"))
              y.Format = "image"
            else
              y.Format = "video"

            y.FilePath = this.imgBaseUrl + y.FilePath;
          })
        }
      });

      this.posts = this.posts.concat(res);
    }
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
      ContractPeriodInMonths: new FormControl(this.postJobDeatil.ContractPeriodInMonths),
      JobRequirementId: new FormControl(this.postJobDeatil.JobRequirementId),
      JobCategoryId: new FormControl(this.postJobDeatil.JobCategoryId)
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
    if (event.toState === 'void') {
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
    if (this.currentIndex > this.currentImgSlide.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.currentImgSlide[this.currentIndex];
  }

  prev(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
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
        if (selectedfile[i].type.indexOf('image') > -1) {
          type = 'image';
        } else if (selectedfile[i].type.indexOf('video') > -1) {
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
      let totalFileSize = this.fileDetail.map(x => x.file.size).reduce((acc, curr) => { return acc + curr; }, 0) / (1024 * 1024);
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

  savePost() {
    if ((this.postMessage && this.postMessage != "") || this.previews.length > 0) {
      let postimg = [];
      if (this.previews.length > 0) {
        for (let i = 0; i < this.previews.length; i++) {
          postimg.push({
            ImageSrc: this.previews[i].Url,
            Format: this.previews[i].Format,
            ImageAlt: i + 1
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
    if (!this.postJobForm.get("IsForeignReturnCompulsory").value)
      this.postJobForm.get("MinimunDaysRequired").setValue(0);

    if (!this.postJobForm.get("IsOTIncluded").value)
      this.postJobForm.get("MaxOTHours").setValue(0);

    if (!this.postJobForm.get("IsHRAAllowance").value)
      this.postJobForm.get("HRAAllowanceAmount").setValue(0);

    if (!this.postJobForm.get("IsTravelAllowance").value)
      this.postJobForm.get("TravelAllowanceAmount").setValue(0);

    if (!this.postJobForm.get("IsFoodAllowance").value)
      this.postJobForm.get("FoodAllowanceAmount").setValue(0);

    if (this.postJobForm.valid && !this.isFilesizeExceed) {
      let formData = new FormData();
      if (this.fileDetail.length > 0) {
        for (let i = 0; i < this.fileDetail.length; i++) {
          formData.append("postImages", this.fileDetail[i].file)
        }
      }
      formData.append("userPost", JSON.stringify(this.postJobForm.value));
      let url = "";
      if (this.postJobForm.get("UserPostId").value == 0)
        url = "userposts/uploadUserPosts"
      else
        url = "userposts/updateUserPosts"

      this.http.post(url, formData).then(res => {
        if (res.ResponseBody) {
          this.posts = [];
          this.bindData(res.ResponseBody);
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

  getPostDetail(posiId: number) {
    this.isLoading = true;
    this.fileDetail = [];
    this.uploadedFile = [];
    this.http.get(`userposts/getUserPostByUserPostId/${posiId}`).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        if (res.ResponseBody.UserPost && res.ResponseBody.UserPost.length > 0) {
          this.postJobDeatil = res.ResponseBody.UserPost[0];
          if (this.postJobDeatil.FileDetail != null && this.postJobDeatil.FileDetail != "[]") {
            this.uploadedFile = JSON.parse(this.postJobDeatil.FileDetail);
            this.uploadedFile.forEach(y => {
              if (y.FilePath.includes(".jpg") || y.FilePath.includes(".png") || y.FilePath.includes(".jpeg") || y.FilePath.includes(".gif"))
                y.Format = "image"
              else
                y.Format = "video"

              y.FilePath = this.imgBaseUrl + y.FilePath;
            });
          }
        } else {
          this.postJobDeatil = new PostJobModal();
        }

        let contries = res.ResponseBody.Countries;
        this.countryData.data = [];
        this.currenciesData.data = [];
        contries.map(x => {
          this.countryData.data.push({
            value: x.Id,
            text: x.Name
          })
        });
        this.countryData.className="";
        let currencies = res.ResponseBody.Currencies;
        currencies.map(x => {
          this.currenciesData.data.push({
            value: x.Id,
            text: x.Currency
          })
        });
        this.currenciesData.className="";
        this.jobTypes = res.ResponseBody.JobTypes;
        if (this.postJobDeatil.JobCategoryId > 0) {
          let filterJobTypes = this.jobTypes.filter(x => x.CategoryId == this.postJobDeatil.JobCategoryId);
          filterJobTypes.map(x => {
            this.jobTypeData.data.push({
              value: x.JobTypeId,
              text: x.JobTypeName
            })
          })
          this.jobTypeData.className="";
          this.jobTypeData.isMultiSelect = true;
        }
        this.initForm();
        $("#postJobModal").modal("show");
        this.isLoading = false;
      }
    }).catch(e => {
      this.isLoading = false;
    })
  }

  gotoMainMenu() {
    this.nav.navigate(Dashboard, null);
  }

  postJobPopup() {
    this.getPostDetail(0);
  }

  postPopup() {
    $("#postModal").modal("show");
  }

  addLike(item) {
    this.isLoading = true;
    // let value = this.postJobForm.value;
    this.http.post("userposts/addLikedPost", item).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        Toast("liked details added");
        this.isLoading = false;
      }
    }).catch(e => {
      alert(e.message)
      this.isLoading = false;
    })

  }

  addApply(item) {
    this.isLoading = true;
    // let value = this.postJobForm.value;
    this.http.post("userposts/addAppliedPost", item).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        Toast("Applied details added");
        item.IsApplied = true;
        this.isLoading = false;
      }
    }).catch(e => {
      alert(e.message)
      this.isLoading = false;
    })

  }

  get f() {
    return this.postJobForm.controls;
  }

  fullTextView(e: any) {
    e.target.parentElement.previousElementSibling.classList.remove("description-container");
    e.target.classList.add('d-none');
  }

  reset() {
    this.postJobDeatil = new PostJobModal();
    this.initForm();
    this.isFilesizeExceed = false;
  }

  cleanFile() {
    this.fileDetail = [];
    this.isFilesizeExceed = false;
  }

  viewProfile() {
    this.nav.navigate(Profile, null);
  }

  addComment(e: any) {
    let elem = e.target.parentElement.parentElement.nextElementSibling.classList;
    if (elem.contains("d-none"))
      elem.remove("d-none");
  }

  enterComment(e: any) {
    let value = e.target.value;
    console.log(value);
    let elem = e.target.parentElement.parentElement.nextElementSibling.classList;
    if (value && value != "") {
      if (elem.contains("d-none"))
        elem.remove("d-none");
    } else {
      if (!elem.contains("d-none"))
        elem.remove("d-none");
    }
  }

  getMyPost() {
    this.nav.navigate(JobPost, null);
  }

  selectJobCategory(item: any) {
    this.postJobForm.get("JobCategoryId").setValue(item.CategoryId);
    let filterJobTypes = this.jobTypes.filter(x => x.CategoryId == item.CategoryId);
    if (filterJobTypes.length > 0) {
      this.jobTypeData = new autoCompleteModal();
      this.jobTypeData.data = [];
      // filterJobTypes.forEach(x => {
      //   this.jobTypeData.data.push({
      //     value: x.JobTypeId,
      //     text: x.JobTypeName
      //   })
      // })
    }
  }

  gotoResume() {
    this.nav.navigate(Resume, null);
  }

  navToAddFriend() {
    this.nav.navigate(ManageFriend, null);
  }

  async loadData() {
    this.http.get(`userposts/getHomePage/${this.page}`).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        this.bindData(res.ResponseBody);
        this.isPageReady = true;
        this.isNextPageLoaded = false;
        this.page++;
        Toast("Your application is ready now.");
      }
    }).catch(e => {
      this.isPageReady = true;
    })
  }

  // Listen for scroll events
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const bottomOffset = 900; // Adjust as needed
    let div: any = document.getElementById("main-container");
    const scrollPosition = div.scrollTop;
    const scrollHeight = div.scrollHeight;

    if (scrollPosition > scrollHeight - bottomOffset && !this.isNextPageLoaded && this.totalPages >= this.page) {
      // Load more data when scrolled to the bottom
      this.isNextPageLoaded = true;
      console.log("Loading page: " + this.page);
      this.loadData();
    }
  }

  selectJobType(e: any) {

  }

  deleteImgConformPopup(item: any) { }
}

interface Item {
  ImageSrc: string;
  ImageAlt: string;
  Format: string;
  FilePath?: string;
}

class PostJobModal {
  UserPostId: number = 0;
  JobRequirementId: number = 0;
  ShortDescription: string = null;
  CompleteDescription: string = null;
  CatagoryTypeId: number = 0;
  CountryId: number = 0;
  IsHRAAllowance: boolean = false;
  HRAAllowanceAmount: number = null;
  IsTravelAllowance: boolean = false;
  TravelAllowanceAmount: number = null;
  IsFoodAllowance: boolean = false;
  FoodAllowanceAmount: number = null;
  IsForeignReturnCompulsory: boolean = false;
  MinimunDaysRequired: number = null;
  MinimunCTC: number = 0;
  MaximunCTC: number = 0;
  IsOTIncluded: boolean = false;
  MaxOTHours: number = null;
  Bonus: number = 0;
  SalaryCurrency: string = null;
  MinAgeLimit: number = 0;
  MaxAgeLimit: number = 0;
  NoOfPosts: number = 0;
  ContractPeriodInMonths: number = 0;
  Files: Array<any> = [];
  FileDetail: string = null;
  JobCategoryId: number = 1;
}
