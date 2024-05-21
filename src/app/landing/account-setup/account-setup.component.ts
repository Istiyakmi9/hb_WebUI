import { Component, OnInit } from '@angular/core';
import { autoCompleteModal } from 'src/app/util/iautocomplete/iautocomplete.component';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast } from 'src/providers/common.service';
import { Index } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { IautocompleteComponent } from '../../util/iautocomplete/iautocomplete.component';

interface IAccountType {
  TypeId: number;
  TypeName: string;
  Desc: string;
  ImgUrl: string;
  RoleId: number;
  purpose: string;
}

@Component({
    selector: 'app-account-setup',
    templateUrl: './account-setup.component.html',
    styleUrls: ['./account-setup.component.scss'],
    standalone: true,
    imports: [IautocompleteComponent]
})
export class AccountSetupComponent implements OnInit {

  accountType: IAccountType[] = [{
    TypeId: 1,
    TypeName: "Job Seeker",
    Desc:"An individual who is looking for employment opportunities",
    ImgUrl: "assets/blue_collar.png",
    RoleId:3,
    purpose: 'looking for',
  }, {
    TypeId: 2,
    TypeName: "Job Provider",
    Desc:"Recruiter or placement agency that connects job seekers with job opportunities",
    ImgUrl: "assets/grey_collar.png",
    RoleId:2,
    purpose:'offering'
  }];

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
  activePage: number = 1;
  selectedJobType: any = null;
  selectedAccountType: IAccountType = null;
  locationData: autoCompleteModal = null;
  JobTypeData: autoCompleteModal = null;
  isLoading: boolean = false;
  selectedJobTitle: Array<any> = [];
  selectedLocation: Array<any> = [];
  isInitalSetupDone: boolean = false;
  userId: number = 0;
  isPageReady: boolean = false;

  constructor(private http: AjaxService,
              private nav: iNavigation) {}

  ngOnInit(): void {
    this.isPageReady = false;
    let data = this.nav.getValue();
    if (data) {
      if (data.userId > 0 && !data.IsAccountConfig) {
        this.isPageReady= true;
        this.userId = data.userId;
        this.locationData = new autoCompleteModal();
        this.locationData.data = [];
        this.locationData.placeholder = "Select location";
        this.locationData.className = "disable-field";
        this.JobTypeData = new autoCompleteModal();
        this.JobTypeData.data = [];
        this.JobTypeData.placeholder = "Select Job Title";
        this.JobTypeData.className = "disable-field";
      } else {
        this.nav.navigate(Index, null);
      }
    } else {
      ErrorToast("Invalid user");
    }
  }

  selectJobCategory(item: any) {
    if (item) {
      this.selectedJobType = item;
      this.getJobsandLocation();
    }
  }

  selectAccountType(accountType: IAccountType) {
    if (accountType) {
      this.selectedAccountType = accountType;
      this.activePage = 2;
    }
  }

  getJobsandLocation() {
    this.isLoading = true;
    this.http.get(`user/getJobandLocation/${this.selectedJobType.CategoryId}`).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        let countries = res.ResponseBody.Countries;
        let jobtypes = res.ResponseBody.JobTypes;
        this.locationData.data = [];
        this.JobTypeData.data = [];
        countries.map(x => {
          this.locationData.data.push({
            value: x.id,
            text: x.name
          })
        });
        jobtypes.map(x => {
          this.JobTypeData.data.push({
            value: x.jobTypeId,
            text: x.jobTypeName
          })
        });
        this.locationData.className="";
        this.locationData.isMultiSelect = true;
        this.JobTypeData.isMultiSelect = true;
        this.JobTypeData.className="";
        this.selectedJobTitle = [];
        this.selectedLocation = [];
        this.activePage = 3;
        this.isLoading = false;
      }
    }).catch(e => {
      this.isLoading = false;
    })
  }

  selectJobTitle(e: any) {
    let index = this.selectedJobTitle.findIndex(x => x.value == e.value);
    if (index < 0)
      this.selectedJobTitle.push(e);
    else
      this.selectedJobTitle.splice(index, 1)
  }

  selectLocation(e: any) {
    let index = this.selectedLocation.findIndex(x => x.value == e.value);
    if (index < 0)
      this.selectedLocation.push(e);
    else
      this.selectedLocation.splice(index, 1)
  }

  saveAccountSetup() {
    this.isLoading = true;
    let value = {
      UserId: this.userId,
      RoleId:this.selectedAccountType.RoleId,
      JobCategoryId: this.selectedJobType.CategoryId,
      CategoryTypeIds: this.selectedJobTitle.length > 0 ? this.selectedJobTitle.map(x => x.value) : [],
      JobLocationIds: this.selectedLocation.length > 0 ? this.selectedLocation.map(x => x.value): []
    };
    this.http.post("user/addJobandLocation", value).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        this.nav.navigate(Index, null);
        this.isLoading = false;
      }
    }).catch(e => {
      this.isLoading = false;
    })
  }

  gotoPreviousTab() {
    if (this.activePage>1 && this.activePage < 4) {
      this.activePage--;
    }
  }
}
