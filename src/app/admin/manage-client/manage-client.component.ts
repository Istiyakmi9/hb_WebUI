import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { Client } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { NgClass } from '@angular/common';
import { AllownumberDirective } from '../../common/directives/allownumber.directive';
import { BreadcrumsComponent } from '../../common/breadcrums/breadcrums.component';
declare var $: any;

@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.scss'],
  standalone: true,
  imports: [
    BreadcrumsComponent,
    FormsModule,
    ReactiveFormsModule,
    AllownumberDirective,
    NgClass,
  ],
})
export class ManageClientComponent implements OnInit {
  isReady: boolean = false;
  isLoading: boolean = false;
  clientForm: FormGroup;
  clientDetail: ClientDetail = new ClientDetail();
  clientId: number = 0;
  countries: Array<any> = [];
  clientTypes: Array<any> = [];
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: AjaxService,
    private nav: iNavigation
  ) {}

  ngOnInit(): void {
    let data = this.nav.getValue();
    if (data) this.clientId = data.Id;

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.http
      .get(`client/getClientById/${this.clientId}`)
      .then((res) => {
        if (res.ResponseBody) {
          if (res.ResponseBody.Client)
            this.clientDetail = res.ResponseBody.Client;

          this.countries = res.ResponseBody.Country;
          this.clientTypes = res.ResponseBody.ClientType;
          this.initForm();
          this.isLoading = false;
          this.isReady = true;
        }
      })
      .catch((e) => {
        this.isLoading = false;
      });
  }

  initForm() {
    if (this.clientDetail.countryCode) {
      let counytry = this.countries.find(
        (x) => x.iSO == this.clientDetail.countryCode
      );
      this.clientDetail.country = counytry.Name;
      this.clientDetail.countryPhoneCode = counytry.PhoneCode;
    }
    this.clientForm = this.fb.group({
      id: new FormControl(this.clientDetail.id),
      representerId: new FormControl(this.clientDetail.representerId),
      bankDetailId: new FormControl(this.clientDetail.bankDetailId),
      companyName: new FormControl(this.clientDetail.companyName, [
        Validators.required,
      ]),
      clientTypeId: new FormControl(this.clientDetail.clientTypeId, [
        Validators.required,
      ]),
      country: new FormControl(this.clientDetail.country, [
        Validators.required,
      ]),
      mobile: new FormControl(this.clientDetail.mobile, [Validators.required]),
      alternetModile_2: new FormControl(this.clientDetail.alternetModile_2),
      alternetModile_1: new FormControl(this.clientDetail.alternetModile_1),
      email: new FormControl(this.clientDetail.email, [Validators.required]),
      alternateEmail_2: new FormControl(this.clientDetail.alternateEmail_2),
      alternateEmail_1: new FormControl(this.clientDetail.alternateEmail_1),
      gSTIN: new FormControl(this.clientDetail.gSTIN),
      licenseNo: new FormControl(this.clientDetail.licenseNo),
      pANNum: new FormControl(this.clientDetail.pANNum),
      legalEntity: new FormControl(this.clientDetail.legalEntity, [
        Validators.required,
      ]),
      website: new FormControl(this.clientDetail.website),
      description: new FormControl(this.clientDetail.description),
      countryCode: new FormControl(this.clientDetail.countryCode),
      address: new FormControl(this.clientDetail.address, [
        Validators.required,
      ]),
      pincode: new FormControl(this.clientDetail.pincode, [
        Validators.required,
      ]),
      city: new FormControl(this.clientDetail.city, [Validators.required]),
      state: new FormControl(this.clientDetail.state, [Validators.required]),
      branch: new FormControl(this.clientDetail.branch),
      iFSC: new FormControl(this.clientDetail.iFSC, [Validators.required]),
      bankName: new FormControl(this.clientDetail.bankName, [
        Validators.required,
      ]),
      accountNo: new FormControl(this.clientDetail.accountNo, [
        Validators.required,
      ]),
      countryPhoneCode: new FormControl(this.clientDetail.countryPhoneCode),
    });
  }

  addClientDetail() {
    this.submitted = true;
    this.isLoading = true;
    if (this.clientForm.invalid) {
      this.isLoading = false;
      ErrorToast('Please fill all the mandatory filled');
      return;
    }

    let value = this.clientForm.value;
    this.http.post('client/manageClient', value).then((res) => {
      if (res.ResponseBody) {
        Toast('Client Inserted/Updated successfully');
        $('#messageModal').modal('show');
        this.isLoading = false;
      } else {
        ErrorToast('Failed to generated, Please contact to admin.');
        this.isLoading = false;
      }
    });
  }

  gotoClientPage() {
    $('#messageModal').modal('hide');
    this.nav.navigate(Client, null);
  }

  reset() {
    this.clientDetail = new ClientDetail();
    this.initForm();
    this.clientForm.get('countryPhoneCode').setValue('+91');
  }

  selectCountry(e: any) {
    let value = e.target.value;
    if (value) {
      let data = this.countries.find((x) => x.name == value);
      this.clientForm.get('countryCode').setValue(data.iSO);
      this.clientForm.get('countryPhoneCode').setValue(data.phoneCode);
    }
  }

  get f() {
    return this.clientForm.controls;
  }
}

class ClientDetail {
  id: number = 0;
  representerId: number = 0;
  bankDetailId: number = 0;
  companyName: string = null;
  clientTypeId: number = null;
  country: string = null;
  mobile: string = null;
  alternetModile_2: string = null;
  alternetModile_1: string = null;
  email: string = null;
  alternateEmail_2: string = null;
  alternateEmail_1: string = null;
  gSTIN: string = null;
  licenseNo: string = null;
  pANNum: string = null;
  legalEntity: string = null;
  website: string = null;
  description: string = null;
  countryCode: string = null;
  address: string = null;
  pincode: string = null;
  city: string = null;
  state: string = null;
  branch: string = null;
  iFSC: string = null;
  bankName: string = null;
  accountNo: string = null;
  countryPhoneCode: string = '+91';
}
