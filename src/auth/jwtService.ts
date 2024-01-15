import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorToast } from "src/providers/common.service";
import { AccessToken, String, AccessTokenExpiredOn, BadRequest, Forbidden, Master, NotFound, ServerError, Success, UnAuthorize } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";

@Injectable()
export class JwtService {

    constructor(private nav: iNavigation){ }

    private companyCode: string = null;
    private googleToken: string = null;

    getGoogleJwtToken() {
        return this.googleToken;
    }

    setGoogleJwtToken(token: string) {
        this.googleToken = token;
    }

    getJwtToken() {
        let Token = localStorage.getItem(AccessToken);
        return Token;
    }

    setJwtToken(token: string, expiredOn: string) {
        localStorage.setItem(AccessTokenExpiredOn, expiredOn);
        if (token !== null && token !== "") {
            localStorage.setItem(AccessToken, token);
        }
    }

    setLoginDetail(data: any): Boolean {
      let res: LoginResponse = data as LoginResponse;
      let flag: Boolean = false;
      if(res !== undefined && res !== null) {
          if(res.UserDetail !== null) {
              this.removeJwtToken();
              this.setJwtToken(res.UserDetail["Token"], res.UserDetail["TokenExpiryDuration"]);
              localStorage.setItem(Master, JSON.stringify(res));
              flag = true;
          }
      }
      return flag;
    }

    removeJwtToken() {
        localStorage.removeItem(AccessToken);
        localStorage.removeItem(AccessTokenExpiredOn);
        localStorage.removeItem(Master);
    }

    setCompanyCode(code: string) {
        this.companyCode = code;
    }

    getCompanyCode() {
        return this.companyCode;
    }

    IsValidResponse(response: ResponseModel) {
      let flag = true;
      if (!response || response.HttpStatusCode != Success) {
       let e: HttpErrorResponse = {
            error: null,
            headers: null,
            status: response.HttpStatusCode,
            statusText: null,
            url: null,
            message: null,
            name: null,
            ok: null,
            type: null
        };

        this.HandleResponseStatus(e);
        flag = false;
      }

      return flag;
    }

    HandleResponseStatus(e: HttpErrorResponse): boolean {
      let flag = false;
      let error: ResponseModel = e.error;
      try {
        switch (e.status) {
            case Success:
                flag = true;
                break;
            case UnAuthorize:
                let token = localStorage.getItem("access_token");
                if(token !== null && token != "")
                    document.getElementById("sessionexpiredBox").classList.remove('d-none');
                else
                    localStorage.clear();
                ErrorToast("Unauthorized access. Please login again.");
                this.nav.navigate("", null);
                break;
            case NotFound:
                ErrorToast("Page not found. Please check your Url.");
                break;
            case Forbidden:
              ErrorToast("Invalid user access. Please try login again.");
              this.nav.navigate("", null);
              break;
            case ServerError:
            case BadRequest:
                if(typeof(error.ResponseBody) == String) {
                  ErrorToast(error.ResponseBody);
                } else {
                  if(error.ResponseBody.UserMessage != undefined &&
                      error.ResponseBody.UserMessage != null &&
                      error.ResponseBody.UserMessage != ""){
                          ErrorToast(error.ResponseBody.UserMessage);
                      } else {
                          ErrorToast("Unknown error occured. Please contact to admin.");
                      }
                }
                break;
            default:
                ErrorToast("Unknown error occured. Please contact to admin.");
                break;
        }
      } catch {
        ErrorToast("Unknown error occured. Please contact to admin.");
        flag = false;
      }      

      return flag;
    }
}

export interface ResponseModel {
    AuthenticationToken: string;
    HttpStatusCode: number;
    HttpStatusMessage: string;
    ResponseBody: any;
}

export class LoginResponse {
    UserDetail: any = null;
}
