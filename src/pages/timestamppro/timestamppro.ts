import { Component,ViewChild } from '@angular/core';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'timestamppro.html',
  selector: 'page-timestamppro'
})
export class TimestampProPage {
@ViewChild('focusInput') myInput;

  constructor(public globVars: GlobalVars, public navCtrl: NavController) {
    this.globVars.timer=this.globVars.logouttime;
    this.globVars.countDown();
  }

  ionViewDidEnter() {
    this.globVars.comment = '';
    setTimeout(() => {
      this.myInput.setFocus();
    },400);
  }

  public handleTEXT(){
    let stampType=Number(this.globVars.comment.charAt(0));

    if (stampType>=0) {  // wenn 1. Buchstabe eine Zahl ist
      this.globVars.comment=this.globVars.comment.substr(1); // außer 1. Zahl wird alles gestrichen
      this.globVars.makeStamp(this.globVars.tsTyp[stampType]);
      this.globVars.comment="";
      this.myInput.setFocus();
    }
    else {    //1. Buchstabe keine Zahl;
      this.globVars.comment="";
      this.myInput.setFocus();
    }
  }

public timestampClick(tsTypeNr:number){
  this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
  this.myInput.setFocus();
}

  public changeUser(){
    this.navCtrl.push(LoginPage);
  }

}
