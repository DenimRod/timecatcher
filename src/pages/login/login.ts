import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { TabsProPage } from '../tabspro/tabspro';
import { GlobalVars } from '../../providers/globalvar';
import { Platform } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { NFC, Ndef } from '@ionic-native/nfc';
//import { LocalNotifications } from 'ionic-native';

//angeblich notwendig, damit die Dialoge "aktiviert" werden.
/*function onDeviceReady() {
    alert('onDevReady'+'navigator.notification');
}
*/
@Component({
    templateUrl: 'login.html',
    selector: 'page-login',
})
export class LoginPage {
  @ViewChild('focusInput') myInput;

  public textInput:string = ''; // = eingegebene Textzeile für Commandos und User-PIN
  inputID:string = ''; // = User-ID aus Text-Input-String

  public items:any[] = [];
  public login: any[]=[];
  public allusers:any[] = [];
  public onHandy:boolean=false;

    //private backand: BackandService,
  constructor(public navCtrl: NavController, public globVars: GlobalVars,
     public plt: Platform, private dialogs: Dialogs,private nfc: NFC, private ndef: Ndef,
     // private localNotifications: LocalNotifications
  ) {  }


  NFC_onSuccess()
  { alert ("onSuccess")};

  NFC_onError()
  { alert ("onError")};

  ionViewDidEnter() {
/*    var myWindow = window.open("", "MsgWindow", "width=200,height=100");
    myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
alert("Test"+this.globVars.pinLength);
*/

// Schedule delayed notification

/* plugin local-notification v0.9. macht PRobleme beim Compilieren für Android
LocalNotifications.schedule({
   text: 'Alarm has expired!',
   at: new Date(new Date().getTime() + 3600),
  // sound: isAndroid ? 'file://sound.mp3': 'file://beep.caf',
   data: { message : 'json containing app-specific information to be posted when alarm triggers' }
});
*/
/* var browserRef = this.inAppBrowser.create(
        'https://twitter.com',
        "_system",
        "location=no,hidden=no,zoom=no"
      );
*/

    if (this.plt.is('cordova')) {   // soll nur dann aktiviert werden, wenn auf MOBILE (mit NFC)
      this.nfc.addNdefListener(
        () => {alert('successfully anttached ndef listener')},
        (err) => { alert('error attaching ndef listener' + err);}
      )
      .subscribe((event) => {
        alert('received ndef message. the tag contains: ' + event.tag);
        alert('decoded tag id' + this.nfc.bytesToHexString(event.tag.id));
        let message = this.ndef.textRecord("Hello world","UTF-8","8");
        this.nfc.share([message])
        .then (this.NFC_onSuccess)
          //  {        alert ("onSuccess")}
        .catch (this.NFC_onError)
         //{alert ("onError")};
       });
    }
// DIV JS - Tests+Vorlagen ---- hier beste Stelle, um etwas auszuprobieren !!!!!!
/*
//  --- XML --- einzelne Phasen + xhr-status --------------
    var xhr = new XMLHttpRequest();
    alert('UNSENT'+ xhr.status);
    xhr.open('GET', 'https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status', true);
    alert('OPENED'+ xhr.status);

    xhr.onprogress = function () {
      alert('LOADING'+ xhr.status);
    };

    xhr.onload = function () {
      alert('DONE'+ xhr.status);
    };
  //  xhr.open("GET", "http://graz-hautarzt.at/files/ri_test.php", true);

    xhr.send(null);

    /**
     * Outputs the following:
     *
     * UNSENT 0
     * OPENED 0
     * LOADING 200
     * DONE 200

     */
// -------------------------------------------------------------
/* PHP TEST 2
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    //alert("work... State:"+xhr.readyState+"Status:"+xhr.status);
    if ((xhr.readyState == 4) && (xhr.status == 200 )) { // || true )) {
      //alert("header:" + this.getAllResponseHeaders() + 'Status:'+ xhr.status);
      //if (xhr.responseText == "") alert("no response!")
      //else
      alert("resp:" + xhr.responseText);
      var myObj = JSON.parse(xhr.responseText);
      alert("OBJ:"+JSON.stringify(myObj))
      //}
    }
    //else alert("FEHLER!-state:"+xmlhttp.readyState+"status:"+xmlhttp.status);
}
xhr.open("GET", "/server/ri_test.php?param=1", true);
xhr.send();
//alert("warten...");
*/

  if (!this.globVars.autoLogout){
      this.textInput = '';
      setTimeout(() => {
        this.myInput.setFocus();
      },150);
  }

//not so crazy workaround for no login
  if(this.globVars.testFlag==2){
    this.inputID = "333";
    this.checkUserPHP();
  }
  if(this.globVars.testFlag==3){
    this.inputID = "222";
    this.checkUserPHP();
  }
}
/*
  if (this.plt.is('core')) {
      // This will only print when on Desktop
      alert("Zeiterfassung läuft auf Desktop-PC!")
  }
  else alert("Zeiterfassung läuft auf Handy!");

ABFRAGE FÜR HANDY/DESKTOP */

