import { Injectable } from "@angular/core";
import { Master } from "./constants";
import { UserDetail } from "./common.service";

@Injectable()
export class UserService {
    private userModel: UserDetail = null;
    getInstance(): UserDetail {
        let localUserData = localStorage.getItem(Master);
        if (localUserData !== null && localUserData !== "") {
            localUserData = JSON.parse(localUserData);
            this.userModel = localUserData["UserDetail"] as UserDetail;
        } else {
            this.userModel = new UserDetail();
        }
        return this.userModel;
    }
}
