import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {

public globCurrUserId:string;
public globCurrUserName: string;

  constructor() {
    this.globCurrUserId = "";
    this.globCurrUserName = "";
  }

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
