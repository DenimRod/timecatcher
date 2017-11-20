import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
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
    let params = {
      filter:
        this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
      sort:   this.backand.helpers.sort.create('name', this.backand.helpers.sort.orders.asc)
    }

    this.backand.object.getList('Users', params)
     .then((res: any) => {
       this.users = res.data;
       //alert("!");

  },
  (err: any) => {
    alert(err.data);
  });
  }

}
