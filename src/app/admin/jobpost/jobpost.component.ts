import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, ToLocateDate, Toast } from 'src/providers/common.service';
import { iNavigation } from 'src/providers/iNavigation';
import { UserService } from 'src/providers/userService';
declare var $: any;

@Component({
  selector: 'app-jobpost',
  templateUrl: './jobpost.component.html',
  styleUrls: ['./jobpost.component.scss']
})
export class JobpostComponent implements OnInit{
  isReady: boolean = false;
  posts: Array<any> = [];
  postJobForm: FormGroup;
  postJobDeatil: PostJobModal = new PostJobModal();
  previews: Array<any> = [];
  fileDetail: Array<any> = [];
  isFilesizeExceed: boolean = false;
  selectedImage: any = null;
  isLoading: boolean = false;
  imgBaseUrl: string = null;


  constructor ( private user: UserService,
                private nav: iNavigation,
                private http: AjaxService,
                private fb: FormBuilder){};

  ngOnInit(): void {
    
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

  deleteImgConformPopup(item: any) {
    if (item) {
      this.selectedImage = item;
      $("#delteImageConfirmModal").modal("show");
    }
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

  fireBrowserFile() {
    $("#uploadPost").click();
  }

  reset() {
    this.postJobDeatil = new PostJobModal();
    this.initForm();
    this.isFilesizeExceed = false;
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
      JobRequirementId: new FormControl(this.postJobDeatil.JobRequirementId)
    })
  }



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
}

