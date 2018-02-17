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

  constructor(public globVars: GlobalVars, public navCtrl: NavController,public keyboard: Keyboard, private toastCtrl: ToastController)
  {
    var currStatusNr = 0;
    this.globVars.timer=this.globVars.logoutTime;
    if (this.globVars.autoLogout) this.globVars.countDown();
    while (this.globVars.globCurrUser.status != this.globVars.tsTyp[currStatusNr])
    { ++currStatusNr; }

    if (currStatusNr >=1 && currStatusNr <=6 ) globVars.workTimeRuns=true
    else globVars.workTimeRuns=false;
    this.globVars.globCurrUser.worktimeToday=0;
    this.globVars.workTimeCounter();
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
    this.globVars.comment = this.globVars.comment.trim();
    let buchungOK = true;  // bekommt erst eine Bedeutung, wenn ABBRUCH der Buchung möglich
    let uhrZeit = false;
    if (buchungOK) {
      let ziffern = ['0','1','2','3','4','5','6','7','8','9'];
      //prüfen, ob letzte 2 Buchstaben des Kommentars eine Space + eine Zahl ist - Zahl hinter Kommentar wichtiger, als Zahl vorne
      if (this.globVars.comment.length>1){ //mehr als nur 1 Zeichen Kommentar
        if ((ziffern.indexOf(this.globVars.comment.charAt(this.globVars.comment.length-1)) != -1) && (this.globVars.comment.charAt(this.globVars.comment.length-2) ==' ')) {
//alert("Länge >1 + hinten steht eine Arbeits-Typ-Zahl, keine Uhrzeit -> umdrehen!");
          this.globVars.comment = this.globVars.comment.charAt(this.globVars.comment.length-1) +
            this.globVars.comment.substr(0,this.globVars.comment.length-1);
//alert("umgedreht:"+this.globVars.comment);
        }
      } // hier gehts weiter, nachdem ein etwaig hinten angehängter Arbeits-Typ nach vor kopiert wurde
      if (ziffern.indexOf(this.globVars.comment.charAt(0)) != -1) { // Es steht eine Zahl vorne = Arbeits-Typ
//alert("Zahl vorne");
        let tsTypeNr = Number(this.globVars.comment.charAt(0));
        this.globVars.comment = this.globVars.comment.substr(1).trim();
        var comment = prompt("["+this.globVars.tsTyp[tsTypeNr]+"] - Kommentar:", this.globVars.comment);
        if (comment !== null) {  // kein Abbruch der Buchung
          this.globVars.comment = comment;
          this.globVars.makeStampPHP(this.globVars.tsTyp[tsTypeNr]);
        }
        else { // Abbruch der Kommentar-Abfrage -> keine Buchung
//alert("Abbruch durch User, obwohl Zahl vorne");
          let toast = this.toastCtrl.create({
            message: '!!!KEIN!!! Zeitstempel - Buchung wurde durch User abgebrochen',
            duration: 4000,
            showCloseButton: false,
            position: 'middle'
          });
          toast.onDidDismiss(() => {});
          toast.present();
  //        this.globVars.comment="";
        };
      } // End-If:  Es steht eine Zahl vorne = Arbeits-Typ
      else {    //1. Buchstabe keine Zahl; -> Arbeits-Typ wird autom auf aktuellen gesetzt
        //this.globVars.comment="";
        var tsTypeNr = this.globVars.tsTyp.indexOf(this.globVars.globCurrUser.status);
        var comment = prompt("["+this.globVars.tsTyp[tsTypeNr]+"] - Kommentar:", this.globVars.comment);
        if (comment !== null) {  // kein Abbruch der Buchung
          this.globVars.comment = comment;
          this.globVars.makeStampPHP(this.globVars.tsTyp[tsTypeNr]);
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
      //    this.globVars.comment="";
        };
      }; // End-Else (1. Buchst keine Zahl - Auto-Ergänzung Stempel)
      if (this.globVars.currPlatform=="Desktop") {
        setTimeout(() => {
          this.myInput.setFocus();
        },5000);
      };
      if (this.globVars.currPlatform=="Handy") this.keyboard.close();
    }
  }

  public timestampClick(tsTypeNr:number){
    this.globVars.comment = this.globVars.comment.trim();
    let buchungOK = true;  // bekommt erst eine Bedeutung, wenn ABBRUCH der Buchung möglich
    if (buchungOK) {
      var comment = prompt("["+this.globVars.tsTyp[tsTypeNr]+"] - Kommentar:", this.globVars.comment);
    /*  if (!(comment == null || comment == "")) {
        this.globVars.comment = comment;
      }
      */
      if (comment !== null) { // kein Abbruch
        this.globVars.comment = comment;
        this.globVars.makeStampPHP(this.globVars.tsTyp[tsTypeNr]);
      }
      else {
        let toast = this.toastCtrl.create({
          message: '!!!KEIN!!! Zeitstempel eingetragen - Buchung wurde durch User abgebrochen',
          duration: 4000,
          showCloseButton: false,
          position: 'middle'
        });
        toast.onDidDismiss(() => {});
        toast.present();
      };
    };
    if (this.globVars.currPlatform=="Desktop")
    setTimeout(() => {
      this.myInput.setFocus();
    },5000);
    if (this.globVars.currPlatform=="Handy") this.keyboard.close();
  }

}
