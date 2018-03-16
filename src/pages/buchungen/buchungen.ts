import {Component} from '@angular/core';
import 'rxjs/Rx'
//import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
//import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
@Component({
    templateUrl: 'buchungen.html',
    selector: 'page-buchungen',
})
export class BuchungenPage {

  public buchungen:any[]=[]; // die einzelnen Buchungszeilen (ex. heute)
  public buchungentoday:any[]=[];
  public buchungenlastDay:any[]=[];
  public workTimeHoursDezim = "";
  public workTimeHoursDezimLD = "";
  public workTimeHours = 0;
  public workTimeHoursLD = 0;
  public workTimeMinutes = 0;
  public workTimeMinutesLD = 0;
  public nextBuchungenPage = 2;
  public endOfBuchungen = true;
  public buchungenAmount = 20;

    //BACKAND-Backup: private backand: BackandService,
  constructor(public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    this.reloadBuchungenPHP(null);
    this.buchungenAmount = 20;
  }

    //Kopie von unten -> PHP
  public reloadBuchungenPHP(refresher){
    this.nextBuchungenPage = 2;         //sobald refesht wird --> Reset aller TS

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if ((xhr.readyState == 4) && (xhr.status == 200 )) {
          //res Objekt erstellen, analog zu Back& -> Code kompatibel
        var res = {"data": []};
        res.data = JSON.parse(xhr.responseText);

        let i=0;
        let weekDay="";
        let datumHelper=null;
        let todayIndexBorder=-1;
        let todayDate = new Date();

        while (i<res.data.length) {            //Such den ersten TS != heute
          if(res.data[i].date.substr(0,10) !=     todayDate.toISOString().substr(0,10))
          {
            todayIndexBorder = i;
            i++;
            break;
          }
          i++;
        }
        //i=0;         //falls alle TS von heute -> Ende = Ende d. Liste
        if (todayIndexBorder==-1) todayIndexBorder = res.data.length + 1;

             //Hol dir die Arbeitszeit der heutigen TS und rechne sie in h/m um
        let calcResult = this.globVars.calcWorkTime(res.data.slice(0,todayIndexBorder));
        let workTimeSum = calcResult.sum;
        let workTimeSumDate = new Date(workTimeSum);
        this.workTimeHours = workTimeSumDate.getUTCHours();
        this.workTimeMinutes = workTimeSumDate.getUTCMinutes();
             //Anzeige in Dezimaldarstellung
        let justMinutes = this.workTimeHours*60 + this.workTimeMinutes
        this.workTimeHoursDezim = (justMinutes / 60).toFixed(2);

        this.globVars.globCurrUser.worktimeToday = workTimeSum;  //Setze globalen
        clearTimeout(this.globVars.workTimeTimeout);             //Timer
        this.globVars.workTimeCounter();

            //Hol dir die Errors/Warnings aus der Arbeitszeitberechnung
        this.globVars.msgList = calcResult.msgList;

          //repeat for "beforeLastTimestamp" -> Arbeitszeit des Vorarbeitstags
            //Nur falls nicht bereits zuvor Ende erreicht!
        let lastDayIndexBorder = todayIndexBorder;
        if(todayIndexBorder != res.data.length + 1) {
            //kreiere ein neues Referenzdatum = lastday
          let lastDay = res.data[i].date.substr(0,10);
          i++;
          while (i<res.data.length) {            //Such den ersten TS != lastday
            if(res.data[i].date.substr(0,10) != lastDay)
            {
              lastDayIndexBorder = i;
              break;
            }
            i++;
          }
          if (lastDayIndexBorder==-1) lastDayIndexBorder = res.data.length + 1;

               //Hol dir die Arbeitszeit der lastDay TS und rechne sie in h/m um
          calcResult = this.globVars.calcWorkTime(res.data.slice(todayIndexBorder,lastDayIndexBorder));
          workTimeSum = calcResult.sum;
          workTimeSumDate = new Date(workTimeSum);
          this.workTimeHoursLD = workTimeSumDate.getUTCHours();
          this.workTimeMinutesLD = workTimeSumDate.getUTCMinutes();
               //Anzeige in Dezimaldarstellung
          justMinutes = this.workTimeHoursLD*60 + this.workTimeMinutesLD
          this.workTimeHoursDezimLD = (justMinutes / 60).toFixed(2);

              //Hol dir die Errors/Warnings aus der Arbeitszeitberechnung
          this.globVars.msgListLD = calcResult.msgList;
        }
        i==0;

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
        this.buchungenlastDay = res.data.slice(todayIndexBorder,lastDayIndexBorder);
        this.buchungen = res.data.slice(lastDayIndexBorder,);
             //ist das erhaltene Array voll, blende Button ein
        if(res.data.length == this.buchungenAmount) this.endOfBuchungen = false;
        else this.endOfBuchungen = true;

        if(refresher){
         refresher.complete();
        }

      }
    }
      //Ruf getstamps.php mit der userid und amount auf
      if (this.globVars.testFlag==0) {
        xhr.open("GET", "https://ordination-kutschera.at/zen/php/getstamps.php?userid=" + this.globVars.globCurrUser.userID + "&amount=" + this.buchungenAmount, true);
      }
      else {
            xhr.open("GET", "/server/getstamps.php?userid=" + this.globVars.globCurrUser.userID + "&amount=" + this.buchungenAmount, true);
      }

    xhr.send();
  }

  public moreBuchungen500(){
    this.buchungenAmount += 500;
    this.reloadBuchungenPHP(null);
  }

  //BACKAND-Backup
/*
public reloadBuchungen(refresher){
  this.nextBuchungenPage = 2;         //sobald refesht wird --> Reset aller TS

  let params = {
    filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
    sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
    pageSize: this.buchungenAmount,
    pageNumber: 1,
  }
                                          //Hol die letzten TS dieses Users
  this.backand.object.getList('Timestamps2', params)
   .then((res: any) => {
     let i=0;
     let weekDay="";
     let datumHelper=null;
     let todayIndexBorder=-1;
     let todayDate = new Date();

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
          //Anzeige in Dezimaldarstellung
     let justMinutes = this.workTimeHours*60 + this.workTimeMinutes
     this.workTimeHoursDezim = (justMinutes / 60).toFixed(2);

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

    if(refresher){
      refresher.complete();
    }
  },
  (err: any) => {
    alert(err.data);
    if(refresher){
      refresher.complete();
    }
  }
);
}
*/
}
