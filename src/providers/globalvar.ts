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
public timer:number = 0;
public appNameVers:string="KD-Zeiterfassung v0.2.2a";
public logouttime:number = 72000; // = 20*60*60 Sekunden= 20 Stunden - einmal pro Tag
public pinLength:number = 2;
public currentDate:string = "";
public localDate:Date = null;
public currPlatform = "Desktop";
// public farbe="text-align:center,color:secondary";
public KW_akt:number = 0;
// tsTyp=Timestamp-Typ -  Array (0..9) - vorläufig 5,6 nicht verwendet (Projekt1,2)
//                0         1           2           3            4           5          6            7          8          9
public tsTyp = ["Krank","Arbeit EIN","AD-Fahrt","Tele-Arbeit","AD-Kunde","Projekt 1","Projekt 2", "Pause EIN","Urlaub", "Arbeit AUS"];
//#Register-------------
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
  //------------Erkennung, ob bereits registriert
    // Test, ob Browser "Storage" unterstützt
  if (typeof(Storage) !== "undefined") {
    this.currDevice = JSON.parse( window.localStorage.getItem( "ZEN-Device1" ));
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
// im Folgenden: Def:Arbeits-Typ=(1..6)=(Arbeit EIN, AD-Fahrt, Tele-Arbeit, AD-Kunde, P1, P2,)
//               Def: Arbeits-Stop-Typ= (Pause, Urlaub, Krank, Arbeit AUS)
// if "alter Status"=(Arbeit AUS,Urlaub,Krank) && "neuer Status" = Arbeits-Typ -> worktimeToday auf 0!
  if ((this.globCurrUser.status=9) && ((stampType>0) && (stampType<7)))
    //T-Arbeitszeit = 0
    this.globCurrUser.worktimeToday= new Date(0);
  // else-> wenn "alter Status"=Arbeit EIN && ("neuer Status"= Arbeits-Stop-Typ) -> worktimeToday anhalten
  // else-> wenn "alter Status"= (Pause) && ("neuer Status"= Arbeits-Typ)-> Zeit weiterlaufen lassen
  // else if (this.clobCurrUser.status=.....)
  this.globCurrUser.status=stampType;
  let currMillisec= Date.now();
  // Server-Zeitproblem auf KD -> geht 10 min vor - Workaround
  if (this.currPlatform == "Desktop") currMillisec-=(600*1000);
  // Workaround-Ende
  this.currentDate = (new Date(currMillisec)).toISOString();
  this.localDate = new Date(this.currentDate);
  this.globCurrUser.lastcomment = this.comment;

  // Stunden,Minuten mit führender 0
  let Hours="";
  let Minutes="";
  if (this.localDate.getHours()<10) let Hours="0"+this.localDate.getHours()
  else Hours=this.localDate.getHours();
  if (this.localDate.getMinutes()<10) let Minutes="0"+this.localDate.getMinutes()
  else Minutes=this.localDate.getMinutes();
  this.globCurrUser.lasttimestamp =  this.localDate.getDate() + "." + (this.localDate.getMonth() + 1) + ". um " + Hours + ":" + Minutes;

  this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
  this.backand.object.create('Timestamps', "{'date':'" + this.currentDate + "', 'status':'" + this.globCurrUser.status + "','userid':'" + this.globCurrUser.id + "','username':'" + this.globCurrUser.name + "','comment':'" + this.comment + "','device':'" + this.currPlatform +  "'}")
  this.comment = "";

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
}
