import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { Client } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
declare var $: any;

@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.scss']
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

  constructor(private fb: FormBuilder,
              private http: AjaxService,
              private nav: iNavigation) { }

  ngOnInit(): void {
    let data = this.nav.getValue();
    if (data)
      this.clientId = data.Id;

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.http.get(`client/getClientById/${this.clientId}`).then(res => {
      if (res.ResponseBody) {
        if (res.ResponseBody.Client)
          this.clientDetail = res.ResponseBody.Client;

        this.countries = res.ResponseBody.Country;
        this.clientTypes = res.ResponseBody.ClientType;
        this.initForm();
        this.isLoading = false;
        this.isReady = true;
      }
    }).catch(e => {
      this.isLoading = false;
    })
  }

  initForm() {
    if (this.clientDetail.CountryCode) {
      let counytry = this.countries.find(x => x.ISO == this.clientDetail.CountryCode);
      this.clientDetail.Country = counytry.Name;
      this.clientDetail.CountryPhoneCode = counytry.PhoneCode;
    }
    this.clientForm = this.fb.group({
      Id: new FormControl(this.clientDetail.Id),
      RepresenterId: new FormControl(this.clientDetail.RepresenterId),
      BankDetailId: new FormControl(this.clientDetail.BankDetailId),
      CompanyName: new FormControl(this.clientDetail.CompanyName, [Validators.required]),
      ClientTypeId: new FormControl(this.clientDetail.ClientTypeId, [Validators.required]),
      Country: new FormControl(this.clientDetail.Country, [Validators.required]),
      Mobile: new FormControl(this.clientDetail.Mobile, [Validators.required]),
      AlternetModile_2: new FormControl(this.clientDetail.AlternetModile_2),
      AlternetModile_1: new FormControl(this.clientDetail.AlternetModile_1),
      Email: new FormControl(this.clientDetail.Email, [Validators.required]),
      AlternateEmail_2: new FormControl(this.clientDetail.AlternateEmail_2),
      AlternateEmail_1: new FormControl(this.clientDetail.AlternateEmail_1),
      GSTIN: new FormControl(this.clientDetail.GSTIN),
      LicenseNo: new FormControl(this.clientDetail.LicenseNo),
      PANNum: new FormControl(this.clientDetail.PANNum),
      LegalEntity: new FormControl(this.clientDetail.LegalEntity, [Validators.required]),
      Website: new FormControl(this.clientDetail.Website),
      Description: new FormControl(this.clientDetail.Description),
      CountryCode: new FormControl(this.clientDetail.CountryCode),
      Address: new FormControl(this.clientDetail.Address, [Validators.required]),
      Pincode: new FormControl(this.clientDetail.Pincode, [Validators.required]),
      City: new FormControl(this.clientDetail.City, [Validators.required]),
      State: new FormControl(this.clientDetail.State, [Validators.required]),
      Branch: new FormControl(this.clientDetail.Branch),
      IFSC: new FormControl(this.clientDetail.IFSC, [Validators.required]),
      BankName: new FormControl(this.clientDetail.BankName, [Validators.required]),
      AccountNo: new FormControl(this.clientDetail.AccountNo, [Validators.required]),
      CountryPhoneCode: new FormControl(this.clientDetail.CountryPhoneCode)
    })
  }

  addClientDetail() {
    this.submitted = true;
    this.isLoading = true;
    if (this.clientForm.invalid) {
      this.isLoading = false;
      ErrorToast("Please fill all the mandatory filled");
      return;
    }
    
    let value = this.clientForm.value;
    this.http.post("client/manageClient", value).then(res => {
      if (res.ResponseBody) {
        Toast("Client Inserted/Updated successfully");
        $('#messageModal').modal('show');
        this.isLoading = false;
      } else {
        ErrorToast("Failed to generated, Please contact to admin.");
        this.isLoading = false;
      }
    })
  }

  gotoClientPage() {
    this.nav.navigate(Client, null)
  }

  reset() {
    this.clientDetail = new ClientDetail();
    this.initForm();
    this.clientForm.get("CountryPhoneCode").setValue("+91");
  }

  selectCountry(e: any) {
    let value = e.target.value;
    if (value) {
      let data = this.countries.find(x => x.Name == value);
      this.clientForm.get("CountryCode").setValue(data.ISO);
      this.clientForm.get("CountryPhoneCode").setValue(data.PhoneCode);
    }
  }

  get f() {
    return this.clientForm.controls;
  }
}

class ClientDetail {
  Id: number = 0;
  RepresenterId: number = 0;
  BankDetailId: number = 0;
  CompanyName: string = null;
  ClientTypeId: number = null;
  Country: string = null;
  Mobile: string = null;
  AlternetModile_2: string = null;
  AlternetModile_1: string = null;
  Email: string = null;
  AlternateEmail_2: string = null;
  AlternateEmail_1: string = null;
  GSTIN: string = null;
  LicenseNo: string = null;
  PANNum: string = null;
  LegalEntity: string = null;
  Website: string = null;
  Description: string = null;
  CountryCode: string = null;
  Address: string = null;
  Pincode: string = null;
  City: string = null;
  State: string = null;
  Branch: string = null;
  IFSC: string = null;
  BankName: string = null;
  AccountNo: string = null;
  CountryPhoneCode: string = "+91";
}