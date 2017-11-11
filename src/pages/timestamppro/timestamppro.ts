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
  let stampType = this.globVars.comment.charAt(0);
  switch (stampType){
    case "0": globVars.makeStamp(this.globVars.tsTyp[0]);
    case "1": globVars.makeStamp(this.globVars.tsTyp[1]);
    case "2": globVars.makeStamp(this.globVars.tsTyp[2]);
    case "3": globVars.makeStamp(this.globVars.tsTyp[3]);
    case "4": globVars.makeStamp(this.globVars.tsTyp[4]);
    case "7": globVars.makeStamp(this.globVars.tsTyp[7]);
    case "8": globVars.makeStamp(this.globVars.tsTyp[8]);
    case "9": globVars.makeStamp(this.globVars.tsTyp[9]);
  }
    // if stamptype= ... globars.makeStamp("Pause") ...


}

public changeUser(){
  this.navCtrl.push(LoginPage);
}

}
