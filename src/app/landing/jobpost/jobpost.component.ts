import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { autoCompleteModal } from 'src/app/util/iautocomplete/iautocomplete.component';
import { ResponseModel } from 'src/auth/jwtService';
import { environment } from 'src/environments/environment';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, ToLocateDate, Toast } from 'src/providers/common.service';
import { Dashboard, Index, Profile } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { UserService } from 'src/providers/userService';
import { AllownumberDirective } from '../../util/directives/allownumber.directive';
import { IautocompleteComponent } from '../../util/iautocomplete/iautocomplete.component';
import { NgStyle, NgClass, TitleCasePipe, DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-jobpost',
  templateUrl: './jobpost.component.html',
  styleUrls: ['./jobpost.component.scss'],
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
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    IautocompleteComponent,
    AllownumberDirective,
    TitleCasePipe,
    DatePipe,
  ],
})
export class JobpostComponent implements OnInit, AfterViewChecked {
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
  // postJobForm: FormGroup;
  postJobDeatil: PostJobModal = new PostJobModal();

  postJobForm = this.initTypedForm();

  postForm: any = null;
  profileURL: string = null;
  imgBaseUrl: string = null;
  contries: Array<any> = [];
  currencies: Array<any> = [];
  jobTypes: Array<any> = [];
  filterJobTypes: Array<any> = [];
  currentUser: any = null;
  selectedImage: any = null;
  uploadedFile: Array<any> = [];
  isFilesizeExceed: boolean = false;
  jobCategory: Array<any> = [
    {
      CategoryId: 1,
      CategoryName: 'Blue Collar Job',
      JobType:
        'Electrician, Plumber, Fitter, Carpenter, Welder, Constrction Worker, Machine operator, Driver',
      ImgUrl: 'assets/blue_collar.png',
    },
    {
      CategoryId: 2,
      CategoryName: 'Grey Collar Job',
      JobType:
        'Teachers, Chef, Firefighter, Engineers, School administrator, Police officers, Lab technicians',
      ImgUrl: 'assets/grey_collar.png',
    },
    {
      CategoryId: 3,
      CategoryName: 'White Collar Job',
      JobType:
        'Accountant, Actuary, Architect, Doctor, Human Resources Manager, Information Security Analyst, Professor',
      ImgUrl: 'assets/white_collar.png',
    },
  ];
  countryData: autoCompleteModal = null;
  currenciesData: autoCompleteModal = null;

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
    this.currentUser = this.user.getInstance();
    if (this.currentUser && this.currentUser.FirstName) {
      this.userName =
        this.currentUser.FirstName + ' ' + this.currentUser.LastName;
    }
    this.totalImageCount = this.posts.length;
    this.imgBaseUrl = environment.baseImgUrl;
    this.countryData = new autoCompleteModal();
    this.countryData.data = [];
    this.countryData.placeholder = 'Select Country';
    this.countryData.className = 'disable-field';
    this.currenciesData = new autoCompleteModal();
    this.currenciesData.data = [];
    this.currenciesData.placeholder = 'Select Country';
    this.currenciesData.className = 'disable-field';
    this.loadData();
  }

  loadData() {
    this.isPageReady = false;
    this.http
      .get(`userposts/getPostByUserId/${this.currentUser.userId}`)
      .then((res: ResponseModel) => {
        if (res.ResponseBody) {
          this.bindData(res.ResponseBody);
          this.isPageReady = true;
        }
      })
      .catch((e) => {
        this.isPageReady = true;
      });
  }

  bindData(res: any) {
    this.posts = [];
    this.posts = res;
    if (this.posts) {
      this.posts.forEach((x) => {
        x.PostedOn = ToLocateDate(x.PostedOn);
        if (x.Files && x.Files.length > 0) {
          x.Files.forEach((y) => {
            if (
              y.FilePath.includes('.jpg') ||
              y.FilePath.includes('.png') ||
              y.FilePath.includes('.jpeg') ||
              y.FilePath.includes('.gif')
            )
              y.Format = 'image';
            else y.Format = 'video';

            y.FilePath = this.imgBaseUrl + y.FilePath;
          });
        }
      });
    }
  }

  initTypedForm() {
    return this.fb.group({
      userPostId: new FormControl(this.postJobDeatil.userPostId),
      shortDescription: new FormControl(this.postJobDeatil.shortDescription),
      completeDescription: new FormControl(
        this.postJobDeatil.completeDescription
      ),
      catagoryTypeId: new FormControl(this.postJobDeatil.catagoryTypeId),
      countryId: new FormControl(this.postJobDeatil.countryId),
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
      isForeignReturnCompulsory: new FormControl(
        this.postJobDeatil.isForeignReturnCompulsory
      ),
      minimumDaysRequired: new FormControl(
        this.postJobDeatil.minimumDaysRequired
      ),
      minimumCTC: new FormControl(this.postJobDeatil.minimumCTC),
      maximumCTC: new FormControl(this.postJobDeatil.maximumCTC),
      isOTIncluded: new FormControl(this.postJobDeatil.isOTIncluded),
      maxOTHours: new FormControl(this.postJobDeatil.maxOTHours),
      bonus: new FormControl(this.postJobDeatil.bonus),
      salaryCurrency: new FormControl(this.postJobDeatil.salaryCurrency),
      minAgeLimit: new FormControl(this.postJobDeatil.minAgeLimit),
      maxAgeLimit: new FormControl(this.postJobDeatil.maxAgeLimit),
      noOfPosts: new FormControl(this.postJobDeatil.noOfPosts),
      contractPeriodInMonths: new FormControl(
        this.postJobDeatil.contractPeriodInMonths
      ),
      jobRequirementId: new FormControl(this.postJobDeatil.jobRequirementId),
      jobCategoryId: new FormControl(this.postJobDeatil.jobCategoryId),
    });
  }

  initForm() {
    this.postJobForm.patchValue(this.postJobDeatil);
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
        reader.onload = (e: any) => {
          this.previews.push({
            Url: e.target.result,
            Format: type,
          });
        };
        reader.readAsDataURL(selectedfile[i]);
        let file = <File>selectedfile[i];
        let imageIndex = new Date().getTime();
        this.fileDetail.push({
          name: $`post_${imageIndex}`,
          file: file,
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
            Format: this.previews[i].Format,
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
    if (!this.postJobForm.value.isForeignReturnCompulsory)
      this.postJobForm.value.minimumDaysRequired = 0;

    if (!this.postJobForm.value.isOTIncluded)
      this.postJobForm.value.maxOTHours = 0;

    if (!this.postJobForm.value.isHRAAllowance)
      this.postJobForm.value.hRAAllowanceAmount = 0;

    if (!this.postJobForm.value.isTravelAllowance)
      this.postJobForm.value.travelAllowanceAmount = 0;

    if (!this.postJobForm.value.isFoodAllowance)
      this.postJobForm.value.foodAllowanceAmount = 0;

    if (this.postJobForm.valid && !this.isFilesizeExceed) {
      let formData = new FormData();
      if (this.fileDetail.length > 0) {
        for (let i = 0; i < this.fileDetail.length; i++) {
          formData.append('postImages', this.fileDetail[i].file);
        }
      }
      formData.append('userPost', JSON.stringify(this.postJobForm.value));
      let url = '';
      if (this.postJobForm.get('UserPostId').value == 0)
        url = 'userposts/uploadUserPosts';
      else url = 'userposts/updateUserPosts';

      this.http
        .post(url, formData)
        .then((res) => {
          if (res.ResponseBody) {
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

  eidtPost(item: any) {
    if (item && item.UserPostId > 0) {
      this.getPostDetail(item.UserPostId);
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
                  y.FilePath.includes('.jpg') ||
                  y.FilePath.includes('.png') ||
                  y.FilePath.includes('.jpeg') ||
                  y.FilePath.includes('.gif')
                )
                  y.Format = 'image';
                else y.Format = 'video';

                y.FilePath = this.imgBaseUrl + y.FilePath;
              });
            }
          } else {
            this.postJobDeatil = new PostJobModal();
          }

          let contries = res.ResponseBody.Countries;
          this.countryData.data = [];
          this.currenciesData.data = [];
          contries.map((x) => {
            this.countryData.data.push({
              value: x.Id,
              text: x.Name,
            });
          });
          this.countryData.className = '';
          let currencies = res.ResponseBody.Currencies;
          currencies.map((x) => {
            this.currenciesData.data.push({
              value: x.Id,
              text: x.Currency,
            });
          });
          this.currenciesData.className = '';
          this.jobTypes = res.ResponseBody.JobTypes;
          if (this.postJobDeatil.jobCategoryId > 0) {
            this.filterJobTypes = this.jobTypes.filter(
              (x) => x.CategoryId == this.postJobDeatil.jobCategoryId
            );
          }
          this.initForm();
          $('#postJobModal').modal('show');
          this.isLoading = false;
        }
      })
      .catch((e) => {
        this.isLoading = false;
      });
  }

  deletePost(item: any) {
    if (item) {
      this.isLoading = true;
      this.http
        .delete(`userposts/deleteUserPostByUserPostId/${item.UserPostId}`)
        .then((res: ResponseModel) => {
          if (res.ResponseBody) {
            this.bindData(res.ResponseBody);
            Toast('Post deleted successfully');
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    }
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

  get f() {
    return this.postJobForm.controls;
  }

  fullTextView(e: any) {
    e.target.parentElement.previousElementSibling.classList.remove(
      'description-container'
    );
    e.target.classList.add('d-none');
  }

  reset() {
    this.postJobDeatil = new PostJobModal();
    this.filterJobTypes = this.jobTypes.filter(
      (x) => x.CategoryId == this.postJobDeatil.jobCategoryId
    );
    this.initForm();
    this.isFilesizeExceed = false;
  }

  cleanFile() {
    this.fileDetail = [];
    this.isFilesizeExceed = false;
  }

  deleteImgConformPopup(item: any) {
    if (item) {
      this.selectedImage = item;
      $('#delteImageConfirmModal').modal('show');
    }
  }

  deletePostImage() {
    if (
      this.selectedImage &&
      this.selectedImage.FileDetailId &&
      this.postJobDeatil.userPostId > 0
    ) {
      this.isLoading = true;
      this.http
        .delete(
          `userposts/deleteImages/${this.postJobDeatil.userPostId}/${this.selectedImage.FileDetailId}`
        )
        .then((res) => {
          if (res.ResponseBody) {
            this.uploadedFile = [];
            this.uploadedFile = res.ResponseBody;
            this.uploadedFile.forEach((y) => {
              if (
                y.FilePath.includes('.jpg') ||
                y.FilePath.includes('.png') ||
                y.FilePath.includes('.jpeg') ||
                y.FilePath.includes('.gif')
              )
                y.Format = 'image';
              else y.Format = 'video';

              y.FilePath = this.imgBaseUrl + y.FilePath;
            });
            Toast('Image deleted successfully');
            $('#delteImageConfirmModal').modal('hide');
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    }
  }

  viewProfile() {
    this.nav.navigate(Profile, null);
  }

  goToHome() {
    this.nav.navigate(Index, null);
  }

  selectJobCategory(item: any) {
    this.postJobForm.value.jobCategoryId = item.categoryId;
    this.filterJobTypes = this.jobTypes.filter(
      (x) => x.CategoryId == item.CategoryId
    );
  }
}

interface Item {
  ImageSrc: string;
  ImageAlt: string;
  FilePath?: string;
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
  minimumCTC: number = 0;
  maximumCTC: number = 0;
  isOTIncluded: boolean = false;
  maxOTHours: number = null;
  bonus: number = 0;
  salaryCurrency: string = null;
  minAgeLimit: number = 0;
  maxAgeLimit: number = 0;
  noOfPosts: number = 0;
  contractPeriodInMonths: number = 0;
  files: Array<any> = [];
  fileDetail: string = null;
  jobCategoryId: number = 1;
}
