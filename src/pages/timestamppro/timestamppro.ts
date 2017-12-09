import { Component,ViewChild } from '@angular/core';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'timestamppro.html',
  selector: 'page-timestamppro'
})

export class TimestampProPage {
@ViewChild('focusInput') myInput;

  constructor(public globVars: GlobalVars, public navCtrl: NavController,public keyboard: Keyboard,
    private toastCtrl: ToastController)
  {
    var currStatusNr = 0;
    this.globVars.timer=this.globVars.logouttime;
    //  this.globVars.countDown();
    while (this.globVars.globCurrUser.status != this.globVars.tsTyp[currStatusNr]) {
      ++currStatusNr;
    }
    if (currStatusNr >=1 && currStatusNr <=6 ) globVars.workTimeRuns=true
    else globVars.workTimeRuns=false;
    this.globVars.globCurrUser.worktimeToday=0;
    this.globVars.workTimeCounter();
  //  alert("in Timestamppro1:"+this.globVars.currPlatform);
  }

  ionViewDidEnter() {
    this.globVars.comment = '';
    if (this.globVars.currPlatform=="Desktop")
      setTimeout(() => {
        this.myInput.setFocus();
      },400);
    if (this.globVars.currPlatform=="Handy") this.keyboard.close();
  }

  public handleTEXT(){
    let buchungOK = true;  // bekommt erst eine Bedeutung, wenn ABBRUCH der Buchung möglich
    let uhrZeit = false;
    if (buchungOK) {
      let ziffern = ['0','1','2','3','4','5','6','7','8','9'];
      //prüfen, ob letzter Buchstabe des Kommentars eine Zahl ist - Zahl hinter Kommentar wichtiger, als Zahl vorne
      if (ziffern.indexOf(this.globVars.comment.charAt(this.globVars.comment.length-1)) != -1) {
        // hinten steht eine Arbeits-Typ-Zahl oder eine Uhrzeit
        let uhrZiffern = ['0','1','2','3','4','5','6'];
        var uhr = this.globVars.comment.substr(this.globVars.comment.length-5);
        alert ("Uhr:"+ uhr+"!");
        if ((uhrZiffern.indexOf(uhr[0]) !=-1) && (uhrZiffern.indexOf(uhr[1]) !=-10) && (uhr[2] ==':')
        && (uhrZiffern.indexOf(uhr[3]) !=-1) && (ziffern.indexOf(uhr[4]) !=-1)) {  // sind nur Uhrzeit-Ziffern
          if ((Number((uhr[0]+uhr[1])) >= 0) && (Number((uhr[0]+uhr[1])) <= 23) && (Number((uhr[3]+uhr[4])) <= 59) ) { // ist wirklich Uhrzeit
            alert("=Uhrzeit!");
            uhrZeit = true;
          }
          else uhrZeit = false;
        }
        if ((this.globVars.comment.length>1) && !uhrZeit) { // -> vorne dazu geben, wenn länger als 1 und keine uhrZeit -> normal abhandeln
          this.globVars.comment = this.globVars.comment.charAt(this.globVars.comment.length-1) +
          this.globVars.comment.substr(0,this.globVars.comment.length-1);
        }
      } // hier gehts weiter, nachdem ein etwaig hinten angehängter Arbeits-Typ nach vor kopiert wurde
      if (ziffern.indexOf(this.globVars.comment.charAt(0)) != -1) { // Es steht eine Zahl vorne = Arbeits-Typ
alert("Zahl vorne");
        let tsTypeNr = Number(this.globVars.comment.charAt(0));
        this.globVars.comment = this.globVars.comment.substr(1).trim();
        var comment = prompt("["+this.globVars.tsTyp[tsTypeNr]+"] - Kommentar:", this.globVars.comment);
        if (comment !== null) {  // kein Abbruch der Buchung
          this.globVars.comment = comment;
          this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
          let toast = this.toastCtrl.create({
            message: 'Zeitstempel wurde eingetragen',
            duration: 3000,
            showCloseButton: false,
            position: 'top'
          });
          toast.onDidDismiss(() => {});
          toast.present();
          this.globVars.comment="";
        }
        else { // Abbruch der Kommentar-Abfrage -> keine Buchung
alert("Abbruch, obwohl Zahl vorne");
          let toast = this.toastCtrl.create({
            message: '!!!KEIN!!! Zeitstempel - Buchung wurde durch User abgebrochen',
            duration: 4000,
            showCloseButton: false,
            position: 'middle'
          });
          toast.onDidDismiss(() => {});
          toast.present();
          this.globVars.comment="";
        };
      } // End-If:  Es steht eine Zahl vorne = Arbeits-Typ
      else {    //1. Buchstabe keine Zahl; -> Arbeits-Typ wird autom auf aktuellen gesetzt
        //this.globVars.comment="";
        var tsTypeNr = this.globVars.tsTyp.indexOf(this.globVars.globCurrUser.status);
        var comment = prompt("["+this.globVars.tsTyp[tsTypeNr]+"] - Kommentar:", this.globVars.comment);
        if (comment !== null) {  // kein Abbruch der Buchung
          this.globVars.comment = comment;
          this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
          let toast = this.toastCtrl.create({
            message: 'Zeitstempel wurde eingetragen',
            duration: 3000,
            showCloseButton: false,
            position: 'top'
          });
          toast.onDidDismiss(() => {});
          toast.present();
          this.globVars.comment="";
        }
        else { // Abbruch der Kommentar-Abfrage -> keine Buchung
          let toast = this.toastCtrl.create({
            message: '!!!KEIN!!! Zeitstempel eingetragen - Buchung wurde durch User abgebrochen',
            duration: 4000,
            showCloseButton: false,
            position: 'middle'
          });
          toast.onDidDismiss(() => {});
          toast.present();
          this.globVars.comment="";
        };
      }; // End-Else (1. Buchst keine Zahl - Auto-Ergänzung Stempel)
      if (this.globVars.currPlatform=="Desktop") {
        setTimeout(() => {
          this.myInput.setFocus();
        },4150);
      };
      if (this.globVars.currPlatform=="Handy") this.keyboard.close();
    }
  }

  public timestampClick(tsTypeNr:number){
    let buchungOK = true;  // bekommt erst eine Bedeutung, wenn ABBRUCH der Buchung möglich
    if (buchungOK) {
      var comment = prompt("["+this.globVars.tsTyp[tsTypeNr]+"] - Kommentar:", this.globVars.comment);
      if (!(comment == null || comment == "")) {
        this.globVars.comment = comment;
      }
      this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
      let toast = this.toastCtrl.create({
        message: 'Zeitstempel wurde eingetragen',
        duration: 3000,
        closeButtonText: 'Abbruch',
        showCloseButton: false,
        position: 'top'
      });
      toast.onDidDismiss(() => {});
      toast.present();
    };
    if (this.globVars.currPlatform=="Desktop")
    setTimeout(() => {
      this.myInput.setFocus();
    },3400);
    if (this.globVars.currPlatform=="Handy") this.keyboard.close();
  }


}