  public loginClear() {
    this.textInput = "";
    this.inputID ="";
  };

  public handleText(){
    // wenn Eingabe mit "r" beginnt, dann RegistrierungsCode !!!
    if (this.textInput[0]=="r"){
      let i=-1;
      do {
        i++;
  //      alert("handleText--I: "+i+"Anz:"+this.globVars.devAnzahl);
      }
      while ((i<this.globVars.devAnzahl) && (this.globVars.ZEN_Devices[i].devCode!==this.textInput));
      if (this.globVars.ZEN_Devices[i].devCode==this.textInput) {        // soll registriert werden!
        alert("Eingabe-Text ist ein Reg.Code"+this.globVars.ZEN_Devices[i].MA+"---geplant: Registrierung schreiben+Eintrag, dass registriert")//Registrierung schreiben
        //weiter zu CheckUser
        this.inputID=this.globVars.ZEN_Devices[i].usrPin;
        this.checkUserPHP();
        return;
      }
      // wenn kein Reg-Code gefunden, obwohl "r" erster Buchstabe ist
      alert("es wurde kein Reg-Code gefunden, obwohl 'r' erster Buchstabe ist");
      this.textInput="";
      return;
    };
    //else {     // es ist eine normale PIN-Eingabe -> Suche nach User
    //alert("normale PIN oder hinter Reg-Code");
  /*  let tempId = "";
    for(var i=0;i<this.globVars.pinLength;i++){
      tempId += this.textInput.charAt(i);
    }
    this.inputID = tempId; */

    this.inputID = this.textInput;
    this.checkUserPHP();
    }

  public handlePIN(inputNumber:string){
    //if (inputNumber == "1"){
    //  alert("1 wurde eingegeben-Zeit läuft");
    //};
    //if (inputNumber == "2"){
    //  alert("2 wurde eingegeben-Zeit angehalten");
    //};
    this.inputID += inputNumber;
    this.textInput += inputNumber;
    if (this.inputID.length == this.globVars.pinLength){
      this.checkUserPHP();
    }
  }

