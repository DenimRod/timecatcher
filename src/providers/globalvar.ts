import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {

public globCurrUserId:string;

  constructor() {
    this.globCurrUserId = "";
  }

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
