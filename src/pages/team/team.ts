import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
@Component({
    templateUrl: 'team.html',
    selector: 'page-extras',
})
export class TeamPage {

  public users:any[]=[];

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    this.reloadTeam(null);
  };

  //Aufruf mit (1) sortiert alphabetisch, (0) zeitlich
  changeSort(alpha:boolean){
    if(alpha){
      this.globVars.teamSortAlpha = true;
    }
    else{
      this.globVars.teamSortAlpha = false;
    }
    this.reloadTeam(null);
  }

    // Falls mit Parameter aufgerufen -> Refresher-Objekt für Pull-Reload
  reloadTeam(refresher){
    let params: any;
    if (this.globVars.teamSortAlpha) {      //alphabetisch sortiert
      params = {
        filter:
          this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
        sort:   this.backand.helpers.sort.create('name', this.backand.helpers.sort.orders.asc)
      }
    }
    else {                                  //nach Zeitpunkt sortiert
      params = {
      filter:
        this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
      sort:   this.backand.helpers.sort.create('lasttimestampISO', this.backand.helpers.sort.orders.desc)
      }
    };
    this.backand.object.getList('Users', params)
     .then((res: any) => {
       this.users = res.data;
       //alert("!");
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
  };

}
