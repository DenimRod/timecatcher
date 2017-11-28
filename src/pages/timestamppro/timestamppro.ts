import { Component,ViewChild } from '@angular/core';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
@Component({
  templateUrl: 'timestamppro.html',
  selector: 'page-timestamppro'
})

export class TimestampProPage {
@ViewChild('focusInput') myInput;

  constructor(public globVars: GlobalVars, public navCtrl: NavController,public keyboard: Keyboard) {
    var currStatusNr = 0;
    this.globVars.timer=this.globVars.logouttime;
    //  this.globVars.countDown();
    while (this.globVars.globCurrUser.status != this.globVars.tsTyp[currStatusNr]) {
      ++currStatusNr;
    }
    if (currStatusNr >=1 && currStatusNr <=6 ) globVars.workTimeRuns=true
    else globVars.workTimeRuns=false;
    this.globVars.globCurrUser.worktimeToday=0;
    this.globVars.workTimeCounter();
  //  alert("in Timestamppro1:"+this.globVars.currPlatform);
  }

  ionViewDidEnter() {
    this.globVars.comment = '';
    if (this.globVars.currPlatform=="Desktop")
      setTimeout(() => {
        this.myInput.setFocus();
      },400);
    if (this.globVars.currPlatform=="Handy") this.keyboard.close();
    this.globVars.timeInit();
  }

  public handleTEXT(){
    let stampType=Number(this.globVars.comment.charAt(0));

    if (stampType>=0) {  // wenn 1. Buchstabe eine Zahl ist
      this.globVars.comment=this.globVars.comment.substr(1); // außer 1. Zahl wird alles gestrichen
      this.globVars.makeStamp(this.globVars.tsTyp[stampType]);
      this.globVars.comment="";
      if (this.globVars.currPlatform=="Desktop") this.myInput.setFocus();
      if (this.globVars.currPlatform=="Handy") this.keyboard.close();
    }
    else {    //1. Buchstabe keine Zahl;
      this.globVars.comment="";
      if (this.globVars.currPlatform=="Desktop") this.myInput.setFocus();
      if (this.globVars.currPlatform=="Handy") this.keyboard.close();
    }
  }

public timestampClick(tsTypeNr:number){
  this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
  if (this.globVars.currPlatform=="Desktop") this.myInput.setFocus();
  if (this.globVars.currPlatform=="Handy") this.keyboard.close();
}


/*  public changeUser(){
    this.navCtrl.push(LoginPage);
  }
*/
}
