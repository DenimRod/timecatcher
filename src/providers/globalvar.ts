import { Injectable } from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';
import { App } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';


@Injectable()
export class GlobalVars {

public comment:string="";
public globCurrComp:any;
public globCurrUser:any;
// obige Struktur wird aus DB übernommen, wenn User festgelegt wird
//         worktimeToday
//
// public workTimeRuns = false; // gibt an, dass die Arbeitszeit für den akt User läuft oder nicht -> ergibt sich aber aus akt User.lasttimestamp
public timer:number = 0;
public appNameVers:string="KD-ZEN";
public appVers:string="v0.6.2"
public logouttime:number = 72000; // = 20*60*60 Sekunden= 20 Stunden - einmal pro Tag
public pinLength:number = 2;  // Länge des Login-Pins
public serverDateStr:string=""; // UTC-Zeit des Logins = univ.ServerZeit (Zeit kommt vom Backand-Server!)
public serverDate: any;
public clientDateStr:string = ""; // Zeit des Clients
public clientDate: any; // Zeit des Clients
public clientDateStrUTC:string = "";
//public localDate:Date = null; // lokale Zeit, weil auf PCs in KD falsche Zeit, wegen Windows-Domain-Controller-Fehler +10min
public clientDateDiff: number = 0; //=localDate-createdat-date(=ServerZeit) =Zeitdiff in ms zwischen localDate und date(universelle Server-Zeit)
// bei jedem Login wird ein Eintrag in die Login-DB gemacht -> im createdAt-Feld steht die aktuelle universelle Zeit
// jetzt wird die Zeitdifferenz der aktuellen Instanz berechnet und als globale Var geführt
// daraus lässt sich über date(Now)(=lokale Zeit)+localDateDiff die "reale"Zeit zu jedem Zeitpunkt berechnen, ohne erneut
// beim Server nachfragen zu müssen.
public currPlatform = "Desktop";
public browserPlatform = navigator.platform;

// public farbe="text-align:center,color:secondary";
public KW_akt:number = 0;
// tsTyp=Timestamp-Typ -  Array (0..9) - vorläufig 5,6 nicht verwendet (Projekt1,2)
//                0         1           2           3            4           5          6            7          8          9
public tsTyp = ["Krank","Arbeit EIN","AD-Fahrt","Tele-Arbeit","AD-Kunde","Projekt 1","Projekt 2", "Pause EIN","Urlaub", "Arbeit AUS"];
//#Register-------------
//     worktimeToday = muss time kleingeschrieben werden, weil in DB so definiert!
public workTimeRuns:boolean // Arbeitszeit läuft/gestoppt
public workTimeTodayShow = new Date(); //dient zur Anzeige der aktuellen Arbeitszeit
public workTimeTodayHour = 1; // dient zur Anzeige der Stunden
public workTimeTodayMin  = 0; // dient zur Anzeige der Minuten
public workTimeTimeout:any;   // zum Löschen des laufenden Timeouts für workTime-
public currDevice:any;
public companies =[
  {
    ID: 1,
    name: "Kutschera"
  },
  { ID: 2,
    name: "TestCompany"
  }
];
public devAnzahl = 6;
public ZEN_Devices = [              // alle Devices werden hier eingetragen
  {
    devID: 1,
    usrPin:"21",  // !!!! Pin für Eingabe in Login - muss parallel bleiben zu Datenbank-Users
                 // als Abkürzung, damit CheckUser genutzt werden kann -> später suche aus DB
    regDate: "15112017",
    companyID: 1,
    MA: "Richie",
    devMAno: 1,
    devTyp:"Handy",
    devOs: "Android6",
    devBrowser:"Samsung",
    devName: "SamsungA5",
    devCode: "r143241"
  },
  {
    devID: 2,
    usrPin:"21",
    regDate: "r15112017",
    companyID: 1,
    MA: "Richie",
    devMAno: 2,
    devTyp:"Desktop",
    devOs: "Windows10",
    devBrowser:"Firefox",
    devName: "Ri-Erazer",
    devCode: "r143242"
  },
  {
    devID: 3,
    usrPin:"21",
    regDate: "15112017",
    companyID: 1,
    MA: "Richie",
    devMAno: 3,
    devTyp:"Desktop",
    devOs: "Windows7",
    devBrowser:"Firefox",
    devName: "Ri-Toshiba",
    devCode: "r143243"
  },
  {
    devID: 4,
    usrPin:"11",
    regDate: "15112017",
    companyID: 1,
    MA: "Horst",
    devMAno: 1,
    devTyp:"Handy",
    devOs: "iOS6",
    devBrowser:"Safari",
    devName: "Ho-iPhone",
    devCode: "r343241"
  },
  {
    devID: 5,
    usrPin:"11",
    regDate: "15112017",
    companyID: 1,
    MA: "Horst",
    devMAno: 2,
    devTyp:"Desktop",
    devBrowser:"Firefox",
    devOs: "Windows7",
    devName: "Horst-PC",
    devCode: "r432241"
  },
  {
    devID: 6,
    usrPin:"23",
    regDate: "15112017",
    companyID: 1,
    MA: "Emir",
    devMAno: 1,
    devTyp:"Desktop",
    devBrowser:"Firefox",
    devOs: "Windows7",
    devName: "Emir-PC",
    devCode: "r331241"
  },
  {  // nur als Abschluss-Element, damit kein Überlauf bei Abfrage - muss immer letztes bleiben
    devID: 99999,
    usrPin:"9a9b9c",
    regDate: "15112017",
    companyID: 1,
    MA: "Dummy",
    devMAno: 1,
    devTyp:"Desktop",
    devBrowser:"Firefox",
    devOs: "Windows7",
    devName: "Dummy-PC",
    devCode: "r9a9b9c99999"
  }
];

constructor(public backand: BackandService, public app:App, private device:Device, public platform:Platform) {
  this.globCurrUser = null;
  this.KW_akt = this.KW();
//  alert("browserPlatform" + this.browserPlatform);
  /*
    HP-UX
    Linux i686
    Linux armv7l
    Mac68K
    MacPPC
    MacIntel
    SunOS
    Win16
    Win32
    WinCE
    iPhone
    iPod
    iPad
    Android
    BlackBerry
    Opera
--eigene Handys:
  ARM          - Thomas
  Linux armv7l - Richie
  Linux armv8l - Sigi
  iPhone       - Horst
  */
  this.currPlatform="Handy"; // die meisten unbekannten Codes kommen von einem unbek. Handy
  switch (this.browserPlatform) {
    case "Win64": this.currPlatform ="Desktop";
      break;
    case "Win32": this.currPlatform ="Desktop";
      break;
  }
  //------------Erkennung, ob bereits registriert
    // Test, ob Browser "Storage" unterstützt
  if (typeof(Storage) !== "undefined") {
    this.currDevice = JSON.parse( window.localStorage.getItem( "ZEN-Device1" )); //Device1 steht, weil auf
    //     meinem PC bereits ein "ZEN-Device"-Registrierungs-Eintrag vorhanden ist
    //alert("currDevice:" + this.currDevice.MA + this.currDevice.devTyp)
    if (this.currDevice !== null) {  // Erkennung, ob bereits registriert
      alert("Bereits registriert! - Da ist ein Device-Objekt")
    };
    // dieses Device ist noch nicht registriert!!! - weiter zum LOGIN
    //  alert("KEIN Device-Objekt gespeichert-weiter zum Login")
  }
  else alert("Ihr Browser unterstützt keine lokale Speicherung");
}
    //-------------------
    // User muss anfragen (TG) um Device-Registrierung:
    //     dabei Daten über Gerät an Zentrale: Handy(Android/iOS)/PC(Browser(Firefox/Google)/W10)/
    //     Exclusiv-Zugriff, etc.
    //     -> Zentrale trägt Daten in ProgCode ein und in User-DB ein ->User-Registrierungs-Code wird per TG rückübermittelt)
    //        User-Reg-Code beginnt mit "r" - dient zur Unterscheidung von einer PIN-Eingabe
    // keine USER-DB nötig - wird vor ORT gespeichert und im ZEN-Programm-Code
    // statt PIN wird der Reg-Code eingegebene
    // -> Bestätigungsmeldung: Dieses Gerät wird als Device Nr.X für MA[] registriert
    // wird auf Device im localStorage eingetragen: nur ein Schlüsselwert:"r143241" - "Richie"
    // ???in USER-DB wird vermerkt, welches Gerät welchen Code bekommt und dass Code schon vergeben
    // Beschreibung Gerät:
    // Bei ZEN-Programmstart wird getestet, welches Device es ist
    // Gerät(x) von MA -> in Array(in Prog-Code) suchen -> Voreinstellungen laden (Handy/PC, TimeOffset, etc.)
    //  -> statt "Login" (wie Cookie)
    //-------------

