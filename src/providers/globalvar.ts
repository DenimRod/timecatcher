import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {

public globCurrUser:any;
public timer:number = 5;

  constructor() {
    this.globCurrUser = null;

  }

public countDown(){
  console.log(this.timer);
this.timer = this.timer - 1;
  console.log(this.timer);
}

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
