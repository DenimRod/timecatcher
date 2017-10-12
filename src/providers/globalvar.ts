import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {

public globCurrUser:any;

  constructor() {
    this.globCurrUser = null;
    
  }

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
