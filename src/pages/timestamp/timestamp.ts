import { Component } from '@angular/core';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';


@Component({
  templateUrl: 'timestamp.html',
  selector: 'page-timestamp'
})
export class TimestampPage {

  constructor(public globVars: GlobalVars, public navCtrl: NavController ) {

    this.globVars.timer=this.globVars.logoutTime;
    this.globVars.countDown();

  }

  public changeUser(){
    this.navCtrl.push(LoginPage);
  }
}
