import {Injectable} from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';

@Injectable()
export class GlobalVars {

public globCurrUser:any;
public timer:number = 0;
public appNameVers:string="KD-Zeiterfassung v0.12";
public currentDate:string = "";
public localDate:Date = null;

constructor(public backand: BackandService) {
    this.globCurrUser = null;
  }

public countDown(){
  console.log(this.timer);
this.timer = this.timer - 1;
  console.log(this.timer);
}

/*
public startBreak(){
  this.globCurrUser.status="Pause";
  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
}

public endBreak(){
  if (this.globCurrUser.status=="Pause"){
    this.globCurrUser.status="Arbeit";
    this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
  }
}

public endWork(){
  this.globCurrUser.status="Freizeit";
  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
}
public startWork(){
  this.globCurrUser.status="Arbeit";
  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);

  this.currentDate = (new Date()).toISOString();
  this.localDate = new Date(this.currentDate);

  this.backand.object.create('Timestamps', "{'date':'" + this.currentDate + "', 'status':'" + this.globCurrUser.status + "'}")
}
*/
public makeStamp(stampType:string){
  this.globCurrUser.status=stampType;
  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);

  this.currentDate = (new Date()).toISOString();
  this.localDate = new Date(this.currentDate);

  this.backand.object.create('Timestamps', "{'date':'" + this.currentDate + "', 'status':'" + this.globCurrUser.status + "','userid':'" + this.globCurrUser.id + "'}")
}
/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
