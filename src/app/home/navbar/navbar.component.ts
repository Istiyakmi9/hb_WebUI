import { Component, OnInit } from '@angular/core';
import { JwtService, ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { AUTHSERVICE, Chatting } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoading: boolean = false;
  isShowPassword: boolean = false;
  clientId : "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com";

  constructor (private http: AjaxService,
              private jwtService: JwtService,
              private nav:iNavigation) {

  }

  ngOnInit(): void {
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
        this.http.login(`googlelogin`, { "Token": credential }, AUTHSERVICE).then((response: ResponseModel) => {
          $("#loginModal").modal("hide");
          Toast("Please wait loading dashboard ...", 15);
          this.nav.navigate(Chatting, response.ResponseBody.IsNewUser);
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
          Toast("Please wait loading dashboard ...", 15);
          this.nav.navigate(Chatting, result.ResponseBody.IsNewUser);
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

  showPassword() {
    document.getElementById('Password').setAttribute('type', 'text');
    this.isShowPassword = true;
  }

  hidePassword() {
    document.getElementById('Password').setAttribute('type', 'password');
    this.isShowPassword = false;
  }

  googleLogin() {
    let client_id = "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com";
    const redirectUri = "http://localhost:4200"; // Adjust redirect URI if needed



    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirectUri}&scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&response_type=code`;
  }
}
