import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { UserService } from 'src/providers/userService';

@Injectable({ providedIn: 'root' })
export class IndexRepository {
  constructor(private http: AjaxService, private user: UserService) {}

  public async uploadProfileImage(
    fileDetail: Array<any>,
    currentUser: any
  ): Promise<boolean> {
    let flag = false;
    if (fileDetail.length > 0) {
      let formData = new FormData();
      formData.append('userimage', fileDetail[0].file);
      this.http
        .post(`user/addUserImage/${currentUser.userId}`, formData)
        .then((res: ResponseModel) => {
          if (res.ResponseBody) {
            currentUser.imageURL = res.ResponseBody;
            this.user.setInstance(currentUser);
          }

          flag = true;
        })
        .catch((e) => {
          flag = false;
        });
    }

    return flag;
  }

  async loadData(page: number): Promise<any> {
    var response = await this.http.get(`userposts/getHomePage/${page}`);
    if (response.ResponseBody) {
      return response.ResponseBody;
    }

    return null;
  }
}
