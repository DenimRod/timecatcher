import {Component} from '@angular/core';
import 'rxjs/Rx'
//import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
//import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';
import { Buchungen_fremdPage } from '../buchungen_fremd/buchungen_fremd';

import { AutoStatusUpdateProvider } from '../../providers/auto-status-update/auto-status-update';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'team.html',
    selector: 'page-team', //passt das?
})
export class TeamPage {

  public users:any[]=[];
  private _listener: Subscription = new Subscription();
  private _refListener: Subscription = new Subscription();
    //private backand: BackandService
  constructor(public navCtrl: NavController, public globVars: GlobalVars,  public asprovider: AutoStatusUpdateProvider) {
    //this.globVars.timer=30;
  }

  ionViewWillEnter() {
    //  aktualisiere TeamPage, falls aktiv
    this.reloadTeamPHP(null);
    this._listener = this.asprovider.teamPageReload$.subscribe(users => {
        this.users = users;
    });
  }

  ionViewDidLeave() {
    this._listener.unsubscribe();
    this._refListener.unsubscribe();
  }

  ngOnDestroy() {
    this._listener.unsubscribe();
    this._refListener.unsubscribe();
  }

  getAlienBuchungen(alienName:String){
    this.globVars.globAlienUserName = alienName;
    //getuserid.php mit fremdem Namen und eigener company aufrufen
    var xhr = new XMLHttpRequest();

      //Sobald Request bereit, setze AlienUserID und ruf buchungen_fremd auf
    xhr.onreadystatechange = () => {
      if ((xhr.readyState == 4) && (xhr.status == 200 )) {
          let res = {"data": []};
          res.data = JSON.parse(xhr.responseText);
          this.globVars.globAlienUserID = res.data[0].id;

          this.navCtrl.push(Buchungen_fremdPage);
      }
    }
      //Ruf getuserid.php mit den entsprechenden Parametern auf
      if (this.globVars.testFlag == 0) {
        xhr.open("GET", "https://ordination-kutschera.at/zen/php/getuserid.php?name=" + alienName + "&companyid=" + this.globVars.globCurrUser.companyid, true);
      }
      else {
          xhr.open("GET", "/server/zen/php/getuserid.php?name=" + alienName + "&companyid=" + this.globVars.globCurrUser.companyid, true);
      }
    xhr.send();
  }

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
  this._refListener = this.asprovider.getTeamPHPContents(refresher).subscribe(users => {
    this.users = users;
  });
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
