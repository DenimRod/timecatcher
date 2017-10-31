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

  public items:any[]=[];

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
    this.globVars.timer=30;
    let params = {
      filter: [
        this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
      ],
    }

    this.backand.object.getList('Users', params)
     .then((res: any) => {
       this.items = res.data;

  },
  (err: any) => {
    alert(err.data);
  });

  }
}
