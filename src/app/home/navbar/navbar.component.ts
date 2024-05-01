import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtService, ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { AUTHSERVICE, AccountSetup, Index } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { NgClass } from '@angular/common';
import { NgbPopover, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLinkButton, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { RouterLinkActive, RouterLink } from '@angular/router';
declare var $: any;
declare var google: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [RouterLinkActive, RouterLink, NgbPopover, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLinkButton, NgbNavLinkBase, NgbNavContent, NgClass, FormsModule, ReactiveFormsModule, NgbNavOutlet]
})
export class NavbarComponent implements OnInit,AfterViewInit {
  isLoading: boolean = false;
  clientId : "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com";
  active:number = 1;
  signUpForm: FormGroup;
  isSubmitted: boolean = false;

  constructor (private http: AjaxService,
              private jwtService: JwtService,
              private nav:iNavigation,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initSignUpForm();    
  }

ngAfterViewInit(): void {
  google.accounts.id.initialize({
    client_id : "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com",
    callback: (resp: any) => this.loginWithGoogle(resp)
  });

  google.accounts.id.renderButton(document.getElementById("google-oauth"), {
    theme: 'filled_blue',
    size: 'large',
    shape: 'rectangle',
    width: 900
  });
}

  loginWithGoogle(resp: any) {
    if (resp && resp.clientId != undefined) {
      let credential = resp.credential;

      if(credential) {
        this.jwtService.setGoogleJwtToken(credential);
        this.http.login(`googlelogin`, { "Token": credential }, AUTHSERVICE).then((res: ResponseModel) => {
          $("#loginModal").modal("hide");
          if (res.ResponseBody.IsAccountConfig) {
            Toast("Please wait loading dashboard ...", 15);
            this.nav.navigate(Index, null);
          } else {
            let response = {
              UserId: res.ResponseBody.UserDetail.UserId,
              IsAccountConfig: res.ResponseBody.IsAccountConfig
            };
            this.nav.navigate(AccountSetup, response);
          }
        });
      }
    }
  }

  loginPopup() {
    $("#loginModal").modal("show");
  }

  UserLogin() {
    this.isLoading = true;
    let loginValue = {
      Password: null,
      Email: null,
      Mobile: null,
    };

    let userId: any = document.getElementById("EmailOrMobile");
    let password: any = document.getElementById("Password");

    if (!userId.value) {
      this.isLoading = false;
      return;
    }

    if (!password.value) {
      this.isLoading = false;
      return;
    }

    if (userId.value !== "" && password.value !== "") {
      if(userId.value.indexOf("@") !== -1) {
        loginValue.Email = userId.value;
      } else {
        loginValue.Mobile = userId.value;
      }

      loginValue.Password = password.value;
      this.http.login('authenticate', loginValue, AUTHSERVICE).then((result: ResponseModel) => {
        if (result.ResponseBody) {
          $("#loginModal").modal("hide");
          if (result.ResponseBody.IsAccountConfig) {
            this.nav.navigate(Index, null);
            Toast("Please wait loading dashboard ...", 15);
          } else {
            let response = {
              UserId: result.ResponseBody.UserDetail.UserId,
              IsAccountConfig: result.ResponseBody.IsAccountConfig
            };
            this.nav.navigate(AccountSetup, response);
          }
          this.isLoading = false;
          // if(Data.UserTypeId == 1)
          // else
          //   this.nav.navigate("", null);
        } else {
          ErrorToast("Incorrect username or password. Please try again.");
        }
      }).catch(e => {
        this.isLoading = false;
      });
    }
  }

  showPassword(e: any) {
   e.currentTarget.previousElementSibling.previousElementSibling.removeAttribute("type");
   e.currentTarget.previousElementSibling.previousElementSibling.setAttribute("type", "text");
    e.currentTarget.previousElementSibling.classList.remove("d-none");
    e.target.parentElement.classList.add("d-none");
  }

  hidePassword(e: any) {
    e.currentTarget.previousElementSibling.removeAttribute("type");
    e.currentTarget.previousElementSibling.setAttribute("type", "password");
    e.currentTarget.nextElementSibling.classList.remove("d-none")
    e.target.parentElement.classList.add("d-none");
  }

  googleLogin() {
    let client_id = "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com";
    const redirectUri = "http://localhost:4200"; // Adjust redirect URI if needed



    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirectUri}&scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&response_type=code`;
  }

  initSignUpForm() {
    this.signUpForm = this.fb.group({
      FullName: new FormControl("", [Validators.required]),
      Mobile: new FormControl("", [Validators.required]),
      Email: new FormControl("", [Validators.required, Validators.email]),
      Password: new FormControl("", [Validators.required]),
      ConfirmPassword: new FormControl("", [Validators.required])
    }, {validators: this.matchPassword})
  }

  matchPassword(control: AbstractControl) {
    let password = control.get("Password").value;
    let confirmPassword = control.get("ConfirmPassword").value;

    if (password != confirmPassword)
      control.get("ConfirmPassword").setErrors({mismatch: true});
    else
      control.get("ConfirmPassword").setErrors(null);
  }

  signUp() {
    this.isLoading = true;
    this.isSubmitted = true;
    if (this.signUpForm.valid) {
      let value = this.signUpForm.value;
      this.http.post("signup", value, AUTHSERVICE).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.jwtService.setLoginDetail(res.ResponseBody);
          let response = {
            UserId: res.ResponseBody.UserDetail.UserId,
            IsAccountConfig: res.ResponseBody.IsAccountConfig
          }
          Toast("Sign Up successfully");
          $("#loginModal").modal("hide");
          this.isSubmitted = false;
          this.isLoading = false;
          this.nav.navigate(AccountSetup, response);
          // [routerLink]="['/AccountSetup']"
        }
      }).catch(e => {
        this.isLoading = false;
        this.isSubmitted = false;
      })
    } else {
      this.isLoading = false;
      ErrorToast("Please fill all the mandatory filled");
    }
  }

  get f() {
    return this.signUpForm.controls;
  }

  changeTab() {
    this.isSubmitted = false;
  }
}
