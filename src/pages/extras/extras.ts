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
  public buchungenMonth:any[][]=[];
  public workTimeHours:any[] = [];
  public workTimeMinutes:any[] = [];
  public wtMonthSum = 0;
  public wtMonthHours = 0;
  public wtMonthMinutes = 0;

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

public calcMonth(){

let firstOfMonth = new Date("2018-01-04");
let foMString = firstOfMonth.toISOString().substr(0,10);

    let params = {
      filter: [this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name), this.backand.helpers.filter.create('date', 'startsWith', foMString)],
      sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
    //  pageSize: 20,

    //  pageNumber: this.nextBuchungenPage,      //Hol die nächste Seite
    }
    this.backand.object.getList('Timestamps2', params)
     .then((res: any) => {
       let i=0;
       let weekDay="";
       let datumHelper=null;
       let todayIndexBorder=-1;
       let todayDate = new Date();

  /*     while (i<res.data.length) {            //Such den ersten TS != heute
         if(res.data[i].date.substr(0,10) !=     todayDate.toISOString().substr(0,10))
         {
           todayIndexBorder = i;
           break;
         }
         i++;
       }
       i=0;         //falls alle TS von heute -> Ende = Ende d. Liste
       if (todayIndexBorder==-1) todayIndexBorder = res.data.length + 1;
*/
      let workTimeSum = this.globVars.calcWorkTime(res.data);
      this.wtMonthSum += workTimeSum;
      let workTimeSumDate = new Date(workTimeSum);
      this.workTimeHours[0] = workTimeSumDate.getUTCHours();
      this.workTimeMinutes[0] = workTimeSumDate.getUTCMinutes();
          //Gibt es eine Bessere Möglichkeit, die Zeiten zu addieren?
      let wtMonthDate = new Date(this.wtMonthSum);
      this.wtMonthHours = wtMonthDate.getUTCHours();
      this.wtMonthMinutes = wtMonthDate.getUTCMinutes();

       while (i<res.data.length) {          //UTC Strings -> Lokale Zeit
         datumHelper = new Date(res.data[i].date);
         res.data[i].date = datumHelper.toString().substr(0,21);
         weekDay=res.data[i].date.substr(0,3);
         switch (weekDay) {
           case "Mon": weekDay ="Mo";
             break;
           case "Tue": weekDay ="Di";
             break;
           case "Wed": weekDay ="Mi";
             break;
           case "Thu": weekDay ="Do";
               break;
           case "Fri": weekDay ="Fr";
               break;
           case "Sat": weekDay ="Sa";
               break;
           case "Sun": weekDay ="So";
               break;
         }
         res.data[i].date = weekDay+res.data[i].date.substr(3,21);
         ++i;
       };
       this.buchungenMonth[0] = res.data;
  },
  (err: any) => {
    alert(err.data);
  });

 firstOfMonth = new Date("2018-01-05");
 foMString = firstOfMonth.toISOString().substr(0,10);

      params.filter = [this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name), this.backand.helpers.filter.create('date', 'startsWith', foMString)];

      this.backand.object.getList('Timestamps2', params)
       .then((res: any) => {
         let i=0;
         let weekDay="";
         let datumHelper=null;
         let todayIndexBorder=-1;
         let todayDate = new Date();

         let workTimeSum = this.globVars.calcWorkTime(res.data);
         this.wtMonthSum += workTimeSum;
         let workTimeSumDate = new Date(workTimeSum);
         this.workTimeHours[1] = workTimeSumDate.getUTCHours();
         this.workTimeMinutes[1] = workTimeSumDate.getUTCMinutes();
              //Berechne die Monatssumme in der letzten Iteration!

         let wtMonthDate = new Date(this.wtMonthSum);
         this.wtMonthHours = wtMonthDate.getUTCHours();
         this.wtMonthMinutes = wtMonthDate.getUTCMinutes();

    /*     while (i<res.data.length) {            //Such den ersten TS != heute
           if(res.data[i].date.substr(0,10) !=     todayDate.toISOString().substr(0,10))
           {
             todayIndexBorder = i;
             break;
           }
           i++;
         }
         i=0;         //falls alle TS von heute -> Ende = Ende d. Liste
         if (todayIndexBorder==-1) todayIndexBorder = res.data.length + 1;
  */
         while (i<res.data.length) {          //UTC Strings -> Lokale Zeit
           datumHelper = new Date(res.data[i].date);
           res.data[i].date = datumHelper.toString().substr(0,21);
           weekDay=res.data[i].date.substr(0,3);
           switch (weekDay) {
             case "Mon": weekDay ="Mo";
               break;
             case "Tue": weekDay ="Di";
               break;
             case "Wed": weekDay ="Mi";
               break;
             case "Thu": weekDay ="Do";
                 break;
             case "Fri": weekDay ="Fr";
                 break;
             case "Sat": weekDay ="Sa";
                 break;
             case "Sun": weekDay ="So";
                 break;
           }
           res.data[i].date = weekDay+res.data[i].date.substr(3,21);
           ++i;
         };
         this.buchungenMonth[1] = res.data;
    },
    (err: any) => {
      alert(err.data);
    });


  }



}
