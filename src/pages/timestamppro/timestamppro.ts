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

  // if stamptype= ... globars.makeStamp("Pause") ...


}

public changeUser(){
  this.navCtrl.push(LoginPage);
}

}
