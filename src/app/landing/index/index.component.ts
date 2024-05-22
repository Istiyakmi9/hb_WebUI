import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewChecked,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { UserService } from 'src/providers/userService';
import 'bootstrap';
import { iNavigation } from 'src/providers/iNavigation';
import {
  Dashboard,
  JobPost,
  ManageFriend,
  Profile,
  Resume,
  ResumeMaker,
} from 'src/providers/constants';
import { AjaxService } from 'src/providers/ajax.service';
import { ResponseModel } from 'src/auth/jwtService';
import { ErrorToast, ToLocateDate, Toast } from 'src/providers/common.service';
import { environment } from 'src/environments/environment';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { autoCompleteModal } from 'src/app/util/iautocomplete/iautocomplete.component';
import { AllownumberDirective } from '../../util/directives/allownumber.directive';
import { IautocompleteComponent } from '../../util/iautocomplete/iautocomplete.component';
import {
  NgClass,
  NgStyle,
  UpperCasePipe,
  TitleCasePipe,
  DatePipe,
} from '@angular/common';
declare var $: any;

interface IJobCategory {
  categoryId: number;
  categoryName: string;
  jobType: string;
  imgUrl: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({ transform: 'scale(0.5)' }),
        animate('150ms', style({ transform: 'scale(1)' })),
      ]),
      transition('visible => void', [
        style({ transform: 'scale(1)' }),
        animate('150ms', style({ transform: 'scale(0.5)' })),
      ]),
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('50ms', style({ opacity: 0.8 })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
    IautocompleteComponent,
    AllownumberDirective,
    UpperCasePipe,
    TitleCasePipe,
    DatePipe,
  ],
})
export class IndexComponent implements OnInit, AfterViewChecked {
  rightMenu: Array<any> = [
    {
      Icon: 'fa-solid fa-users',
      Title: 'Post engagement',
      Detail: '',
      Total: 0,
    },
    {
      Icon: 'fa-solid fa-thumbs-up',
      Title: 'New Page likes',
      Detail: '',
      Total: 0,
    },
    {
      Icon: 'fa-solid fa-bullhorn',
      Title: 'Create promotion',
      Detail: '',
      Total: 0,
    },
  ];
  leftMenu: Array<any> = [
    {
      Icon: 'fa-solid fa-chart-column',
      Title: 'Ads Manager',
    },
    {
      Icon: 'fa-solid fa-bullhorn',
      Title: 'Ad Center',
    },
    {
      Icon: 'fa-solid fa-chart-pie',
      Title: 'Meta Business Suite',
    },
    {
      Icon: 'fa-solid fa-gauge',
      Title: 'Professional Dashboard',
    },
    {
      Icon: 'fa-solid fa-address-card',
      Title: 'Feeds',
    },
    {
      Icon: 'fa-solid fa-users-viewfinder',
      Title: 'Groups',
    },
    {
      Icon: 'fa-solid fa-file-video',
      Title: 'Video',
    },
    {
      Icon: 'fa-solid fa-clock-rotate-left',
      Title: 'Memories',
    },
    {
      Icon: 'fa-regular fa-bookmark',
      Title: 'Saved',
    },
    {
      Icon: 'fa-solid fa-flag',
      Title: 'Pages',
    },
    {
      Icon: 'fa-solid fa-calendar-check',
      Title: 'Events',
    },
  ];

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
  jobCategory: IJobCategory[] = [
    {
      categoryId: 1,
      categoryName: 'Blue Collar Job',
      jobType:
        'Electrician, Plumber, Fitter, Carpenter, Welder, Constrction Worker, Machine operator, Driver',
      imgUrl: 'assets/blue_collar.png',
    },
    {
      categoryId: 2,
      categoryName: 'Grey Collar Job',
      jobType:
        'Teachers, Chef, Firefighter, Engineers, School administrator, Police officers, Lab technicians',
      imgUrl: 'assets/grey_collar.png',
    },
    {
      categoryId: 3,
      categoryName: 'White Collar Job',
      jobType:
        'Accountant, Actuary, Architect, Doctor, Human Resources Manager, Information Security Analyst, Professor',
      imgUrl: 'assets/white_collar.png',
    },
  ];
  page: number = 1;
  countryData: autoCompleteModal = null;
  currenciesData: autoCompleteModal = null;
  jobTypeData: autoCompleteModal = null;
  days: Array<ShiftDays> = [];
  formStep: number = 1;
  otherDetailForm: FormGroup;
  salaryDetailForm: FormGroup;
  ExpWorkingForm: FormGroup;

