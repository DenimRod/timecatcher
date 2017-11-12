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
    this.globVars.comment=this.globVars.comment.substr(1); // außer 1. Buchstabe wird alles gestrichen
    if (stampType>=0) {  // wenn 1. Buchstabe eine Zahl ist
      this.globVars.makeStamp(this.globVars.tsTyp[stampType]);
      this.globVars.comment="";
      this.myInput.setFocus();
    }
    else {    //1. Buchstabe keine Zahl;
      this.globVars.comment="";
      this.myInput.setFocus();
    }
  }

/*                break;
      case "1": this.globVars.makeStamp(this.globVars.tsTyp[1]);
                this.globVars.comment="";
                break;
      case "2": this.globVars.makeStamp(this.globVars.tsTyp[2]);
                this.globVars.comment="";
                break;
      case "3": this.globVars.makeStamp(this.globVars.tsTyp[3]);
                this.globVars.comment="";
                break;
      case "4": this.globVars.makeStamp(this.globVars.tsTyp[4]);
                this.globVars.comment="";
                break;
// 5 und 6 noch nicht gebraucht = Projekt 1, Projekt 2, aber löschen der Eingabe notwendig

      case "5": this.globVars.comment="";
                break;
      case "6": this.globVars.comment="";
                break;
//
      case "7": this.globVars.makeStamp(this.globVars.tsTyp[7]);
                this.globVars.comment="";
                break;
      case "8": this.globVars.makeStamp(this.globVars.tsTyp[8]);
                this.globVars.comment="";
                break;
      case "9": this.globVars.makeStamp(this.globVars.tsTyp[9]);
                this.globVars.comment="";
      } //end switch  */

  public changeUser(){
    this.navCtrl.push(LoginPage);
  }

}
