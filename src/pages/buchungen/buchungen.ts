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

  public users:any[]=[];
  
  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    let params = {
      filter: [
        this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
      ],
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