    // storage-Test
    //window.localStorage.setItem( "Richie", "Strausz" );
    //    if (window.localStorage.getItem( "Richie" )==null)
    //      alert(window.localStorage.getItem( "Richie1" ))
    //    else alert("doch anders");

// Handy/Desktop geht nur, wenn Native, Browser-Angabe auf Handy unsicher
//    if (this.platform.is('core')) this.currPlatform = "Desktop";
//    else {
//      this.currPlatform = "Handy";        //--> Melden, dass jemand als "Handy" beim START schon gesetzt ist!

public workTimeCounter(){
// update alle 60 sec
  let update = 60000;
  this.workTimeTodayShow = new Date(this.globCurrUser.worktimeToday);
  this.workTimeTodayHour = this.workTimeTodayShow.getUTCHours();
  this.workTimeTodayMin  = this.workTimeTodayShow.getUTCMinutes();
  //alert("WTT:"+this.globCurrUser.worktimeToday+" - Show: "+this.workTimeTodayShow.toISOString()+"-Hour:"+this.workTimeTodayHour+"-Min:"+this.workTimeTodayMin);
  if (this.workTimeRuns) this.globCurrUser.worktimeToday=this.globCurrUser.worktimeToday+update;
  //  else this.workPauseToday=  --> könnte Pausenzeiten auch miterfassen
  this.workTimeTimeout = setTimeout(()=>{this.workTimeCounter()}, update);
  //  clearTimeout(this.workTimeTimout);
}

public countDown(){
this.timer = this.timer - 1;
  if (this.timer > 0 ){
    setTimeout(()=>{this.countDown()},1000);
  }
  else{
    this.app.getRootNav().setRoot(LoginPage);
  }
    //alert(this.timer);
}

public makeStamp(stampType:string){
  var makeStamp = true;
  var neuStampTypeNr: number;
  var altStampTypeNr: number;
  var currComm : string;
  var splitCommArr: any;
// im Folgenden: Def: Arbeits-Typ=(1..6)=(Arbeit EIN, AD-Fahrt, Tele-Arbeit, AD-Kunde, P1, P2,)
//               Def: Arbeits-Stop-Typ= (Pause=7, Urlaub=8, Arbeit AUS=9, Krank=  0)
//               Def: AS = alter status, NS = neuer Status
  //stampTypNr wird gesetzt durch Vergleich, bis passt
  altStampTypeNr=0;
  while (this.globCurrUser.status != this.tsTyp[altStampTypeNr]) {
    ++altStampTypeNr;
  };
  neuStampTypeNr=0;
  while (stampType != this.tsTyp[neuStampTypeNr]) {
    ++neuStampTypeNr;
  };
  //alert("MAKESTAMP-Start- alter Status:"+this.globCurrUser.status+"-altStampTypeNr:"+altStampTypeNr+"-neuer Status:"+stampType+"-neuStampTypeNr:"+neuStampTypeNr);
  //if AS = Arbeits-Stop-Typ=(Urlaub=8,Arbeit AUS=9,Krank=0)
  if ((altStampTypeNr==0 || altStampTypeNr==8 )|| altStampTypeNr==9)
    //&& NS = Arbeits-Typ (1..6)= Übergang von Arbeits-Stop auf Arbeit -> worktimeToday auf 0!
    if (neuStampTypeNr>=1 && neuStampTypeNr<=6) {
      // !!! könnte auch Re-Start von Arbeit am selben Tag(oder nach Mitternacht) sein
    //  alert("Tagesarbeitszeit wird auf 0 gesetzt!"); //T-Arbeitszeit auf Null setzen = 0
      this.globCurrUser.worktimeToday= 0;
      this.workTimeRuns=true;

    }
    // NS ist AUCH Arbeits-Stop-Typ+Pause (7,8,9,0) -> Zweitstempel, warum auch immer
    else
      if (neuStampTypeNr==7) { // NS=Pause=7
      //  alert("Übergang von Arbeits-Stop-Typ auf Pause");
      } // else NS=(8,9,0)
      else {
      //  alert("Übergang von Status: "+this.globCurrUser.status+" auf: "+ stampType+ "- Arbeitszeit läuft weiterhin nicht");
      }
    //else-Ende
  else // = AS ist Arbeits-Typ (1..6) oder Pause=7

    if (altStampTypeNr==7) { // AS = Pause=7
      // AS=Pause=7 && NS = Arbeits-Typen
      if (neuStampTypeNr>=1 && neuStampTypeNr<=6) {
        //alert("Tagesarbeitszeit läuft ab jetzt weiter");
        this.workTimeRuns=true;
      }
      else { // AS=Pause=7 && NS = 7,8,9,0 = Pause+Arbeits-Stop-Typ
        //workTimeRuns bleibt auf STOP
        this.workTimeRuns=false;
        //alert("alter Status= Pause=7 && neuer Status= 7,8,9,0"+this.workTimeRuns);
      }  //else-Ende
    }
    else // AS = Arbeits-Typ (1..6)
      if (neuStampTypeNr>=1 && neuStampTypeNr<=6) {// Arbeit läuft weiter
        //alert("alter Status= Arbeits-Typ(=1..6) && neuer Status= Arbeits-Typ (=1..6)");
      }
      else
        if (neuStampTypeNr==7) {// von Arbeit auf Pause
      //    alert ("von Arbeit auf Pause");
          // letzte Arbeitszeit wird zu worktimeToday hinzugezählt
              // aktuelle Zeit - lasttimestamp = Arbeitszeit (ms)
          this.workTimeRuns=false;
        }
        else {  // von Arbeit auf Arbeits-Stop
        //  alert("alter Status= Arbeits-Typ(=1..6) && neuer Status= Arbeits-Stop-Typ(=8,9,0)");
          // letzte Arbeitszeit wird zu worktimeToday hinzugezählt
          this.workTimeRuns=false;
        }
      //else-ende
    //else-ende
  //else-ende
  //Ende der Abfrage bzgl worktimeToday
  //alert("Ende der worktimeToday-Behandlung erreicht");
  // else-> wenn "alter Status"=Arbeits-Typ (1..6) && ("neuer Status"= Arbeits-Stop-Typ) -> worktimeToday anhalten
  // else-> wenn "alter Status"= (Pause) && ("neuer Status"= Arbeits-Typ(1..60))-> Zeit weiterlaufen lassen
  // else if (this.clobCurrUser.status=.....)
  var korrektur = false;
  if (makeStamp) {
    //ServerZeit wird hochgerechnet aus client + Diff;
    let currComment = this.comment;
    if (currComment.charAt(0) == "#") {  // Korrektur-Zeit wird eingearbeitet
      if (currComment.charAt(1) == "k" || currComment.charAt(1) =="K") {  // Korrektur-Zeit wird eingearbeitet
        korrektur = true;
        currComment = currComment.substr(2).trim();
        var n = this.comment.search(':');
        if (n !== -1) {  // es gibt einen  Doppelpunkt im Kommentar
          if (currComment.length < 6) {  // nur EINE Uhrzeit steht im Kommentar
           //zerlegen in HH:MM
            splitCommArr = currComment.split(':');
            if (splitCommArr.length = 2) {
          //    alert("Stunden:"+ splitCommArr[0]+"Minuten:"+ splitCommArr[1]); //Minuten
            }
          }
        }
        else { // keine Uhrzeit im Kommentar -> canceln
          korrektur = false;
          this.comment = 'Fehleingabe: '+this.comment;
        }
      }
      //alert("comment:"+this.comment);
    }
    else { // ist kein # Code-Kommentar

    };
    let clientMillisec = Date.now();
    this.clientDate = new Date(clientMillisec);
    this.serverDate = new Date(clientMillisec - this.clientDateDiff);
    if (korrektur) {  // es wird eine Korrekturbuchung gemacht
      this.serverDate.setHours(splitCommArr[0]);
      this.serverDate.setMinutes(splitCommArr[1]);
    //  alert("serverDate(korrigiert):"+this.serverDate.toISOString());
    };
    let lastTimeStamp = new Date (this.globCurrUser.lasttimestampISO);
  //  alert("sD:"+this.serverDate.toISOString()+"ltsISO:"+lastTimeStamp.toISOString());
    if (this.serverDate > lastTimeStamp) {  //die Buchung sollte auch auf TOP angezeigt werden
  //    alert("das zu buchende Datum ist neuer als der letzte Timestamp");
    // normale Buchung vorbereiten
    // Server-Zeitproblem auf KD-Desktops -> geht 10 min vor - Workaround
    //if (this.currPlatform == "Desktop") currMillisec-=(600*1000);
    // Workaround-Ende
    //this.clientDate = (new Date(currMillisec)); // ISO-damit alphabet.Sortierung möglich
    // Test im GMT-Format:
    //this.currentDate = new Date(currMillisec); //kommt im GMT-Format
    //this.currentDateUTC =new Date();
    //date_string= this.currentDate.toString();; //kommt im GMT-Format

    //Umwandlung von String-> Date-Objekt OK:
    // Stunden,Minuten mit führender 0
      let Hours="";
      let Minutes="";
      if (this.serverDate.getHours()<10) Hours="0"+this.serverDate.getHours()
      else Hours=this.serverDate.getHours().toString();
      if (this.serverDate.getMinutes()<10) Minutes="0"+this.serverDate.getMinutes()
      else Minutes=this.serverDate.getMinutes().toString();
      this.globCurrUser.lasttimestamp =  this.serverDate.getDate() + "." + (this.serverDate.getMonth() + 1) + ". um " + Hours + ":" + Minutes;
      this.globCurrUser.lasttimestampISO = this.serverDate.toISOString(); //schreibt in Orts-Zeit
    //this.globCurrUser.lasttimestampUTC = this.localDate.toUTCString(); //schreibt in ISO Zeit
    //  this.globCurrUser.lasttimestampUTC_d = this.localDate; //schreibt in Backand-"Date"-Feld -> ISO-Zeit
      this.globCurrUser.lastcomment = this.comment;
      this.globCurrUser.status=stampType;
      this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
    }; // if-Ende: "normale Buchung" vorbereiten
    this.backand.object.create('Timestamps2', "{'date':'" + this.serverDate.toISOString() + "', 'status':'" +
    this.globCurrUser.status + "','userid':'" + this.globCurrUser.id + "','username':'" +
    this.globCurrUser.name + "','comment':'" + this.comment + "','device':'" + this.currPlatform +
    "','browserPlatform':'" + navigator.platform + "'}")
    .then((res: any) => {
//      alert("nach Create: ms->Date:"+this.serverDate.getTime()+ "cms:" + clientMillisec +"clientdiff-ms"+this.clientDateDiff+
//      "serverDate:" + this.serverDate.toLocaleString()+
//      "--clientDate:" + this.clientDate.toLocaleString()+"!");
    },
    (err: any) => {
      alert(err.data);
    });
    this.comment = "";
  }

/*    READ ID OF CREATED TIMESTAMP
  .then((res: any) => {
    let items:any;
    items = res.data.__metadata;
    alert(items.id);
  },
  (err: any) => {
    alert(err.data);
  });
*/
}

public KW(){
  var date = new Date();
  // Get thursday
  // In JavaScript the Sunday has value 0 as return value of getDay() function.
  // So we have to order them first ascending from Monday to Sunday
  // Monday: ((1+6) % 7) = 0
  // Tuesday ((2+6) % 7) = 1
  // Wednesday: ((3+6) % 7) = 2
  // Thursday: ((4+6) % 7) = 3
  // Friday: ((5+6) % 7) = 4
  // Saturday: ((6+6) % 7) = 5
  // Sunday: ((0+6) % 7) = 6
  // (3 - result) is necessary to get the Thursday of the current week.
  // If we want to have Tuesday it would be (1-result)
  var currentThursday = new Date(date.getTime() +(3-((date.getDay()+6) % 7)) * 86400000);
  // At the beginnig or end of a year the thursday could be in another year.
  var yearOfThursday = currentThursday.getFullYear();
  // Get first Thursday of the year
  var firstThursday = new Date(new Date(yearOfThursday,0,4).getTime() +(3-((new Date(yearOfThursday,0,4).getDay()+6) % 7)) * 86400000);
  // +1 we start with week number 1
  // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
  var KW = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000/7);
  return KW;
}

/*  setglobCurrUserId(value) {
   this.globCurrUserId = value;
  }

  getglobCurrUserId() {
    return this.globCurrUserId;
  }
*/

} //export Class: GlobalVars
