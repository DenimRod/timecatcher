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
  public allusers:any[] = [];
  public onHandy:boolean=false;

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars,
     public plt: Platform, private dialogs: Dialogs,private nfc: NFC, private ndef: Ndef ) {  }


NFC_onSuccess()
{ alert ("onSuccess")};

NFC_onError()
{ alert ("onError")};

  ionViewDidEnter() {

    if (this.plt.is('cordova')) {
      this.nfc.addNdefListener(
        () => {alert('successfully attached ndef listener')},
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
/*
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
xhr.open("GET", "/server/ri_test.php", true);
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
  if(this.globVars.testFlag==1){
    this.inputID = "33";
    this.checkUser();
  }
}
/*
  if (this.plt.is('core')) {
      // This will only print when on Desktop
      alert("Zeiterfassung läuft auf Desktop-PC!")
  }
  else alert("Zeiterfassung läuft auf Handy!");

ABFRAGE FÜR HANDY/DESKTOP */



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
        this.checkUser();
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
    this.checkUser();
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
      this.checkUser();
    }
  }

  public checkUser(){
  //  alert("checkUser-InputID:"+this.inputID);

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
/* -- andere Lösung für worktimeToday zurücksetzen über makeStamp, diese Lösung für Wochen/Monats-Arbeitszeit vielleicht gut
        // COMPANY QUERY für Tages-Arbeitszeit-Prüfung + Rücksetzung
        let params2 = {
          filter: [
            this.backand.helpers.filter.create('id', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.companyid),
          ],
        }
        this.backand.object.getList('Companies', params2)
        .then((res: any) => {
          this.globVars.globCurrComp = res.data[0];

          // Check if last login was before today
          // if monatstag != last monatstag  ...
          let currentDate = new Date();
          this.globVars.globCurrComp.lastLoginDay = currentDate.getDate(); // getDate=day of Month 1..31
          //get every user of this company and set worktimeToday = 0
          let params3 = {
            filter: [
              this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrComp.id),
            ],
          }
          this.backand.object.getList('Users', params3)
          .then((res: any) => {
            this.allusers = res.data;
            var d = new Date(0);
            for (let i=0;i<this.allusers.length;i++){
              this.allusers[i].worktimeToday=d;
              this.backand.object.update('Users', i+1, this.allusers[i]);
            }
          },
          (err: any) => {
            alert(err.data);
          });
        },
          (err: any) => {
          alert(err.data);
        });
*/
        // auf Handy?  ---- wird jetzt über navigator.platform in globvar.ts gelöst
          //if (this.onHandy) this.globVars.currPlatform="Handy"
          //else this.globVars.currPlatform="Desktop";

     // Time-INIT
     // gleichzeitig wird ein Eintrag in die Login-DB-Objekt gemacht -> alle Logins werden dokumentiert
     //randNum = Math.round(Math.random()*100000000);
          var loginRec: any;

          this.backand.object.create('Login', "{'name':'"+this.globVars.globCurrUser.name+"', 'userID':'"+
            this.globVars.globCurrUser.userID+"', 'device':'"+this.globVars.currPlatform +"'}")
          .then((res1:any) => {
            //alte Lösung: let params = {
            //filter:
            //  this.backand.helpers.filter.create('randNum', this.backand.helpers.filter.operators.text.equals, randNum.toString())
            //  sort:   this.backand.helpers.sort.create('name', this.backand.helpers.sort.orders.asc)
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
        /*  -alte Idee zur Suche nach dem letzten erstellen Eintrag:
              let params = {
                filter:
                  this.backand.helpers.filter.create('randNum', this.backand.helpers.filter.operators.text.equals, randNum.toString())
              //  sort:   this.backand.helpers.sort.create('name', this.backand.helpers.sort.orders.asc)
              };
          */
            //    alert("LoginRec!"+loginRec.name+"crdate:"+loginRec.createdAt+"-"+loginRec.device);
            },
            (err:any) => {
              alert("Error: Login/Res2:"+err.data);
            });
          },  // then res1
          (err: any) => {
            alert("Error: Login/Res1:"+err.data);
          });
         //end TimeInit

  // SHOW Timestamp dependig on user level
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


/*    public getAuthTokenSimple() {
      this.auth_type = 'Token';
      this.backand.signin(this.username, this.password)
        .then((res: any) => {
          this.auth_status = 'OK';
          this.is_auth_error = false;
          this.loggedInUser = res.data.username;
          this.username = '';
          this.password = '';
        },
        (error: any) => {
          let errorMessage: string = error.data.error_description;
          this.auth_status = `Error: ${errorMessage}`;
          this.is_auth_error = true;
          this.auth_status = 'ERROR';
        }
      );
    }

    public useAnonymousAuth() {
      this.backand.useAnonymousAuth()
        .then((res: any) => {
          this.auth_status = 'OK';
          this.is_auth_error = false;
          this.loggedInUser = res.data.username;
        },
        (error: any) => {
          let errorMessage: string = error.data.error_description;
          this.auth_status = `Error: ${errorMessage}`;
          this.is_auth_error = true;
          this.auth_status = 'ERROR';
        });
    }

    public socialSignin(provider: string) {
      this.backand.socialSignin(provider)
        .then((res: any) => {
          this.auth_status = 'OK';
          this.is_auth_error = false;
          this.loggedInUser = res.data.username;
        },
        (error: any) => {
          let errorMessage: string = error.data.error_description;
          this.auth_status = `Error: ${errorMessage}`;
          this.is_auth_error = true;
          this.auth_status = 'ERROR';
        }
      );
    }

    public signOut() {
      this.auth_status = null;
      this.backand.signout();
    }


    public changePassword() {
      if (this.newPassword != this.confirmNewPassword){
        alert('Passwords should match');
        return;
      }
      this.backand.changePassword(this.oldPassword, this.newPassword)
        .then((res: any) => {
          alert('Password changed');
          this.oldPassword = this.newPassword = this.confirmNewPassword = '';
        },
        (err: any) => {
          alert(err.data)
        }
      );
    }
*/
}
