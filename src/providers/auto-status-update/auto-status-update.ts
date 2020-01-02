import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { GlobalVars } from '../globalvar';

import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

/*
  Generated class for the AutoStatusUpdateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutoStatusUpdateProvider {
  private _timerlistener: Subscription = new Subscription(); // beim Schliessen unsubscribe, damit keine Memory Leaks enstehen koennen
  public subject$ = new Subject<any>();
  public timer$: Observable<number> = Observable.interval(this.globVars.autoStatusRefreshTime);

  public toastMsgs: any = []; // list of displayed messages
  constructor(public globVars: GlobalVars, private toastCtrl: ToastController /*, public http: Http*/) {

    //AutoStatusCheck:
    if (this.globVars.autoStatusCheck)
    {
      var userbuf: any[];
      this.getTeamPHPContents(null).subscribe(users => {
        userbuf = users;
      });

      //Namen, fuer die Benachrichtigungen erwuenscht sind, auslesen
      var configdata: any;
      var namexhr = new XMLHttpRequest();
      namexhr.onreadystatechange = () => {
        if (namexhr.readyState == 4) {
          if (namexhr.status == 200) {
            configdata = JSON.parse(namexhr.responseText);
          }
          //Startet alle autoStatusRefreshTime Millisekunden
          this._timerlistener = this.timer$.subscribe(() => {
              this.getTeamPHPContents(null).subscribe(users => {

                // aktualisiere TeamPage, falls aktiv
                this.subject$.next(users);

                // eigene Statusaenderung soll nicht angezeigt werden
                // vergleiche Zeitstempel
                // ob Name im Configfile
                // ob tsTyp im Configfile
                if ((users[0]['name'] != this.globVars.globCurrUser.name)
                      &&(userbuf[0]['lasttimestampISO'] != users[0].lasttimestampISO)
                      &&(namexhr.status != 200 || (typeof configdata[this.globVars.globCurrUser.name] !== 'undefined'
                                                   && configdata[this.globVars.globCurrUser.name]['names'].includes(users[0]['name'])
                                                   && configdata[this.globVars.globCurrUser.name]['tsTypes'].includes(users[0]['status']))))
                {
                  this.toastMsgs.push('Statusänderung von ' + users[0]['name'] + ' auf ' + users[0]['status'] + ".");
                  let toast = this.toastCtrl.create({
                    message: this.toastMsgs.toString().split(",").join("\n"),
                    duration: this.globVars.autoStatusToastTime,
                    showCloseButton: false,
                    position: 'middle'
                  });
                  toast.onDidDismiss(() => {});
                  toast.present();

                  switch(users[0].status) {
                    case this.globVars.tsTyp[1]:
                    case this.globVars.tsTyp[2]:
                    case this.globVars.tsTyp[3]:
                    case this.globVars.tsTyp[4]:
                    case this.globVars.tsTyp[5]:
                    case this.globVars.tsTyp[6]:
                      this.soundNotif(0); // Sound: Arbeit an
                      break;
                    case this.globVars.tsTyp[7]:
                      this.soundNotif(1); // Sound: Pause
                      break;
                    case this.globVars.tsTyp[8]:
                      this.soundNotif(2); // Sound: Urlaub
                      break;
                    case this.globVars.tsTyp[9]:
                      this.soundNotif(3); // Sound: Arbeit aus
                      break;
                    case this.globVars.tsTyp[0]:
                      this.soundNotif(4); // Sound: Krank
                    default:
                      console.log('ASU: Invalid Status detected.');
                  }
                }
                userbuf = users;
              });
            });
          }
        }
        if (this.globVars.testFlag == 0) {
          namexhr.open("GET", "https://ordination-kutschera.at/zen_bet/assets/autostatusconfig" + this.globVars.globCurrUser.companyid + ".json", true);
        }
        else {
          namexhr.open("GET", "assets/autostatusconfig2.json", true);
        }
        namexhr.send();
      }
  }

  ngOnDestroy() {
    this._timerlistener.unsubscribe();
  }

  get teamPageReload$ () {
    return this.subject$.asObservable();
  }

  // Kopie von ReloadTeam --> PHP
  // Falls mit Parameter aufgerufen -> Refresher-Objekt für Pull-Reload

public soundNotif(soundtype) {
var sndadr: string;
  switch(soundtype) {
    case 0: // Sound: Arbeit an
      sndadr = "https://ordination-kutschera.at/zen_sounds/Alarm.wav";
      break;
    case 1: // Sound: Pause
      sndadr = "https://ordination-kutschera.at/zen_sounds/Alarm2.wav";
      break;
    case 2: // Sound: Urlaub
      sndadr = "https://ordination-kutschera.at/zen_sounds/Alarm3.wav";
      break;
    case 3: // Sound: Arbeit aus
      sndadr = "https://ordination-kutschera.at/zen_sounds/Alarm4.wav";
      break;
    case 4: // Sound: Krank
      sndadr = "https://ordination-kutschera.at/zen_sounds/Alarm5.wav";
      break;
    default:
      sndadr = "https://ordination-kutschera.at/zen_sounds/Alarm.wav";
  }
  var snd = new Audio(sndadr); // buffers automatically when created
  snd.play();
}

public getTeamPHPContents(refresher): Observable<any[]> {
  return Observable.create(observer => {
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
        if(refresher){
          refresher.complete();
        }
        observer.next(JSON.parse(xhr.responseText));
      }
    }

    //Ruf reloadteam.php mit den entsprechenden Parametern auf
    if (this.globVars.testFlag == 0) {
      xhr.open("GET", "https://ordination-kutschera.at/zen/php/reloadteam.php?companyid=" + this.globVars.globCurrUser.companyid + "&sortby=" + sortby + "&direction=" + direction, true);
    }
    else {
        xhr.open("GET", "/server/zen/php/reloadteam.php?companyid=" + this.globVars.globCurrUser.companyid + "&sortby=" + sortby + "&direction=" + direction, true);
    }
    xhr.send();
  });
};

}
