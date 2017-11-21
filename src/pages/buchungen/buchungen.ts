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

  public buchungen:any[]=[]; // die einzelnen Buchungszeilen

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    let params = {
      filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
      sort:   this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
//      pagesize: 10,
//      page: 1
    }

    this.backand.object.getList('Timestamps', params)
     .then((res: any) => {
       let i=0;
       let weekDay="";
       let datumHelper=null;
       while (i<res.data.length) {
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
       this.buchungen = res.data;
  },
  (err: any) => {
    alert(err.data);
  });
  }
}