  submitted: boolean = false;
  selectedJobType: number = 0;
  totalYears: Array<number> = [];
  totalMonths: Array<number> = [];
  selectedJobCategoryId: number = 1;
  jobTypeForm: FormGroup;

  constructor(
    private user: UserService,
    private nav: iNavigation,
    private http: AjaxService,
    private fb: FormBuilder
  ) {}

  ngAfterViewChecked(): void {
    $('[data-bs-toggle="tooltip"]').tooltip({
      trigger: 'hover',
    });

    $('[data-bs-toggle="tooltip"]').on('click', function () {
      $(this).tooltip('dispose');
    });
  }

  ngOnInit(): void {
    this.days = [
      { day: 'Monday', id: 1, isEnabled: false },
      { day: 'Tuesday', id: 2, isEnabled: false },
      { day: 'Wednesday', id: 3, isEnabled: false },
      { day: 'Thusday', id: 4, isEnabled: false },
      { day: 'Friday', id: 5, isEnabled: false },
      { day: 'Saturday', id: 6, isEnabled: false },
      { day: 'Sunday', id: 7, isEnabled: false },
    ];
    for (let i = 0; i <= 30; i++) {
      this.totalYears.push(i);
    }
    for (let i = 0; i <= 12; i++) {
      this.totalMonths.push(i);
    }
    this.imgBaseUrl = environment.baseImgUrl;

    this.currentUser = this.user.getInstance();
    if (this.currentUser && this.currentUser.firstName) {
      if (this.currentUser.LastName)
        this.userName =
          this.currentUser.firstName + ' ' + this.currentUser.lastName;
      else this.userName = this.currentUser.firstName;
    }
    if (this.currentUser.imageURL)
      this.profileURL = this.imgBaseUrl + this.currentUser.imageURL;

    this.countryData = new autoCompleteModal();
    this.countryData.data = [];
    this.countryData.placeholder = 'Select Country';
    this.countryData.className = 'disable-field';
    this.currenciesData = new autoCompleteModal();
    this.currenciesData.data = [];
    this.currenciesData.placeholder = 'Select Currency';
    this.currenciesData.className = 'disable-field';
    this.jobTypeData = new autoCompleteModal();
    this.jobTypeData.data = [];
    this.jobTypeData.placeholder = 'Select Country';
    this.jobTypeData.className = 'disable-field';
    this.posts = [];
    this.totalImageCount = this.posts.length;
    this.isPageReady = false;
    this.loadData();
  }

  navigateToResumeMaker() {
    this.nav.navigate(ResumeMaker, null);
  }

  bindData(res: any) {
    if (res && res.length > 0) {
      this.totalRecords = res[0].totalRecords;
      this.totalPages =
        parseInt((this.totalRecords / 10).toString()) +
        (this.totalRecords % 10 > 0 ? 1 : 0);
      res.forEach((x) => {
        x.postedOn = ToLocateDate(x.postedOn);
        if (x.files && x.files.length > 0) {
          x.files.forEach((y) => {
            if (y.filePath != null && y.filePath != '') {
              if (
                y.filePath.includes('.jpg') ||
                y.filePath.includes('.png') ||
                y.filePath.includes('.jpeg') ||
                y.filePath.includes('.gif')
              ) {
                y.format = 'image';
              } else {
                y.format = 'video';
              }

              y.filePath = this.imgBaseUrl + y.filePath;
            }
          });
        }
      });
      this.days.map((day) => (day.isEnabled = false));
      this.posts = this.posts.concat(res);
    }
  }

