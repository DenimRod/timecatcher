import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
import { Platform } from 'ionic-angular';

@Component({
    templateUrl: 'extras.html',
    selector: 'page-extras',
})
export class ExtrasPage {

  public users:any[]=[];

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {

//  alert("Browser-Platform:"+this.globVars.browserPlatform+" currPf: "+this.globVars.currPlatform);
  }
  //angeblich notwendig, damit die Dialoge "aktiviert" werden.
 //onDeviceReady();
 //document.addEventListener("deviceready", onDeviceReady, false);
 // alte Bezeichnung??  navigator.notification.beep(2);
  public playTon() {
    var snd = new Audio("https://ordination-kutschera.at/Alarm.wav"); // buffers automatically when created
    snd.play();
  };

 /* geht leider nur als "native"
 this.dialogs.beep (3); // spielt Sytem-Sound z.B. "Pfeifen"
 this.dialogs.alert('RI - alert-message')
   .then(() => alert('Dialog erledigt/dismissed'))
   .catch(e => alert('Error displaying dialog'+ e));
 this.dialogs.prompt('RI-prompt-message das kann noch viel länger sein, mal sehen, wieviel sich da ausgeht döfgk  dfölklöä k dlöähkhkdölk  ölkdfhlök   dölkhl kd dölkh   dölhkdölkhk  lödfhkk ödlöhk öldflöh  dlöfkhöl ödlk kdöhk lödlhö lödfkdfkhkerkherrjölkjdhljhhj  hjjfkhj jhjh' +
 'ösljg lkgjkgklghg jrejg jgeogireg jgj ergjor gjfdkj  lk ldkg  klgfgj lkfd  glkj  dflkj  dflkgj fdgjl lkfdj  jgj dkg gjfkdlgj  jgjgfkgjdgj',
  'RI-title',["OK","Cancel","3.", "4.","5.", "6."], 'defaultText');
*/
//  alert('nach dialogs');

}
