import { HttpClient, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JwtService, ResponseModel } from "src/auth/jwtService";
import { environment } from "src/environments/environment";

@Injectable()
export class AjaxService {
  IsTokenByPass: boolean = true;

  constructor(
    private tokenHelper: JwtService,
    private http: HttpClient
  ) {
  }


  LoadStaticJson(StaticUrl: string): Observable<any> {
    let JsonData = this.http.get(StaticUrl);
    return JsonData;
  }

  private GetBaseUrl() {
    return environment.baseUrl;
  }

  login(Url: string, Param: any): Promise<ResponseModel> {
    let url = `${this.GetBaseUrl()}${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        }).subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (this.tokenHelper.IsValidResponse(res.body)) {
                let loginData: ResponseModel = res.body;
                if (this.tokenHelper.setLoginDetail(loginData.ResponseBody)) {
                  resolve(res.body);
                } else {
                  resolve(null);
                }
              } else {
                reject(null);
              }
            } catch (e) {
              reject(e);
            } 0
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  get(Url: string): Promise<ResponseModel> {
    return new Promise((resolve, reject) => {
      let url = `${this.GetBaseUrl()}${Url}`;
      return this.http
        .get(url, {
          observe: "response"
        })
        .subscribe({
          next: (res: any) => {
            if (this.tokenHelper.IsValidResponse(res.body)) {
              resolve(res.body);
            } else {
              resolve(null);
            }
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  post(Url: string, Param: any): Promise<any> {
    let url = `${this.GetBaseUrl()}${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        }).subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(null);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  put(Url: string, Param: any): Promise<any> {
    let url = `${this.GetBaseUrl()}${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .put(url, Param, {
          observe: "response"
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  delete(Url: string, Param?: any): Promise<any> {
    let url = `${this.GetBaseUrl()}${Url}`;
    return new Promise((resolve, reject) => {
      this.http.delete(url, {
        headers: {
          observe: "response",
        },
        body: Param
      }).subscribe({
        next: (res: any) => {
          try {
            if (!this.tokenHelper.IsValidResponse(res)) {
              reject(null);
            }
          } catch (e) {
            reject(e);
          }
          resolve(res);
        },
        error: (e: HttpErrorResponse) => {
          this.tokenHelper.HandleResponseStatus(e);
          reject(e.error);
        }
      });
    });
  }

  upload(Url: string, Param: any): Promise<any> {
    let url = `${this.GetBaseUrl()}${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  forgotPassword(Url: string, Param: any): Promise<ResponseModel> {
    let url = `${this.GetBaseUrl()}${Url}`;
    this.tokenHelper.setCompanyCode(Param.CompanyCode);
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        }).subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }
}

export class Filter {
  EmployeeId?: number = 0;
  ClientId?: number = 0;
  SearchString: string = "1=1";
  PageIndex: number = 1;
  StartIndex?: number = 0;
  EndIndex?: number = 0;
  PageSize: number = 10;
  SortBy?: string = "";
  CompanyId: number = 0;
  TotalRecords?: number = 0;
  ShowPageNo?: number = 5;
  ActivePageNumber?: number = 1;
  isReUseSame?: boolean = false;
  isActive?: boolean = true;

  update(total: any) {
    if(!isNaN(Number(total))) {
      this.TotalRecords = total;
      this.StartIndex = 1;
      this.PageIndex = 1;
    }
  }

  reset() {
    this.TotalRecords = 0;
    this.StartIndex = 1;
    this.PageIndex = 1;
    this.ActivePageNumber = 1;
  }
}