  //Verwendt login.php um den User mittels PIN einzuloggen
public checkUserPHP(){
  var xhr = new XMLHttpRequest();
    //Sobald Request bereit, hol dir den entsprechenden USER
  xhr.onreadystatechange = () => {
    if ((xhr.readyState == 4) && (xhr.status == 200 )) {
      this.items = JSON.parse(xhr.responseText);
        //zumindest 1 User wurde gefunden-> nimm den 1. in der Liste
      if (this.items.length > 0) {
        this.globVars.globCurrUser = this.items[0];


        var insert_id: number;

        var xhr1 = new XMLHttpRequest();
          //Sobald Request bereit, schreib den TS und warte auf Erfolg
        xhr1.onreadystatechange = () => {
          if ((xhr1.readyState == 4) && (xhr1.status == 200 )) {
            insert_id = Number(xhr1.responseText);

            var xhr2 = new XMLHttpRequest();
              //Sobald Request bereit, schreib den TS und warte auf Erfolg
            xhr2.onreadystatechange = () => {
              if ((xhr2.readyState == 4) && (xhr2.status == 200 )) {
                var loginRec: any;
                this.login = JSON.parse(xhr2.responseText);

                  // hole Client-Zeit
                let clientMilliSec = Date.now();
                this.globVars.clientDate = new Date(Date.now());
                  // hole Server-Zeit aus geschriebenen Login-rec
                loginRec = this.login[0];


                //loginRec.createdAt = loginRec.createdAt.substr(0, 10) + 'T' + loginRec.createdAt.substr(11) + 'Z';
                //Diese Lösung hat Problem: Zeitzone 2x berechnet

                this.globVars.serverDate = new Date(loginRec.createdAt.substr(0, 10));
                this.globVars.serverDate.setHours(loginRec.createdAt.substr(11, 2));
                this.globVars.serverDate.setMinutes(loginRec.createdAt.substr(14, 2));
                this.globVars.serverDate.setSeconds(loginRec.createdAt.substr(17, 2));

                let servMilliSec = this.globVars.serverDate.getTime();
                  //NICHT NOTWENDIG:
                  //Korrektur, da Zeitzone 2x (Mysql, JS) einberechnet wird
                  //servMilliSec = servMilliSec - (60*60*1000);

                this.globVars.clientDateDiff = clientMilliSec - servMilliSec;

                // Beispiele: auf Ri-Erazer: +1500ms
            //    alert("sms:" + servMilliSec + "cms:" + clientMilliSec +"clientdiff-ms"+this.globVars.clientDateDiff+
            //    "CreatedAT=serverDate:" + this.globVars.serverDate.toLocaleString()+
            //    "--clientDate:" + this.globVars.clientDate.toLocaleString()+"!");

            /*  für Ausgabe des kompletten res-records:
                  let Aus1Str = JSON.stringify(loginRec).substr(1,160);
                  let Aus2Str = JSON.stringify(loginRec).substr(160,160);
                  let Aus3Str = JSON.stringify(loginRec).substr(320,160);
                  let Aus4Str = JSON.stringify(loginRec).substr(480,160);
                  let Aus5Str = JSON.stringify(loginRec).substr(640,160);
                  let Aus6Str = JSON.stringify(loginRec).substr(800,160);
                  let Aus7Str = JSON.stringify(loginRec).substr(960,160);
                  let Aus8Str = JSON.stringify(loginRec).substr(1120,160);
                  let Aus9Str = JSON.stringify(loginRec).substr(1280,160);
                  let AusaStr = JSON.stringify(loginRec).substr(1440,160);
                  let AusbStr = JSON.stringify(loginRec).substr(1600,160);
                  alert("LRec1:"+Aus1Str);
                  alert("LRec2:"+Aus2Str);
                  alert("LRec3:"+Aus3Str);
                  alert("LRec4:"+Aus4Str);
                  alert("LRec5:"+Aus5Str);
                  alert("LRec6:"+Aus6Str);
                  alert("LRec7:"+Aus7Str);
                  alert("LRec8:"+Aus8Str);
                  alert("LRec9:"+Aus9Str);
                  alert("LReca:"+Aus9Str);
                  alert("LRecb:"+Aus9Str);
            */
                // ?? ServerDatum <> letztes Timestamp-Datum? -> vorletzter Arbeitstag setzen

                var d = new Date(this.globVars.globCurrUser.lasttimestampISO);
                if (d.getDate() !== this.globVars.serverDate.getDate()){
                  // Datum d. Logins hat sich geändert -> letzter Arbeitstag speichern in vorletzter = b(efore)last...
                  // klappt nicht mit "blasttimestamp", weil Backand-DB Fehler hat : deswegen ...UTC_d (war schon für Test definiert)
                  // alert("Datum NEU: oldDate:"+d.getDate()+"newDate:"+this.globVars.serverDate.getDate());
                  this.globVars.globCurrUser.lasttimestampUTC_d = this.globVars.globCurrUser.lasttimestampISO;
                };
              }
            }
            if (this.globVars.testFlag==0) {
              xhr2.open("GET", "https://ordination-kutschera.at/zen/php/getlogin.php?loginid=" + insert_id, true);
            }
            else {
              xhr2.open("GET", "/server/getlogin.php?loginid=" + insert_id, true)
            }
            xhr2.send();
          }
        }

        let jsonLogin = '{"name":"'+this.globVars.globCurrUser.name+'", "userID":"' + this.globVars.globCurrUser.userID+'", "device":"'+this.globVars.currPlatform +':'+this.plt.platforms()+'"}'

        if (this.globVars.testFlag==0) {
          xhr1.open("GET", "https://ordination-kutschera.at/zen/php/createlogin.php?jsonString=" + jsonLogin, true);
        }
        else {
          xhr1.open("GET", "/server/createlogin.php?jsonString=" + jsonLogin, true);
        }

        xhr1.send();
/*
        .then((res1:any) => {
          let params = "";
          this.backand.object.getOne('Login',res1.data.__metadata.id, params)
          .then((res2: any) => {
*/
          //Check Userlevel pro/normal
        if (this.globVars.globCurrUser.applevel == "pro"){
          this.navCtrl.push(TabsProPage);
        }
        else {
          this.navCtrl.push(TabsPage);
        }
      }
        //sonst -> falscher PIN
      else {
        alert ("This user doesn't exist!");
      }
    }
  }
    //Ruf login.php mit der inputID als Parameter auf
    if (this.globVars.testFlag==0) {
      xhr.open("GET", "https://ordination-kutschera.at/zen/php/login.php?inputID="  + this.inputID, true);
    }
    else {
      xhr.open("GET", "/server/login.php?inputID=" + this.inputID, true);
    }

  xhr.send();
  this.inputID = '';
  this.textInput = '';
}

