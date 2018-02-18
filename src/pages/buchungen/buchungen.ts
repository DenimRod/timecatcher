import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
@Component({
    templateUrl: 'buchungen.html',
    selector: 'page-buchungen',
})
export class BuchungenPage {

  public buchungen:any[]=[]; // die einzelnen Buchungszeilen (ex. heute)
  public buchungentoday:any[]=[];
  public workTimeHoursDezim = "";
  public workTimeHours = 0;
  public workTimeMinutes = 0;
  public nextBuchungenPage = 2;
  public endOfBuchungen = true;
  public buchungenAmount = 20;

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
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

      }
    }
      //Ruf reloadbuchungen.php mit der userid auf
    xhr.open("GET", "/server/reloadbuchungen.php?userid=" + this.globVars.globCurrUser.userID, true);
    xhr.send();

  }

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
});
}

public moreBuchungen500(){
  this.buchungenAmount += 500;
  this.reloadBuchungen(null);
}

public moreBuchungen(){

  let params = {
    filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
    sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
    pageSize: 20,

    pageNumber: this.nextBuchungenPage,      //Hol die nächste Seite
  }
  this.backand.object.getList('Timestamps2', params)
   .then((res: any) => {
     let i=0;
     let weekDay="";
     let datumHelper=null;

     while (i<res.data.length) {          //UTC Strings -> Lokale Zeit
       datumHelper = new Date(res.data[i].date);
       res.data[i].date = datumHelper.toString().substr(0,21);
       weekDay=res.data[i].date.substr(0,3)
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
     this.buchungen = this.buchungen.concat(res.data)
     if(res.data.length < 20){
       this.endOfBuchungen = true;
     }

},
(err: any) => {
  alert(err.data);
});
this.nextBuchungenPage++;
}

}