  initForm() {
    this.jobTypeForm = this.fb.group({
      userPostId: new FormControl(this.postJobDeatil.userPostId),
      completeDescription: new FormControl(
        this.postJobDeatil.completeDescription,
        [Validators.required]
      ),
      catagoryTypeId: new FormControl(this.postJobDeatil.catagoryTypeId, [
        Validators.required,
      ]),
      countryId: new FormControl(this.postJobDeatil.countryId, [
        Validators.required,
      ]),
      shortDescription: new FormControl(this.postJobDeatil.shortDescription, [
        Validators.required,
      ]),
      jobCategoryId: new FormControl(this.postJobDeatil.jobCategoryId),
    });

    this.salaryDetailForm = this.fb.group({
      minimumCTC: new FormControl(this.postJobDeatil.minimumCTC, [
        Validators.required,
      ]),
      maximumCTC: new FormControl(this.postJobDeatil.maximumCTC, [
        Validators.required,
      ]),
      bonus: new FormControl(this.postJobDeatil.bonus),
      isHRAAllowance: new FormControl(this.postJobDeatil.isHRAAllowance),
      hRAAllowanceAmount: new FormControl(
        this.postJobDeatil.hRAAllowanceAmount
      ),
      isTravelAllowance: new FormControl(this.postJobDeatil.isTravelAllowance),
      travelAllowanceAmount: new FormControl(
        this.postJobDeatil.travelAllowanceAmount
      ),
      isFoodAllowance: new FormControl(this.postJobDeatil.isFoodAllowance),
      foodAllowanceAmount: new FormControl(
        this.postJobDeatil.foodAllowanceAmount
      ),
      salaryCurrency: new FormControl(this.postJobDeatil.salaryCurrency, [
        Validators.required,
      ]),
      specialAllowance: new FormControl(this.postJobDeatil.specialAllowance),
    });

    this.ExpWorkingForm = this.fb.group({
      overseasExperience: new FormControl(
        this.postJobDeatil.overseasExperience
      ),
      overseasExpYrs: new FormControl(this.postJobDeatil.overseasExpYrs),
      overseasExpMonth: new FormControl(this.postJobDeatil.overseasExpMonth),
      localExperience: new FormControl(this.postJobDeatil.localExperience),
      localExpYrs: new FormControl(this.postJobDeatil.localExpYrs),
      localExpMonth: new FormControl(this.postJobDeatil.localExpMonth),
      dailyWorkingHours: new FormControl(this.postJobDeatil.dailyWorkingHours, [
        Validators.required,
      ]),
      shiftId: new FormControl(this.postJobDeatil.shiftId, [
        Validators.required,
      ]),
      isMon: new FormControl(false),
      isTue: new FormControl(false),
      isThu: new FormControl(false),
      isWed: new FormControl(false),
      isFri: new FormControl(false),
      isSat: new FormControl(false),
      isSun: new FormControl(false),
    });

    this.otherDetailForm = this.fb.group({
      minAgeLimit: new FormControl(this.postJobDeatil.minAgeLimit, [
        Validators.required,
      ]),
      maxAgeLimit: new FormControl(this.postJobDeatil.maxAgeLimit, [
        Validators.required,
      ]),
      isForeignReturnCompulsory: new FormControl(
        this.postJobDeatil.isForeignReturnCompulsory
      ),
      minimumDaysRequired: new FormControl(
        this.postJobDeatil.minimumDaysRequired
      ),
      isOTIncluded: new FormControl(this.postJobDeatil.isOTIncluded),
      maxOTHours: new FormControl(this.postJobDeatil.maxOTHours),
      visaType: new FormControl(this.postJobDeatil.visaType, [
        Validators.required,
      ]),
      isMedicalInsuranceProvide: new FormControl(
        this.postJobDeatil.isMedicalInsuranceProvide
      ),
      noOfPosts: new FormControl(this.postJobDeatil.noOfPosts, [
        Validators.required,
      ]),
      contractPeriodInMonths: new FormControl(
        this.postJobDeatil.contractPeriodInMonths,
        [Validators.required]
      ),
      jobTypeId: new FormControl(this.postJobDeatil.jobTypeId, [
        Validators.required,
      ]),
    });
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
    $('#uploadProfile').click();
  }

  fireBrowserFile() {
    $('#uploadPost').click();
  }

