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
       this.buchungen = res.data;
       //alert("!");
  },
  (err: any) => {
    alert(err.data);
  });
  }

}
