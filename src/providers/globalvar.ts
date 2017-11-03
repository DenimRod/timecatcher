import {Injectable} from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';
import { App } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Device } from '@ionic-native/device';

@Injectable()
export class GlobalVars {

public comment:string="";
public globCurrUser:any;
public timer:number = 0;
public appNameVers:string="KD-Zeiterfassung v0.15";
public logouttime:number = 1000;
public pinlength:number = 2;
public currentDate:string = "";
public localDate:Date = null;
constructor(public backand: BackandService, public app:App, private device:Device) {
    this.globCurrUser = null;
  }

public countDown(){
this.timer = this.timer - 1;
if (this.timer > 0 ){
  setTimeout(()=>{this.countDown()},1000);
}
else{
  this.app.getRootNav().setRoot(LoginPage);
}
  //alert(this.timer);
}

public makeStamp(stampType:string){
  this.globCurrUser.status=stampType;

  this.currentDate = (new Date()).toISOString();
  this.localDate = new Date(this.currentDate);

  this.globCurrUser.lasttimestamp =  this.localDate.getDate() + "." + (this.localDate.getMonth() + 1) + ". um " + this.localDate.getHours() + ":" + this.localDate.getMinutes();

  this.globCurrUser.lastcomment = this.comment;

  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);

  this.backand.object.create('Timestamps', "{'date':'" + this.currentDate + "', 'status':'" + this.globCurrUser.status + "','userid':'" + this.globCurrUser.id + "','comment':'" + this.comment + "','device':'" + this.device.uuid + " / " + this.device.model +  "'}")

/*    READ ID OF CREATED TIMESTAMP
  .then((res: any) => {
    let items:any;
    items = res.data.__metadata;
    alert(items.id);
  },
  (err: any) => {
    alert(err.data);
  });
*/
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

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
