import {Component} from '@angular/core';
import 'rxjs/Rx'
//import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
//import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
@Component({
    templateUrl: 'team.html',
    selector: 'page-extras',
})
export class TeamPage {

  public users:any[]=[];
    //private backand: BackandService
  constructor(public navCtrl: NavController, public globVars: GlobalVars) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    this.reloadTeamPHP(null);
  };

    //Aufruf mit (1) sortiert alphabetisch, (0) zeitlich
  changeSort(alpha:boolean){
    if(alpha){
      this.globVars.teamSortAlpha = true;
    }
    else{
      this.globVars.teamSortAlpha = false;
    }
    this.reloadTeamPHP(null);
  }


    // Kopie von ReloadTeam --> PHP
    // Falls mit Parameter aufgerufen -> Refresher-Objekt für Pull-Reload

reloadTeamPHP(refresher){
  let sortby: String;
  let direction: String;
  if (this.globVars.teamSortAlpha) {      //alphabetisch sortiert
      sortby = "name";
      direction = "ASC";
  }
  else {                                  //nach Zeitpunkt sortiert
    sortby = "lasttimestampISO";
    direction = "DESC";
  };

  var xhr = new XMLHttpRequest();
    //Sobald Request bereit, hol dir die entsprechenden USER
  xhr.onreadystatechange = () => {
    if ((xhr.readyState == 4) && (xhr.status == 200 )) {
        this.users = JSON.parse(xhr.responseText);
      if(refresher){
        refresher.complete();
      }
    }
  }
    //Ruf reloadteam.php mit den entsprechenden Parametern auf
    if (this.globVars.testFlag == 0) {
      xhr.open("GET", "https://ordination-kutschera.at/zen/php/reloadteam.php?companyid=" + this.globVars.globCurrUser.companyid + "&sortby=" + sortby + "&direction=" + direction, true);
    }
    else {
        xhr.open("GET", "/server/reloadteam.php?companyid=" + this.globVars.globCurrUser.companyid + "&sortby=" + sortby + "&direction=" + direction, true);
    }
  xhr.send();
};
    //BACKEND-Backup
      // Falls mit Parameter aufgerufen -> Refresher-Objekt für Pull-Reload
      /*
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
*/
}