  //BACKAND-Backup

/*
  public checkUser(){
  // neue Idee für Tages-Arbeitszeit: wird dann auf 0 gesetzt, wenn der Übergang von
  // "Arbeit AUS" auf "Arbeit"= EIN,AD-Fahrt,...Projekt2 erfolgt.(in globalvar.ts/makestamp) Das ist der Arbeitsbeginn!
  // Arbeitszeit= Tag, Woche, Monats- Arbeitszeit
  // wenn Übergang auf "Arbeit AUS" -> Tages-Arbeitszeit nicht extra speichern
  // Problem, wenn neue Woche, neues Monat: da passt dann das untere Modell
    let params = {
      filter: [
        this.backand.helpers.filter.create('password', this.backand.helpers.filter.operators.text.equals, this.inputID),
      ],
    }
    this.backand.object.getList('Users', params)
    .then((res: any) => {
      this.items = res.data;
      if (this.items.length > 0) {  //zumindest 1 User wurde gefunden-> nehme den 1. in der Liste
        this.globVars.globCurrUser = this.items[0];

     // Time-INIT
     // gleichzeitig wird ein Eintrag in die Login-DB-Objekt gemacht -> alle Logins werden dokumentiert
          var loginRec: any;
          this.backand.object.create('Login', "{'name':'"+this.globVars.globCurrUser.name+"', 'userID':'"+
            this.globVars.globCurrUser.userID+"', 'device':'"+this.globVars.currPlatform +":"+this.plt.platforms()+"'}")

          .then((res1:any) => {
            let params = "";
            this.backand.object.getOne('Login',res1.data.__metadata.id, params)
            .then((res2: any) => {
              // hole Client-Zeit
              let clientMilliSec = Date.now();
              this.globVars.clientDate = new Date(Date.now());
              // hole Server-Zeit aus geschriebenen Login-rec
              loginRec = res2.data;
              this.globVars.serverDate = new Date(loginRec.createdAt+"Z");
              let servMilliSec = this.globVars.serverDate.getTime();
              this.globVars.clientDateDiff = clientMilliSec - servMilliSec;
              // Beispiele: auf Ri-Erazer: +1500ms
          //    alert("sms:" + servMilliSec + "cms:" + clientMilliSec +"clientdiff-ms"+this.globVars.clientDateDiff+
          //    "CreatedAT=serverDate:" + this.globVars.serverDate.toLocaleString()+
          //    "--clientDate:" + this.globVars.clientDate.toLocaleString()+"!");

          /*  für Ausgabe des kompletten res-records:
                let Aus1Str = JSON.stringify(loginRec).substr(1,160);
                let Aus2Str = JSON.stringify(loginRec).substr(160,160);
                let Aus3Str = JSON.stringify(loginRec).substr(320,160);
                let Aus4Str = JSON.stringify(loginRec).substr(480,160);
                let Aus5Str = JSON.stringify(loginRec).substr(640,160);
                let Aus6Str = JSON.stringify(loginRec).substr(800,160);
                let Aus7Str = JSON.stringify(loginRec).substr(960,160);
                let Aus8Str = JSON.stringify(loginRec).substr(1120,160);
                let Aus9Str = JSON.stringify(loginRec).substr(1280,160);
                let AusaStr = JSON.stringify(loginRec).substr(1440,160);
                let AusbStr = JSON.stringify(loginRec).substr(1600,160);
                alert("LRec1:"+Aus1Str);
                alert("LRec2:"+Aus2Str);
                alert("LRec3:"+Aus3Str);
                alert("LRec4:"+Aus4Str);
                alert("LRec5:"+Aus5Str);
                alert("LRec6:"+Aus6Str);
                alert("LRec7:"+Aus7Str);
                alert("LRec8:"+Aus8Str);
                alert("LRec9:"+Aus9Str);
                alert("LReca:"+Aus9Str);
                alert("LRecb:"+Aus9Str);
          */
              // ?? ServerDatum <> letztes Timestamp-Datum? -> vorletzter Arbeitstag setzen
              /*
              var d = new Date(this.globVars.globCurrUser.lasttimestampISO);
              if (d.getDate() !== this.globVars.serverDate.getDate()){
                // Datum d. Logins hat sich geändert -> letzter Arbeitstag speichern in vorletzter = b(efore)last...
                // klappt nicht mit "blasttimestamp", weil Backand-DB Fehler hat : deswegen ...UTC_d (war schon für Test definiert)
                // alert("Datum NEU: oldDate:"+d.getDate()+"newDate:"+this.globVars.serverDate.getDate());
                this.globVars.globCurrUser.lasttimestampUTC_d = this.globVars.globCurrUser.lasttimestampISO;
              };
              //var g = new Date(this.globVars.globCurrUser.lasttimestampUTC_d)
              //alert ("d-string:"+d.toString()+"g-string:"+ g.toString() + "g:"+g.getDate());
            },
            (err:any) => {
              alert("Error: Login/Res2:"+err.data);
            });
          },  // then res1
          (err: any) => {
            alert("Error: Login/Res1:"+err.data);
          });
         //end TimeInit

  // SHOW Timestamp Page dependig on user level
        if (this.globVars.globCurrUser.applevel == "pro"){
          this.navCtrl.push(TabsProPage);
        }
        else {
          this.navCtrl.push(TabsPage);
        }
        this.inputID = '';
      }
      else {
        alert ("This user doesn't exist!");
        this.inputID = '';
        this.textInput = '';
      }
    },
    (err: any) => {
      alert(err.data);
    });
  }
  */
}
