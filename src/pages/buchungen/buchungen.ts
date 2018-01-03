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
  public workTimeHours = 0;
  public workTimeMinutes = 0;
  public nextBuchungenPage = 2;
  public endOfBuchungen = false;

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    this.reloadBuchungen(null);

  }

public reloadBuchungen(refresher){
  this.nextBuchungenPage = 2;         //sobald refesht wird --> Reset aller TS
  this.endOfBuchungen = false;  // Evtl: gleich schauen ob überhaupt >20

  let params = {
    filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
    sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
    pageSize: 20,
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
     let workTimeSum = new Date(this.globVars.calcWorkTime(res.data.slice(0,todayIndexBorder)));
     this.workTimeHours = workTimeSum.getUTCHours();
     this.workTimeMinutes = workTimeSum.getUTCMinutes();

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
     this.buchungentoday = res.data.slice(0,todayIndexBorder);
     this.buchungen = res.data.slice(todayIndexBorder,);
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

public moreBuchungen(){

  let params = {
    filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
    sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
    pageSize: 20,

    pageNumber: this.nextBuchungenPage,      //Hol die nächste Seite
  }
      alert(this.nextBuchungenPage);
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
