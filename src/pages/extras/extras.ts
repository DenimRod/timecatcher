import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
//import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
import { Platform } from 'ionic-angular';
//import { Item } from '../../models/item/item.model';
//import { ShoppingListService } from "../../providers/shopping-list.service";

@Component({
    templateUrl: 'extras.html',
    selector: 'page-extras',
})
export class ExtrasPage {
/*  item: Item = {
    name: 'TEST',
    quantity: 1,
    price: 123,
  }
*/
  public users:any[]=[];
  public noTSFound = false;
  public buchungenMonth:any[][]=[];
  public workTimeHoursDezim:any[] = [];
  public workTimeHours:any[] = [];
  public workTimeMinutes:any[] = [];

    // Container für alle Vars für Arbeitszeit in Intervall
      //24*60*60*100 = 86400000, Anzahl ms pro Tag
      //60*60*1000 = 3600000, Anzahl ms pro Stunde, Offset
  public wtInterval = {
      //01.00 des gestrigen Tages [vermutlich]
    start: new Date(Date.now() - (Date.now() % 86400000) - 86400000 ).toISOString(),
      //23.59 des heutigen Tages
    end: new Date(Date.now() + (86400000 - Date.now() % 86400000) - 3600001).toISOString(),
    sum:0,
    Hours:0,
    HoursDezim:"",
    Minutes:0
};
    // Firebase_Test: private shopping: ShoppingListService,
    // BACKAND-Backup  private backand: BackandService,
  constructor(public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {

/* Firebase_Test

    this.shopping.addItem(this.item).then(ref=> {
          console.log(ref.key);
        })
*/
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

public calcIntervalPHP(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if ((xhr.readyState == 4) && (xhr.status == 200 )) {
        //res Objekt erstellen, analog zu Back& -> Code kompatibel
      var res = {"data": []};
      res.data = JSON.parse(xhr.responseText);

      let i=0;
      let dayCount=0;
      let i_start=0;
      let dateHelper=null;
      let dateHelperStr="";
      let startDate = new Date(this.wtInterval.start);
      let endDate = new Date(this.wtInterval.end);
      let startReached=false;
      this.noTSFound = false;
      this.buchungenMonth = [];
      this.wtInterval.sum = 0;

      while (i<res.data.length){        //Such den ersten TS <= "end"
        dateHelper = new Date(res.data[i].date)
        i++;
        if(dateHelper <= endDate) break;
      }
      if(dateHelper <= startDate) {    //Falls erstes Datum bereits <= "start"
        this.noTSFound = true;         //-> Keine TS im Zeitraum
        return 0;
      }
      dateHelperStr = dateHelper.toISOString();  //dateHelper = erstes Datum
      i_start = i-1;
                               //Unterteile in einzelne Tage bis start erreicht
      while (i<res.data.length && !startReached){

        while (i<res.data.length) {        //geh so weit, bis sich Datum ändert
          if(res.data[i].date.substr(0,10) != dateHelperStr.substr(0,10))
          {
             dateHelper = new Date(res.data[i].date) //falls <= "start" -> done
             if (dateHelper < startDate) startReached = true;
             break;                         //i ist Index des nächsten Tages
          }
          i++;
        }                                   //Teile bis i
        this.buchungenMonth[dayCount] = res.data.slice(i_start,i);
                                         //Berechne die Arbeitszeit
        let workTimeSum = this.globVars.calcWorkTime(this.buchungenMonth[dayCount]);
        let workTimeSumDate = new Date(workTimeSum);
        this.workTimeHours[dayCount] = workTimeSumDate.getUTCHours();
        this.workTimeMinutes[dayCount] = workTimeSumDate.getUTCMinutes();
                           //Addiere zur Gesamtsumme (in Minuten)
        let justMinutes = this.workTimeHours[dayCount]*60 + this.workTimeMinutes[dayCount]
        this.wtInterval.sum += (justMinutes);
        //Anzeige in Dezimaldarstellung
        this.workTimeHoursDezim[dayCount] = (justMinutes /60).toFixed(2);

        dateHelperStr = dateHelper.toISOString();    //Update auf neuen Tag
        i_start = i;
        i++;
        dayCount++;
      }

      this.wtInterval.Hours = Math.floor(this.wtInterval.sum / 60);
      this.wtInterval.Minutes = this.wtInterval.sum % 60;
      this.wtInterval.HoursDezim = (this.wtInterval.sum / 60).toFixed(2);

    }
  }
    //Ruf getstamps.php mit der userid und hol 1000 TS
    if (this.globVars.testFlag==0) {
      xhr.open("GET", "https://ordination-kutschera.at/zen/php/getstamps.php?userid=" + this.globVars.globCurrUser.userID + "&amount=1000", true);
    }
    else {
      xhr.open("GET", "/server/getstamps.php?userid=" + this.globVars.globCurrUser.userID + "&amount=1000", true);
    }
  xhr.send();
}

  //BACKEND-Backup, delete when PHP works without errors
/*
public calcInterval(){
    let params = {
      filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
      sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
      pageSize: 1000
    }
                                            //Hole letze 1000 TS dieses Users
    this.backand.object.getList('Timestamps2', params)
     .then((res: any) => {
       let i=0;
       let dayCount=0;
       let i_start=0;
       let dateHelper=null;
       let dateHelperStr="";
       let startDate = new Date(this.wtInterval.start);
       let endDate = new Date(this.wtInterval.end);
       let startReached=false;
       this.noTSFound = false;
       this.buchungenMonth = [];
       this.wtInterval.sum = 0;

       while (i<res.data.length){        //Such den ersten TS <= "end"
         dateHelper = new Date(res.data[i].date)
         i++;
         if(dateHelper <= endDate) break;
       }
       if(dateHelper <= startDate) {    //Falls erstes Datum bereits <= "start"
         this.noTSFound = true;         //-> Keine TS im Zeitraum
         return 0;
       }
       dateHelperStr = dateHelper.toISOString();  //dateHelper = erstes Datum
       i_start = i-1;
                                //Unterteile in einzelne Tage bis start erreicht
       while (i<res.data.length && !startReached){

         while (i<res.data.length) {        //geh so weit, bis sich Datum ändert
           if(res.data[i].date.substr(0,10) != dateHelperStr.substr(0,10))
           {
              dateHelper = new Date(res.data[i].date) //falls <= "start" -> done
              if (dateHelper < startDate) startReached = true;
              break;                         //i ist Index des nächsten Tages
           }
           i++;
         }                                   //Teile bis i
         this.buchungenMonth[dayCount] = res.data.slice(i_start,i);
                                          //Berechne die Arbeitszeit
         let workTimeSum = this.globVars.calcWorkTime(this.buchungenMonth[dayCount]);
         let workTimeSumDate = new Date(workTimeSum);
         this.workTimeHours[dayCount] = workTimeSumDate.getUTCHours();
         this.workTimeMinutes[dayCount] = workTimeSumDate.getUTCMinutes();
                            //Addiere zur Gesamtsumme (in Minuten)
         let justMinutes = this.workTimeHours[dayCount]*60 + this.workTimeMinutes[dayCount]
         this.wtInterval.sum += (justMinutes);
         //Anzeige in Dezimaldarstellung
         this.workTimeHoursDezim[dayCount] = (justMinutes /60).toFixed(2);

         dateHelperStr = dateHelper.toISOString();    //Update auf neuen Tag
         i_start = i;
         i++;
         dayCount++;
       }

       this.wtInterval.Hours = Math.floor(this.wtInterval.sum / 60);
       this.wtInterval.Minutes = this.wtInterval.sum % 60;
       this.wtInterval.HoursDezim = (this.wtInterval.sum / 60).toFixed(2);


/*
       while (i<res.data.length) {            //Such den ersten TS != heute
         if(res.data[i].date.substr(0,10) !=     todayDate.toISOString().substr(0,10))
         {
           todayIndexBorder = i;
           break;
         }
         i++;
       }
       i=0;         //falls alle TS von heute -> Ende = Ende d. Liste
       if (todayIndexBorder==-1) todayIndexBorder = res.data.length + 1;

            //Hol dir die Arbeitszeit der heutigen TS und rechne sie in h/m um
       let workTimeSum = this.globVars.calcWorkTime(res.data.slice(0,todayIndexBorder))
       let workTimeSumDate = new Date(workTimeSum);
       this.workTimeHours = workTimeSumDate.getUTCHours();
       this.workTimeMinutes = workTimeSumDate.getUTCMinutes();

       this.globVars.globCurrUser.worktimeToday = workTimeSum;  //Setze globalen
       clearTimeout(this.globVars.workTimeTimeout);             //Timer
       this.globVars.workTimeCounter();

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
         //  alert(i+"-Datum:"+res.data[i].datum+"----"+res.data[i].date);
         ++i;
       };
       this.buchungentoday = res.data.slice(0,todayIndexBorder);
       this.buchungen = res.data.slice(todayIndexBorder,);
            //ist das erhaltene Array voll, blende Button ein
       if(res.data.length == this.buchungenAmount) this.endOfBuchungen = false;
       else this.endOfBuchungen = true;
*/
/*
  },
  (err: any) => {
    alert(err.data);

  });

}
*/

}
