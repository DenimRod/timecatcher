import { Injectable } from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';
import { App } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';

@Injectable()
export class GlobalVars {

public comment:string="";
public globCurrComp:any;
public globCurrUser:any;
public timer:number = 0;
public appNameVers:string="KD-Zeiterfassung v0.2.1B";
public logouttime:number = 72000; // = 20*60*60 Sekunden= 20 Stunden - einmal pro Tag
public pinlength:number = 2; // Länge des User-Pin-codes
public currentDate:string = "";
public localDate:Date = null;
public currPlatform = "Desktop";
// public farbe="text-align:center,color:secondary";
public KW_akt:number = 0;
// tsTyp=Timestamp-Typ -  Array (0..9) - vorläufig 5,6 nicht verwendet (Projekt1,2)
public tsTyp = ["Krank","Arbeit EIN","AD-Fahrt","Tele-Arbeit","AD-Kunde","Projekt 1","Projekt 2", "Pause EIN","Urlaub", "Arbeit AUS"];

constructor(public backand: BackandService, public app:App, private device:Device, public platform:Platform) {
    this.globCurrUser = null;
    this.KW_akt = this.KW();
// Handy/Desktop geht nur, wenn Native, Browser-Angabe auf Handy unsicher
//   if (this.platform.is('core')) this.currPlatform = "Desktop";
//    else this.currPlatform = "Handy";
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
  let currMillisec= Date.now();
  // Server-Zeitproblem auf KD -> geht 10 min vor - Workaround
  if (this.currPlatform == "Desktop") currMillisec-=(600*1000);
  // Workaround-Ende
  this.currentDate = (new Date(currMillisec)).toISOString();
  this.localDate = new Date(this.currentDate);
  this.globCurrUser.lastcomment = this.comment;
  // Stunden,Minuten mit führender 0

  let Hours="";
  let Minutes="";
  if (this.localDate.getHours()<10) let Hours="0"+this.localDate.getHours()
  else Hours=this.localDate.getHours();
  if (this.localDate.getMinutes()<10) let Minutes="0"+this.localDate.getMinutes()
  else Minutes=this.localDate.getMinutes();
  this.globCurrUser.lasttimestamp =  this.localDate.getDate() + "." + (this.localDate.getMonth() + 1) + ". um " + Hours + ":" + Minutes;

  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
  this.backand.object.create('Timestamps', "{'date':'" + this.currentDate + "', 'status':'" + this.globCurrUser.status + "','userid':'" + this.globCurrUser.id + "','username':'" + this.globCurrUser.name + "','comment':'" + this.comment + "','device':'" + this.currPlatform +  "'}")
  this.comment = "";

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

public KW(){
  var date = new Date();
  // Get thursday
  // In JavaScript the Sunday has value 0 as return value of getDay() function.
  // So we have to order them first ascending from Monday to Sunday
  // Monday: ((1+6) % 7) = 0
  // Tuesday ((2+6) % 7) = 1
  // Wednesday: ((3+6) % 7) = 2
  // Thursday: ((4+6) % 7) = 3
  // Friday: ((5+6) % 7) = 4
  // Saturday: ((6+6) % 7) = 5
  // Sunday: ((0+6) % 7) = 6
  // (3 - result) is necessary to get the Thursday of the current week.
  // If we want to have Tuesday it would be (1-result)
  var currentThursday = new Date(date.getTime() +(3-((date.getDay()+6) % 7)) * 86400000);
  // At the beginnig or end of a year the thursday could be in another year.
  var yearOfThursday = currentThursday.getFullYear();
  // Get first Thursday of the year
  var firstThursday = new Date(new Date(yearOfThursday,0,4).getTime() +(3-((new Date(yearOfThursday,0,4).getDay()+6) % 7)) * 86400000);
  // +1 we start with week number 1
  // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
  var KW = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000/7);
  return KW;
}

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/
}