  uploadMessageImg(event: any) {
    if (event.target.files) {
      let selectedfile = event.target.files;
      for (let i = 0; i < selectedfile.length; i++) {
        const reader = new FileReader();
        var type = '';
        if (selectedfile[i].type.indexOf('image') > -1) {
          type = 'image';
        } else if (selectedfile[i].type.indexOf('video') > -1) {
          type = 'video';
        }
        let imageIndex = new Date().getTime() + i;
        reader.onload = (e: any) => {
          if (e.target.result.includes('image')) type = 'image';
          else type = 'video';
          this.previews.push({
            Url: e.target.result,
            format: type,
            Id: imageIndex,
          });
        };
        reader.readAsDataURL(selectedfile[i]);
        let file = <File>selectedfile[i];
        this.fileDetail.push({
          name: $`post_${imageIndex}`,
          file: file,
          id: imageIndex,
        });
      }
      let totalFileSize =
        this.fileDetail
          .map((x) => x.file.size)
          .reduce((acc, curr) => {
            return acc + curr;
          }, 0) /
        (1024 * 1024);
      if (totalFileSize > 6) this.isFilesizeExceed = true;
      else this.isFilesizeExceed = false;
    }
  }

  removePreviewImg(item: any) {
    if (item) {
      let previewIndex = this.previews.findIndex((x) => x.Id == item.Id);
      let fileIndex = this.fileDetail.findIndex((x) => x.id == item.Id);
      if (previewIndex > -1 && fileIndex > -1) {
        this.previews.splice(previewIndex, 1);
        this.fileDetail.splice(fileIndex, 1);
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
        file: file,
      });
      this.uploadProfileImage();
    }
  }

  uploadProfileImage() {
    if (this.fileDetail.length > 0) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append('userimage', this.fileDetail[0].file);
      this.http
        .post(`user/addUserImage/${this.currentUser.userId}`, formData)
        .then((res: ResponseModel) => {
          if (res.ResponseBody) {
            this.currentUser.imageURL = res.ResponseBody;
            this.user.setInstance(this.currentUser);
            Toast('Profile uploaded successfully');
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    }
  }

  savePost() {
    if (
      (this.postMessage && this.postMessage != '') ||
      this.previews.length > 0
    ) {
      let postimg = [];
      if (this.previews.length > 0) {
        for (let i = 0; i < this.previews.length; i++) {
          postimg.push({
            ImageSrc: this.previews[i].Url,
            format: this.previews[i].format,
            ImageAlt: i + 1,
          });
        }
      }

      this.posts.unshift({
        PostId: this.posts.length + 1,
        UserImage: 'assets/face.jpg',
        UserName: this.userName,
        PostedOn: new Date(),
        PostDetail: this.postMessage,
        PostImages: postimg,
      });
      $('#postModal').modal('hide');
      this.postMessage = null;
      this.previews = [];
    }
  }

  saveJobPost() {
    this.isLoading = true;
    if (this.otherDetailForm.valid && !this.isFilesizeExceed) {
      let formData = new FormData();
      if (this.fileDetail.length > 0) {
        for (let i = 0; i < this.fileDetail.length; i++) {
          formData.append('postImages', this.fileDetail[i].file);
        }
      }
      const value = {
        ...this.jobTypeForm.value,
        ...this.salaryDetailForm.value,
        ...this.otherDetailForm.value,
      };
      console.log(value);
      formData.append('userPost', JSON.stringify(value));
      let url = '';
      if (this.jobTypeForm.get('userPostId').value == 0)
        url = 'userposts/uploadUserPosts';
      else url = 'userposts/updateUserPosts';

      this.http
        .post(url, formData)
        .then((res) => {
          if (res.ResponseBody) {
            this.posts = [];
            this.bindData(res.ResponseBody);
            $('#postJobModal').modal('hide');
            Toast('Message posted successfully');
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    } else {
      ErrorToast('Please fill the mandatory filled');
    }
  }

  getPostDetail(posiId: number) {
    this.isLoading = true;
    this.fileDetail = [];
    this.uploadedFile = [];
    this.http
      .get(`userposts/getUserPostByUserPostId/${posiId}`)
      .then((res: ResponseModel) => {
        if (res.ResponseBody) {
          if (
            res.ResponseBody.UserPost &&
            res.ResponseBody.UserPost.length > 0
          ) {
            this.postJobDeatil = res.ResponseBody.UserPost[0];
            if (
              this.postJobDeatil.fileDetail != null &&
              this.postJobDeatil.fileDetail != '[]'
            ) {
              this.uploadedFile = JSON.parse(this.postJobDeatil.fileDetail);
              this.uploadedFile.forEach((y) => {
                if (
                  y.filePath.includes('.jpg') ||
                  y.filePath.includes('.png') ||
                  y.filePath.includes('.jpeg') ||
                  y.filePath.includes('.gif')
                )
                  y.format = 'image';
                else y.format = 'video';

                y.filePath = this.imgBaseUrl + y.filePath;
              });
            }
          } else {
            this.postJobDeatil = new PostJobModal();
          }

          let contries = res.ResponseBody.Countries;
          this.countryData.data = [];
          this.currenciesData.data = [];
          console.warn(this.currenciesData);

          contries.map((x) => {
            this.countryData.data.push({
              value: x.id,
              text: x.name,
            });
          });
          this.countryData.className = '';
          let currencies = res.ResponseBody.Currencies;
          currencies.map((x) => {
            this.currenciesData.data.push({
              value: x.id,
              text: x.name + ' ' + `(${x.code})`,
            });
          });
          this.currenciesData.className = '';
          this.jobTypes = res.ResponseBody.JobTypes;
          if (this.postJobDeatil.jobCategoryId > 0) {
            let filterJobTypes = this.jobTypes.filter(
              (x) => x.categoryId == this.postJobDeatil.jobCategoryId
            );
            filterJobTypes.map((x) => {
              this.jobTypeData.data.push({
                value: x.jobTypeId,
                text: x.jobTypeName,
              });
            });
            this.jobTypeData.className = '';
            this.jobTypeData.isMultiSelect = true;
          }
          let index = this.days.findIndex((x) => x.id == 7);
          if (index != -1) this.days[index].isEnabled = true;

          this.initForm();
          this.formStep = 1;
          this.previews = [];
          $('#postJobModal').modal('show');
          this.updateProgressbar();
          this.isLoading = false;
        }
      })
      .catch((e) => {
        this.isLoading = false;
      });
  }

  gotoMainMenu() {
    this.nav.navigate(Dashboard, null);
  }

  postJobPopup() {
    this.getPostDetail(0);
  }

  postPopup() {
    $('#postModal').modal('show');
  }

  addLike(item: any) {
    this.isLoading = true;
    this.http
      .post('userposts/addLikedPost', item)
      .then((res: ResponseModel) => {
        if (res.ResponseBody) {
          item.isLiked = true;
          Toast('Post liked successfully');
          this.isLoading = false;
        }
      })
      .catch((e) => {
        alert(e.message);
        this.isLoading = false;
      });
  }

  addApply(item) {
    this.isLoading = true;
    // let value = this.postJobForm.value;
    this.http
      .post('userposts/addAppliedPost', item)
      .then((res: ResponseModel) => {
        if (res.ResponseBody) {
          Toast('Applied details added');
          item.isApplied = true;
          this.isLoading = false;
        }
      })
      .catch((e) => {
        alert(e.message);
        this.isLoading = false;
      });
  }

  get jobTypeFormControl() {
    return this.jobTypeForm.controls;
  }

  get salaryDetailFormControl() {
    return this.salaryDetailForm.controls;
  }

  get otherDetailFormControl() {
    return this.otherDetailForm.controls;
  }

  get ExpWorkingFormControl() {
    return this.ExpWorkingForm.controls;
  }

  fullTextView(e: any) {
    e.target.parentElement.previousElementSibling.classList.remove(
      'description-container'
    );
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
    this.previews = [];
  }

  viewProfile() {
    this.nav.navigate(Profile, null);
  }

  addComment(e: any) {
    let elem =
      e.target.parentElement.parentElement.nextElementSibling.classList;
    if (elem.contains('d-none')) elem.remove('d-none');
  }

  enterComment(e: any) {
    let value = e.target.value;
    console.log(value);
    let elem =
      e.target.parentElement.parentElement.nextElementSibling.classList;
    if (value && value != '') {
      if (elem.contains('d-none')) elem.remove('d-none');
    } else {
      if (!elem.contains('d-none')) elem.remove('d-none');
    }
  }

  getMyPost() {
    this.nav.navigate(JobPost, null);
  }

  selectJobCategory(item: IJobCategory) {
    this.jobTypeForm.get('jobCategoryId').setValue(item.categoryId);
    this.selectedJobCategoryId = item.categoryId;
    let filterJobTypes = this.jobTypes.filter(
      (x) => x.categoryId == item.categoryId
    );
    if (filterJobTypes.length > 0) {
      this.jobTypeData = new autoCompleteModal();
      this.jobTypeData.data = [];
      filterJobTypes.forEach((x) => {
        this.jobTypeData.data.push({
          value: x.jobTypeId,
          text: x.jobTypeName,
        });
      });
    }
  }

  gotoResume() {
    this.nav.navigate(Resume, null);
  }

  navToAddFriend() {
    this.nav.navigate(ManageFriend, null);
  }

  async loadData() {
    this.http
      .get(`userposts/getHomePage/${this.page}`)
      .then((res: ResponseModel) => {
        if (res.ResponseBody) {
          this.bindData(res.ResponseBody);
          this.isPageReady = true;
          this.isNextPageLoaded = false;
          this.page++;
          Toast('Your application is ready now.');
        }
      })
      .catch((e) => {
        this.isPageReady = true;
      });
  }

  // Listen for scroll events
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const bottomOffset = 900; // Adjust as needed
    let div: any = document.getElementById('main-container');
    const scrollPosition = div.scrollTop;
    const scrollHeight = div.scrollHeight;

    if (
      scrollPosition > scrollHeight - bottomOffset &&
      !this.isNextPageLoaded &&
      this.totalPages >= this.page
    ) {
      // Load more data when scrolled to the bottom
      this.isNextPageLoaded = true;
      console.log('Loading page: ' + this.page);
      this.loadData();
    }
  }

  selectCatagoryType(e: any) {
    let value = e.value;
    console.log(value);
    // this.CatagoryTypeId
  }

  deleteImgConformPopup(item: any) {}

  allowWorkingHrs(e: any) {
    let value = e.target.value;
    if (value && Number(value) > 18) e.target.value = '18';
  }

  toggleDays(id: number, e: any) {
    let item = this.days.find((x) => x.id == id);
    // let index = this.selectedDays.findIndex(x => x.id == id);
    if (!item.isEnabled) {
      e.currentTarget
        .querySelector('i[name="selection-on"]')
        .classList.remove('d-none');
      e.currentTarget
        .querySelector('i[name="selection-off"]')
        .classList.add('d-none');
      e.currentTarget.classList.add('border-success');
      item.isEnabled = true;
    } else {
      e.currentTarget
        .querySelector('i[name="selection-on"]')
        .classList.add('d-none');
      e.currentTarget
        .querySelector('i[name="selection-off"]')
        .classList.remove('d-none');
      e.currentTarget.classList.remove('border-success');
      item.isEnabled = false;
    }
  }
  previousFormStemp() {
    if (this.formStep > 1) {
      this.formStep--;
      this.updateProgressbar();
    }
  }

  nextFormStem() {
    if (this.formStep < 6 && this.formStep > 0) {
      let errorCount = 0;
      this.submitted = true;
      if (this.formStep == 2) {
        if (this.jobTypeForm.invalid) errorCount++;
      } else if (this.formStep == 3) {
        if (!this.salaryDetailForm.get('isHRAAllowance').value)
          this.salaryDetailForm.get('hRAAllowanceAmount').setValue(0);

        if (!this.salaryDetailForm.get('isTravelAllowance').value)
          this.salaryDetailForm.get('travelAllowanceAmount').setValue(0);

        if (!this.salaryDetailForm.get('isFoodAllowance').value)
          this.salaryDetailForm.get('foodAllowanceAmount').setValue(0);

        if (
          Number(this.salaryDetailForm.get('minimumCTC').value) >
          Number(this.salaryDetailForm.get('maximumCTC').value)
        ) {
          errorCount++;
          ErrorToast('Maximum CTC must be greater than to Mininum CTC.');
          return;
        }
        if (this.salaryDetailForm.invalid) errorCount++;
      } else if (this.formStep == 4) {
        let overseasExp =
          Number(this.ExpWorkingForm.get('overseasExpYrs').value) * 12 +
          Number(this.ExpWorkingForm.get('overseasExpMonth').value);
        let localExp =
          Number(this.ExpWorkingForm.get('localExpYrs').value) * 12 +
          this.ExpWorkingForm.get('localExpMonth').value;
        this.ExpWorkingForm.get('overseasExperience').setValue(overseasExp);
        this.ExpWorkingForm.get('localExperience').setValue(localExp);
        if (this.ExpWorkingForm.invalid) errorCount++;
      } else if (this.formStep == 5) {
        if (!this.otherDetailForm.get('isForeignReturnCompulsory').value)
          this.otherDetailForm.get('minimumDaysRequired').setValue(0);

        if (!this.otherDetailForm.get('isOTIncluded').value)
          this.otherDetailForm.get('maxOTHours').setValue(0);

        if (
          Number(this.otherDetailForm.get('minAgeLimit').value) >
          Number(this.otherDetailForm.get('maxAgeLimit').value)
        ) {
          errorCount++;
          ErrorToast(
            'Maximum age limit must be greater than to Mininum age limit.'
          );
          return;
        }

        if (this.otherDetailForm.invalid) errorCount++;
      }

      if (errorCount != 0) {
        ErrorToast('Please fill all the mandatory filled.');
        return;
      }
      this.formStep++;
      this.updateProgressbar();
      this.submitted = false;
    }
  }

  previousStep(e: any) {
    let value = Number(e.currentTarget.getAttribute('data-index'));
    if (value < this.formStep) {
      this.formStep = value;
      this.updateProgressbar();
    }
  }

  updateProgressbar() {
    let elem = document.querySelectorAll('.progress-step');
    for (let i = 0; i < elem.length; i++) {
      if (i + 1 <= this.formStep) elem[i].classList.add('progress-step-active');
      else elem[i].classList.remove('progress-step-active');
    }

    let progress = document.getElementById('progress');
    const progressActive = document.querySelectorAll('.progress-step-active');
    progress.style.width =
      ((progressActive.length - 1) / (elem.length - 1)) * 100 + '%';
  }

  selectCurrency(id: number) {
    this.salaryDetailForm.get('salaryCurrency').setValue(id);
  }

  selectJobType(e: any) {
    this.selectedJobType = Number(e.target.value);
  }
}

interface Item {
  imageSrc: string;
  imageAlt: string;
  format: string;
  filePath?: string;
}

class PostJobModal {
  userPostId: number = 0;
  jobRequirementId: number = 0;
  shortDescription: string = null;
  completeDescription: string = null;
  catagoryTypeId: number = 0;
  countryId: number = 0;
  isHRAAllowance: boolean = false;
  hRAAllowanceAmount: number = null;
  isTravelAllowance: boolean = false;
  travelAllowanceAmount: number = null;
  isFoodAllowance: boolean = false;
  foodAllowanceAmount: number = null;
  isForeignReturnCompulsory: boolean = false;
  minimumDaysRequired: number = null;
  minimumCTC: number = null;
  maximumCTC: number = null;
  isOTIncluded: boolean = false;
  maxOTHours: number = null;
  bonus: number = 0;
  salaryCurrency: string = null;
  specialAllowance: number = 0;
  minAgeLimit: number = null;
  maxAgeLimit: number = null;
  noOfPosts: number = null;
  contractPeriodInMonths: number = 0;
  files: Array<any> = [];
  fileDetail: string = null;
  jobCategoryId: number = 1;
  dailyWorkingHours: number = null;
  shiftId: number = null;
  visaType: number = null;
  isMedicalInsuranceProvide: boolean = true;
  overseasExperience: number = 0;
  localExperience: number = 0;
  jobTypeId: number = null;
  overseasExpYrs: number = 0;
  overseasExpMonth: number = 0;
  localExpYrs: number = 0;
  localExpMonth: number = 0;
}

interface ShiftDays {
  day: string;
  id: number;
  isEnabled: boolean;
}
