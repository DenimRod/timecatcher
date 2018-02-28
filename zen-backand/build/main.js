webpackJsonp([0],{

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExtrasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_globalvar__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ExtrasPage = (function () {
    function ExtrasPage(backand, navCtrl, globVars) {
        this.backand = backand;
        this.navCtrl = navCtrl;
        this.globVars = globVars;
        this.users = [];
        this.noTSFound = false;
        this.buchungenMonth = [];
        this.workTimeHoursDezim = [];
        this.workTimeHours = [];
        this.workTimeMinutes = [];
        // Alle Vars für Arbeitszeit in Intervall
        this.wtInterval = {
            //60*60*1000 = 3600000, Anzahl ms pro Stunde, Offset
            start: new Date(Date.now() - (Date.now() % 86400000) - 86400000).toISOString(),
            end: new Date(Date.now() + (86400000 - Date.now() % 86400000) - 3600001).toISOString(),
            sum: 0,
            Hours: 0,
            HoursDezim: "",
            Minutes: 0
        }; //Komplexe Berechnungen für Uhrzeitbereinigung
        //this.globVars.timer=30;
    }
    ExtrasPage.prototype.ionViewWillEnter = function () {
        //  alert("Browser-Platform:"+this.globVars.browserPlatform+" currPf: "+this.globVars.currPlatform);
    };
    //angeblich notwendig, damit die Dialoge "aktiviert" werden.
    //onDeviceReady();
    //document.addEventListener("deviceready", onDeviceReady, false);
    // alte Bezeichnung??  navigator.notification.beep(2);
    ExtrasPage.prototype.playTon = function () {
        var snd = new Audio("https://ordination-kutschera.at/Alarm.wav"); // buffers automatically when created
        snd.play();
    };
    ;
    /* geht leider nur als "native"
    this.dialogs.beep (3); // spielt Sytem-Sound z.B. "Pfeifen"
    this.dialogs.alert('RI - alert-message')
      .then(() => alert('Dialog erledigt/dismissed'))
      .catch(e => alert('Error displaying dialog'+ e));
    this.dialogs.prompt('RI-prompt-message das kann noch viel länger sein, mal sehen, wieviel sich da ausgeht döfgk  dfölklöä k dlöähkhkdölk  ölkdfhlök   dölkhl kd dölkh   dölhkdölkhk  lödfhkk ödlöhk öldflöh  dlöfkhöl ödlk kdöhk lödlhö lödfkdfkhkerkherrjölkjdhljhhj  hjjfkhj jhjh' +
    'ösljg lkgjkgklghg jrejg jgeogireg jgj ergjor gjfdkj  lk ldkg  klgfgj lkfd  glkj  dflkj  dflkgj fdgjl lkfdj  jgj dkg gjfkdlgj  jgjgfkgjdgj',
     'RI-title',["OK","Cancel","3.", "4.","5.", "6."], 'defaultText');
   */
    //  alert('nach dialogs');
    ExtrasPage.prototype.calcInterval = function () {
        var _this = this;
        this.workTimeHoursDezim = [];
        this.workTimeHours = [];
        this.workTimeMinutes = [];
        this.wtInterval.sum = 0;
        var params = {
            filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
            sort: this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
            pageSize: 1000
        };
        //Hole letze 1000 TS dieses Users
        this.backand.object.getList('Timestamps2', params)
            .then(function (res) {
            var i = 0;
            var dayCount = 0;
            var i_start = 0;
            var dateHelper = null;
            var dateHelperStr = "";
            var startDate = new Date(_this.wtInterval.start);
            var endDate = new Date(_this.wtInterval.end);
            var startReached = false;
            _this.noTSFound = false;
            _this.buchungenMonth = [];
            while (i < res.data.length) {
                dateHelper = new Date(res.data[i].date);
                i++;
                if (dateHelper <= endDate)
                    break;
            }
            if (dateHelper <= startDate) {
                _this.noTSFound = true; //-> Keine TS im Zeitraum
                return 0;
            }
            dateHelperStr = dateHelper.toISOString(); //dateHelper = erstes Datum
            i_start = i - 1;
            //Unterteile in einzelne Tage bis start erreicht
            while (i < res.data.length && !startReached) {
                while (i < res.data.length) {
                    if (res.data[i].date.substr(0, 10) != dateHelperStr.substr(0, 10)) {
                        dateHelper = new Date(res.data[i].date); //falls <= "start" -> done
                        if (dateHelper < startDate)
                            startReached = true;
                        break; //i ist Index des nächsten Tages
                    }
                    i++;
                } //Teile bis i
                _this.buchungenMonth[dayCount] = res.data.slice(i_start, i);
                //Berechne die Arbeitszeit
                var workTimeSum = _this.globVars.calcWorkTime(_this.buchungenMonth[dayCount]);
                var workTimeSumDate = new Date(workTimeSum);
                _this.workTimeHours[dayCount] = workTimeSumDate.getUTCHours();
                _this.workTimeMinutes[dayCount] = workTimeSumDate.getUTCMinutes();
                //Addiere zur Gesamtsumme (in Minuten)
                var justMinutes = _this.workTimeHours[dayCount] * 60 + _this.workTimeMinutes[dayCount];
                _this.wtInterval.sum += (justMinutes);
                //Anzeige in Dezimaldarstellung
                _this.workTimeHoursDezim[dayCount] = (justMinutes / 60).toFixed(2);
                dateHelperStr = dateHelper.toISOString(); //Update auf neuen Tag
                i_start = i;
                i++;
                dayCount++;
            }
            _this.wtInterval.Hours = Math.floor(_this.wtInterval.sum / 60);
            _this.wtInterval.Minutes = _this.wtInterval.sum % 60;
            _this.wtInterval.HoursDezim = (_this.wtInterval.sum / 60).toFixed(2);
            /*
                   while (i<res.data.length) {            //Such den ersten TS != heute
                     if(res.data[i].date.substr(0,10) !=     todayDate.toISOString().substr(0,10))
                     {
                       todayIndexBorder = i;
                       break;
                     }
                     i++;
                   }
                   i=0;         //falls alle TS von heute -> Ende = Ende d. Liste
                   if (todayIndexBorder==-1) todayIndexBorder = res.data.length + 1;
            
                        //Hol dir die Arbeitszeit der heutigen TS und rechne sie in h/m um
                   let workTimeSum = this.globVars.calcWorkTime(res.data.slice(0,todayIndexBorder))
                   let workTimeSumDate = new Date(workTimeSum);
                   this.workTimeHours = workTimeSumDate.getUTCHours();
                   this.workTimeMinutes = workTimeSumDate.getUTCMinutes();
            
                   this.globVars.globCurrUser.worktimeToday = workTimeSum;  //Setze globalen
                   clearTimeout(this.globVars.workTimeTimeout);             //Timer
                   this.globVars.workTimeCounter();
            
                   while (i<res.data.length) {          //UTC Strings -> Lokale Zeit
                     datumHelper = new Date(res.data[i].date);
                     res.data[i].date = datumHelper.toString().substr(0,21);
                     weekDay=res.data[i].date.substr(0,3);
                     switch (weekDay) {
                       case "Mon": weekDay ="Mo";
                         break;
                       case "Tue": weekDay ="Di";
                         break;
                       case "Wed": weekDay ="Mi";
                         break;
                       case "Thu": weekDay ="Do";
                           break;
                       case "Fri": weekDay ="Fr";
                           break;
                       case "Sat": weekDay ="Sa";
                           break;
                       case "Sun": weekDay ="So";
                           break;
                     }
                     res.data[i].date = weekDay+res.data[i].date.substr(3,21);
                     //  alert(i+"-Datum:"+res.data[i].datum+"----"+res.data[i].date);
                     ++i;
                   };
                   this.buchungentoday = res.data.slice(0,todayIndexBorder);
                   this.buchungen = res.data.slice(todayIndexBorder,);
                        //ist das erhaltene Array voll, blende Button ein
                   if(res.data.length == this.buchungenAmount) this.endOfBuchungen = false;
                   else this.endOfBuchungen = true;
            */
        }, function (err) {
            alert(err.data);
        });
    };
    return ExtrasPage;
}());
ExtrasPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\extras\extras.html"*/'<ion-header>\n\n<ion-navbar>\n\n  <ion-title>\n\n    {{globVars.appNameVers}} - Extras: {{globVars.globCurrUser.name}}\n\n  </ion-title>\n\n</ion-navbar>\n\n<!-- <p align="right"> {{globVars.timer}} </p> -->\n\n</ion-header>\n\n<ion-content padding class="page5">\n\n{{globVars.appVers}} <br>\n\n\n\n<h6 ion-text color="dark">Browser-Typ: {{globVars.browserPlatform}} -> {{globVars.currPlatform}}</h6>\n\n<button ion-button medium align="center" (click)="playTon()">sound-Test</button>\n\n\n\n <h4 ion-text color="primary"><u>Kommentar-Feld-Codes:</u></h4>\n\n\n\n<h5 ion-text color="primary">Wie kann ich Zeit-Stempel rückdatieren?</h5>\n\n    <i ion-text color="danger">"k0915" oder "k 09:15"</i><a ion-text color="dark"> + (beliebiger Stempeltyp)</a><br>\n\n    <a ion-text color="dark">-> erzeugt einen Stempel mit der angegebenen Zeit</a> <br>\n\n<!--\n\n<h5 ion-text color="primary">Wie kann ich Pausen nachtragen?</h5>\n\n    <i ion-text color="danger">#k&nbsp; 9:15 &nbsp; 9:45</i> oder: <i ion-text color="danger">#k 9:15&nbsp; 30m</i>\n\n    <a ion-text color="dark">+</a><i ion-text color="primary">(PAUSE EIN)</i><br>\n\n    <a ion-text color="dark">-> erzeugt 2 Zeit-Stempel: <br>\n\n    (Pause EIN) mit 09:15 + (Arbeit EIN) 09:45</a><br>\n\n-->\n\n<h5 ion-text color="primary">Wie kann ich eine Bemerkung für die Lohn-Verrechnung eingeben?</h5>\n\n    <i ion-text color="danger">#v Bemerkung</i><a ion-text color="dark"> + (beliebiger Stempeltyp)</a><br>\n\n    <a ion-text color="dark">-> #v wird bei der Verrechnung(Lohn) !händisch! bearbeitet</a> <br> <br>\n\n<h5 ion-text color="primary">Wie kann ich "Zeitausgleich" eingeben?</h5>\n\n    <i ion-text color="danger">[URLAUB] stempeln</i><a ion-text color="dark"> + Kommentar: "ZA"</a><br>\n\n    <a ion-text color="dark">-> muss vorläufig außerhalb von ZEN mitgeführt werden</a> <br> <br>\n\n\n\n<!-- Anzeige der TS eines Monats und Berechnung der Arbeitszeit pro Tag -->\n\n<ion-list>\n\n  <ion-item>\n\n    <ion-label>Von:</ion-label>\n\n    <ion-datetime displayFormat="MMM DD YYYY" [(ngModel)]="wtInterval.start"></ion-datetime>\n\n  </ion-item>\n\n  <ion-item>\n\n    <ion-label>Bis:</ion-label>\n\n    <ion-datetime displayFormat="MMM DD YYYY" [(ngModel)]="wtInterval.end"></ion-datetime>\n\n  </ion-item>\n\n</ion-list>\n\n\n\n\n\n<button ion-button full align="center" (click)="calcInterval()" color="light">Arbeitszeit berechnen</button>\n\n<br>\n\n<!-- <ion-card class=\'blue\'> -->\n\n\n\n  <ion-card *ngIf="noTSFound">\n\n    <ion-item>\n\n    Es wurden leider keine Einträge im angegebenen Zeitraum gefunden!\n\n    </ion-item>\n\n  </ion-card>\n\n\n\n  <ion-card *ngIf="wtInterval.Minutes">\n\n    <ion-item>\n\n      <ion-icon name="time" item-start></ion-icon>\n\n      Gesamt: &nbsp;\n\n      <ion-badge>\n\n        {{wtInterval.HoursDezim}}h\n\n      </ion-badge>\n\n      <ion-badge>\n\n        =\n\n      </ion-badge>\n\n      <ion-badge><span *ngIf="wtInterval.Hours">{{wtInterval.Hours}}h</span> {{wtInterval.Minutes}}m</ion-badge>\n\n    </ion-item>\n\n  </ion-card>\n\n\n\n\n\n\n\n<ion-grid *ngFor="let buchungenDay of buchungenMonth; let i=index">\n\n\n\n  <ion-card>\n\n    <ion-row><ion-col>\n\n    <ion-item>\n\n      Arbeitszeit: &nbsp;\n\n      <ion-badge>\n\n        {{workTimeHoursDezim[i]}}h\n\n      </ion-badge>\n\n      <ion-badge>\n\n        =\n\n      </ion-badge>\n\n      <ion-badge><span *ngIf="workTimeHours[i]">{{workTimeHours[i]}}h</span> {{workTimeMinutes[i]}}m</ion-badge>\n\n    </ion-item>\n\n  </ion-col></ion-row>\n\n\n\n<ion-row *ngFor="let buchung of buchungenDay; let odd=odd; let even=even;" [ngClass]="{ odd: odd, even: even }">\n\n\n\n  <ion-col>\n\n    {{buchung.date| date: \'EEE MMM dd yyyy H:mm\'}}\n\n  </ion-col>\n\n  <ion-col>\n\n    <span style="color:#f53d3d" *ngIf="buchung.status==\'Krank\'"><ion-icon name="radio-button-on"></ion-icon>  </span>\n\n    <span style="color:#3dcc82" *ngIf="buchung.status==\'Arbeit EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#ffcc00" *ngIf="buchung.status==\'AD-Fahrt\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#ffcc00" *ngIf="buchung.status==\'AD-Kunde\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#3dcc82" *ngIf="buchung.status==\'Tele-Arbeit\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#3dcc82" *ngIf="buchung.status==\'Projekt 1\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#3dcc82" *ngIf="buchung.status==\'Projekt 2\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#488aff" *ngIf="buchung.status==\'Pause EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#488aff" *ngIf="buchung.status==\'Urlaub\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    <span style="color:#f53d3d" *ngIf="buchung.status==\'Arbeit AUS\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n    {{buchung.status}}\n\n    </ion-col>\n\n  <ion-col>\n\n    {{buchung.device}}\n\n  </ion-col>\n\n  <ion-col>\n\n    {{buchung.comment}}\n\n  </ion-col>\n\n</ion-row>\n\n</ion-card>\n\n</ion-grid>\n\n\n\n<!-- </ion-card>-->\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\extras\extras.html"*/,
        selector: 'page-extras',
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__["BackandService"], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_globalvar__["a" /* GlobalVars */]])
], ExtrasPage);

//# sourceMappingURL=extras.js.map

/***/ }),

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BuchungenPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_globalvar__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BuchungenPage = (function () {
    function BuchungenPage(backand, navCtrl, globVars) {
        this.backand = backand;
        this.navCtrl = navCtrl;
        this.globVars = globVars;
        this.buchungen = []; // die einzelnen Buchungszeilen (ex. heute)
        this.buchungentoday = [];
        this.workTimeHoursDezim = "";
        this.workTimeHours = 0;
        this.workTimeMinutes = 0;
        this.nextBuchungenPage = 2;
        this.endOfBuchungen = true;
        this.buchungenAmount = 20;
        //this.globVars.timer=30;
    }
    BuchungenPage.prototype.ionViewWillEnter = function () {
        this.reloadBuchungen(null);
        this.buchungenAmount = 20;
    };
    BuchungenPage.prototype.reloadBuchungen = function (refresher) {
        var _this = this;
        this.nextBuchungenPage = 2; //sobald refesht wird --> Reset aller TS
        var params = {
            filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
            sort: this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
            pageSize: this.buchungenAmount,
            pageNumber: 1,
        };
        //Hol die letzten TS dieses Users
        this.backand.object.getList('Timestamps2', params)
            .then(function (res) {
            var i = 0;
            var weekDay = "";
            var datumHelper = null;
            var todayIndexBorder = -1;
            var todayDate = new Date();
            while (i < res.data.length) {
                if (res.data[i].date.substr(0, 10) != todayDate.toISOString().substr(0, 10)) {
                    todayIndexBorder = i;
                    break;
                }
                i++;
            }
            i = 0; //falls alle TS von heute -> Ende = Ende d. Liste
            if (todayIndexBorder == -1)
                todayIndexBorder = res.data.length + 1;
            //Hol dir die Arbeitszeit der heutigen TS und rechne sie in h/m um
            var workTimeSum = _this.globVars.calcWorkTime(res.data.slice(0, todayIndexBorder));
            var workTimeSumDate = new Date(workTimeSum);
            _this.workTimeHours = workTimeSumDate.getUTCHours();
            _this.workTimeMinutes = workTimeSumDate.getUTCMinutes();
            //Anzeige in Dezimaldarstellung
            var justMinutes = _this.workTimeHours * 60 + _this.workTimeMinutes;
            _this.workTimeHoursDezim = (justMinutes / 60).toFixed(2);
            _this.globVars.globCurrUser.worktimeToday = workTimeSum; //Setze globalen
            clearTimeout(_this.globVars.workTimeTimeout); //Timer
            _this.globVars.workTimeCounter();
            while (i < res.data.length) {
                datumHelper = new Date(res.data[i].date);
                res.data[i].date = datumHelper.toString().substr(0, 21);
                weekDay = res.data[i].date.substr(0, 3);
                switch (weekDay) {
                    case "Mon":
                        weekDay = "Mo";
                        break;
                    case "Tue":
                        weekDay = "Di";
                        break;
                    case "Wed":
                        weekDay = "Mi";
                        break;
                    case "Thu":
                        weekDay = "Do";
                        break;
                    case "Fri":
                        weekDay = "Fr";
                        break;
                    case "Sat":
                        weekDay = "Sa";
                        break;
                    case "Sun":
                        weekDay = "So";
                        break;
                }
                res.data[i].date = weekDay + res.data[i].date.substr(3, 21);
                //  alert(i+"-Datum:"+res.data[i].datum+"----"+res.data[i].date);
                ++i;
            }
            ;
            _this.buchungentoday = res.data.slice(0, todayIndexBorder);
            _this.buchungen = res.data.slice(todayIndexBorder);
            //ist das erhaltene Array voll, blende Button ein
            if (res.data.length == _this.buchungenAmount)
                _this.endOfBuchungen = false;
            else
                _this.endOfBuchungen = true;
            if (refresher) {
                refresher.complete();
            }
        }, function (err) {
            alert(err.data);
            if (refresher) {
                refresher.complete();
            }
        });
    };
    BuchungenPage.prototype.moreBuchungen500 = function () {
        this.buchungenAmount += 500;
        this.reloadBuchungen(null);
    };
    BuchungenPage.prototype.moreBuchungen = function () {
        var _this = this;
        var params = {
            filter: this.backand.helpers.filter.create('username', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.name),
            sort: this.backand.helpers.sort.create('date', this.backand.helpers.sort.orders.desc),
            pageSize: 20,
            pageNumber: this.nextBuchungenPage,
        };
        this.backand.object.getList('Timestamps2', params)
            .then(function (res) {
            var i = 0;
            var weekDay = "";
            var datumHelper = null;
            while (i < res.data.length) {
                datumHelper = new Date(res.data[i].date);
                res.data[i].date = datumHelper.toString().substr(0, 21);
                weekDay = res.data[i].date.substr(0, 3);
                switch (weekDay) {
                    case "Mon":
                        weekDay = "Mo";
                        break;
                    case "Tue":
                        weekDay = "Di";
                        break;
                    case "Wed":
                        weekDay = "Mi";
                        break;
                    case "Thu":
                        weekDay = "Do";
                        break;
                    case "Fri":
                        weekDay = "Fr";
                        break;
                    case "Sat":
                        weekDay = "Sa";
                        break;
                    case "Sun":
                        weekDay = "So";
                        break;
                }
                res.data[i].date = weekDay + res.data[i].date.substr(3, 21);
                //  alert(i+"-Datum:"+res.data[i].datum+"----"+res.data[i].date);
                ++i;
            }
            ;
            _this.buchungen = _this.buchungen.concat(res.data);
            if (res.data.length < 20) {
                _this.endOfBuchungen = true;
            }
        }, function (err) {
            alert(err.data);
        });
        this.nextBuchungenPage++;
    };
    return BuchungenPage;
}());
BuchungenPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\buchungen\buchungen.html"*/'<ion-header>\n\n<ion-navbar hideBackButton>\n\n  <ion-title>\n\n    {{globVars.appNameVers}} - Buchungen: {{globVars.globCurrUser.name}}\n\n  </ion-title>\n\n</ion-navbar>\n\n<!-- <p align="right"> {{globVars.timer}} </p> -->\n\n\n\n</ion-header>\n\n\n\n<ion-content padding class="page5">\n\n\n\n  <ion-refresher (ionRefresh)="reloadBuchungen($event)">\n\n    <ion-refresher-content>\n\n\n\n    </ion-refresher-content>\n\n  </ion-refresher>\n\n\n\n<ion-card>\n\n  <ion-item>\n\n    <ion-icon name="time" item-start></ion-icon>\n\n    Arbeitszeit heute: &nbsp;\n\n    <ion-badge>\n\n      {{workTimeHoursDezim}}h\n\n    </ion-badge>\n\n    <ion-badge>\n\n      =\n\n    </ion-badge>\n\n    <ion-badge><span *ngIf="workTimeHours">{{workTimeHours}}h</span> {{workTimeMinutes}}m</ion-badge>\n\n  </ion-item>\n\n</ion-card>\n\n\n\n  <ion-grid>\n\n    <ion-row class="titles">\n\n      <ion-col>\n\n        Datum/Zeit\n\n      </ion-col>\n\n      <ion-col>\n\n        Zeit-Typ\n\n      </ion-col>\n\n      <ion-col>\n\n        Device\n\n      </ion-col>\n\n      <ion-col>\n\n        Kommentar\n\n      </ion-col>\n\n<!--      <ion-col>\n\n        Arbeitszeit\n\n      </ion-col> -->\n\n    </ion-row>\n\n    <ion-row *ngFor="let buchung of buchungentoday; let odd=odd; let even=even;" [ngClass]="{ odd: odd, even: even }">\n\n\n\n      <ion-col>\n\n        {{buchung.date}}\n\n      </ion-col>\n\n      <ion-col>\n\n        <span style="color:#f53d3d" *ngIf="buchung.status==\'Krank\'"><ion-icon name="radio-button-on"></ion-icon>  </span>\n\n        <span style="color:#3dcc82" *ngIf="buchung.status==\'Arbeit EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#ffcc00" *ngIf="buchung.status==\'AD-Fahrt\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#ffcc00" *ngIf="buchung.status==\'AD-Kunde\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#3dcc82" *ngIf="buchung.status==\'Tele-Arbeit\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#3dcc82" *ngIf="buchung.status==\'Projekt 1\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#3dcc82" *ngIf="buchung.status==\'Projekt 2\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#488aff" *ngIf="buchung.status==\'Pause EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#488aff" *ngIf="buchung.status==\'Urlaub\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        <span style="color:#f53d3d" *ngIf="buchung.status==\'Arbeit AUS\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n        {{buchung.status}}\n\n        </ion-col>\n\n      <ion-col>\n\n        {{buchung.device}}\n\n      </ion-col>\n\n      <ion-col>\n\n        {{buchung.comment}}\n\n      </ion-col>\n\n<!-- <ion-col>\n\n\n\n      </ion-col>  -->\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n<!-- Alle Buchungen != heute -->\n\n<ion-grid>\n\n  <ion-row *ngFor="let buchung of buchungen; let odd=odd; let even=even;" [ngClass]="{ odd: odd, even: even }">\n\n\n\n    <ion-col>\n\n      {{buchung.date}}\n\n    </ion-col>\n\n    <ion-col>\n\n      <span style="color:#f53d3d" *ngIf="buchung.status==\'Krank\'"><ion-icon name="radio-button-on"></ion-icon>  </span>\n\n      <span style="color:#3dcc82" *ngIf="buchung.status==\'Arbeit EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#ffcc00" *ngIf="buchung.status==\'AD-Fahrt\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#ffcc00" *ngIf="buchung.status==\'AD-Kunde\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#3dcc82" *ngIf="buchung.status==\'Tele-Arbeit\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#3dcc82" *ngIf="buchung.status==\'Projekt 1\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#3dcc82" *ngIf="buchung.status==\'Projekt 2\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#488aff" *ngIf="buchung.status==\'Pause EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#488aff" *ngIf="buchung.status==\'Urlaub\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      <span style="color:#f53d3d" *ngIf="buchung.status==\'Arbeit AUS\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n      {{buchung.status}}\n\n      </ion-col>\n\n    <ion-col>\n\n      {{buchung.device}}\n\n    </ion-col>\n\n    <ion-col>\n\n      {{buchung.comment}}\n\n    </ion-col>\n\n<!-- <ion-col>\n\n\n\n    </ion-col>  -->\n\n  </ion-row>\n\n\n\n  <button ion-button align="center" (click)="moreBuchungen500()" *ngIf="!endOfBuchungen"> Weitere Buchungen laden... </button>\n\n\n\n</ion-grid>\n\n\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\buchungen\buchungen.html"*/,
        selector: 'page-buchungen',
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__["BackandService"], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_globalvar__["a" /* GlobalVars */]])
], BuchungenPage);

//# sourceMappingURL=buchungen.js.map

/***/ }),

/***/ 153:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 153;

/***/ }),

/***/ 196:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 196;

/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timestamp_timestamp__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__extras_extras__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__buchungen_buchungen__ = __webpack_require__(142);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = (function () {
    function TabsPage() {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__timestamp_timestamp__["a" /* TimestampPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__extras_extras__["a" /* ExtrasPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__buchungen_buchungen__["a" /* BuchungenPage */];
    }
    return TabsPage;
}());
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="Eingabe" tabIcon="home"></ion-tab>\n\n  <ion-tab [root]="tab2Root" tabTitle="Extras" tabIcon="information-circle"></ion-tab>\n\n  <ion-tab [root]="tab3Root" tabTitle="Buchungen" tabIcon="information-circle"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [])
], TabsPage);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimestampPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_globalvar__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(81);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TimestampPage = (function () {
    function TimestampPage(globVars, navCtrl) {
        this.globVars = globVars;
        this.navCtrl = navCtrl;
        this.globVars.timer = this.globVars.logoutTime;
        this.globVars.countDown();
    }
    TimestampPage.prototype.changeUser = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
    };
    return TimestampPage;
}());
TimestampPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\timestamp\timestamp.html"*/'\n\n<ion-header>\n\n<ion-navbar> <!-- hideBackButton falls Countdown! -->\n\n  <ion-title>\n\n    {{globVars.appNameVers}}\n\n  </ion-title>\n\n</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="page4">\n\n\n\n  <h2 style="text-align:center">Hallo, {{globVars.globCurrUser.name}}!</h2>\n\n<!--  <p align="right"> {{globVars.timer}} </p> -->\n\n  <h3 style="text-align:center"> Aktueller Status: {{globVars.globCurrUser.status}} </h3>\n\n\n\n  <br>\n\n  <p align="center">\n\n    <button ion-button icon-left large (click)="globVars.makeStamp(\'Arbeit\')">\n\n    <ion-icon name="briefcase"></ion-icon> Arbeit EIN (1)</button>\n\n  <br><br>\n\n    <button ion-button icon-left large color="secondary" (click)="globVars.makeStamp(\'Pause\')">\n\n    <ion-icon name="cafe"></ion-icon> Pause EIN (7) </button>\n\n  <br><br>\n\n    <button ion-button icon-left color="danger" large (click)="globVars.makeStamp(\'Freizeit\')">\n\n      <ion-icon name="home"></ion-icon> Arbeit AUS (9)</button>\n\n\n\n<p align="center"> {{globVars.localDate}} </p>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\timestamp\timestamp.html"*/,
        selector: 'page-timestamp'
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__providers_globalvar__["a" /* GlobalVars */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* NavController */]])
], TimestampPage);

//# sourceMappingURL=timestamp.js.map

/***/ }),

/***/ 279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsProPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timestamppro_timestamppro__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__extras_extras__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__buchungen_buchungen__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__team_team__ = __webpack_require__(282);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TabsProPage = (function () {
    function TabsProPage() {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__timestamppro_timestamppro__["a" /* TimestampProPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_4__team_team__["a" /* TeamPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__extras_extras__["a" /* ExtrasPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_3__buchungen_buchungen__["a" /* BuchungenPage */];
    }
    return TabsProPage;
}());
TabsProPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\tabspro\tabspro.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="Eingabe" tabIcon="home"></ion-tab>\n\n  <ion-tab [root]="tab2Root" tabTitle="Team" tabIcon="people"></ion-tab>\n\n  <ion-tab [root]="tab3Root" tabTitle="Extras" tabIcon="information-circle"></ion-tab>\n\n  <ion-tab [root]="tab4Root" tabTitle="Buchungen" tabIcon="copy"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\tabspro\tabspro.html"*/
    }),
    __metadata("design:paramtypes", [])
], TabsProPage);

//# sourceMappingURL=tabspro.js.map

/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimestampProPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_globalvar__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_keyboard__ = __webpack_require__(281);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TimestampProPage = (function () {
    function TimestampProPage(globVars, navCtrl, keyboard, toastCtrl) {
        this.globVars = globVars;
        this.navCtrl = navCtrl;
        this.keyboard = keyboard;
        this.toastCtrl = toastCtrl;
        var currStatusNr = 0;
        this.globVars.timer = this.globVars.logoutTime;
        if (this.globVars.autoLogout)
            this.globVars.countDown();
        while (this.globVars.globCurrUser.status != this.globVars.tsTyp[currStatusNr]) {
            ++currStatusNr;
        }
        if (currStatusNr >= 1 && currStatusNr <= 6)
            globVars.workTimeRuns = true;
        else
            globVars.workTimeRuns = false;
        this.globVars.globCurrUser.worktimeToday = 0;
        this.globVars.workTimeCounter();
        //  alert("in Timestamppro1:"+this.globVars.currPlatform);
    }
    TimestampProPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.globVars.comment = '';
        if (this.globVars.currPlatform == "Desktop")
            setTimeout(function () {
                _this.myInput.setFocus();
            }, 400);
        if (this.globVars.currPlatform == "Handy")
            this.keyboard.close();
    };
    //-----------------------------------------------------------------------------------
    TimestampProPage.prototype.handleTEXT = function () {
        var _this = this;
        this.globVars.comment = this.globVars.comment.trim();
        var buchungOK = true; // bekommt erst eine Bedeutung, wenn ABBRUCH der Buchung möglich
        var uhrZeit = false;
        if (buchungOK) {
            var ziffern = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            //prüfen, ob letzte 2 Buchstaben des Kommentars eine Space + eine Zahl ist - Zahl hinter Kommentar wichtiger, als Zahl vorne
            if (this.globVars.comment.length > 1) {
                if ((ziffern.indexOf(this.globVars.comment.charAt(this.globVars.comment.length - 1)) != -1) && (this.globVars.comment.charAt(this.globVars.comment.length - 2) == ' ')) {
                    //alert("Länge >1 + hinten steht eine Arbeits-Typ-Zahl, keine Uhrzeit -> umdrehen!");
                    this.globVars.comment = this.globVars.comment.charAt(this.globVars.comment.length - 1) +
                        this.globVars.comment.substr(0, this.globVars.comment.length - 1);
                    //alert("umgedreht:"+this.globVars.comment);
                }
            } // hier gehts weiter, nachdem ein etwaig hinten angehängter Arbeits-Typ nach vor kopiert wurde
            if (ziffern.indexOf(this.globVars.comment.charAt(0)) != -1) {
                //alert("Zahl vorne");
                var tsTypeNr_1 = Number(this.globVars.comment.charAt(0));
                this.globVars.comment = this.globVars.comment.substr(1).trim();
                var comment = prompt("[" + this.globVars.tsTyp[tsTypeNr_1] + "] - Kommentar:", this.globVars.comment);
                if (comment !== null) {
                    this.globVars.comment = comment;
                    this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr_1]);
                }
                else {
                    //alert("Abbruch durch User, obwohl Zahl vorne");
                    var toast = this.toastCtrl.create({
                        message: '!!!KEIN!!! Zeitstempel - Buchung wurde durch User abgebrochen',
                        duration: 4000,
                        showCloseButton: false,
                        position: 'middle'
                    });
                    toast.onDidDismiss(function () { });
                    toast.present();
                    //        this.globVars.comment="";
                }
                ;
            } // End-If:  Es steht eine Zahl vorne = Arbeits-Typ
            else {
                //this.globVars.comment="";
                var tsTypeNr = this.globVars.tsTyp.indexOf(this.globVars.globCurrUser.status);
                var comment = prompt("[" + this.globVars.tsTyp[tsTypeNr] + "] - Kommentar:", this.globVars.comment);
                if (comment !== null) {
                    this.globVars.comment = comment;
                    this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
                }
                else {
                    var toast = this.toastCtrl.create({
                        message: '!!!KEIN!!! Zeitstempel eingetragen - Buchung wurde durch User abgebrochen',
                        duration: 4000,
                        showCloseButton: false,
                        position: 'middle'
                    });
                    toast.onDidDismiss(function () { });
                    toast.present();
                    //    this.globVars.comment="";
                }
                ;
            }
            ; // End-Else (1. Buchst keine Zahl - Auto-Ergänzung Stempel)
            if (this.globVars.currPlatform == "Desktop") {
                setTimeout(function () {
                    _this.myInput.setFocus();
                }, 5000);
            }
            ;
            if (this.globVars.currPlatform == "Handy")
                this.keyboard.close();
        }
    };
    TimestampProPage.prototype.timestampClick = function (tsTypeNr) {
        var _this = this;
        this.globVars.comment = this.globVars.comment.trim();
        var buchungOK = true; // bekommt erst eine Bedeutung, wenn ABBRUCH der Buchung möglich
        if (buchungOK) {
            var comment = prompt("[" + this.globVars.tsTyp[tsTypeNr] + "] - Kommentar:", this.globVars.comment);
            /*  if (!(comment == null || comment == "")) {
                this.globVars.comment = comment;
              }
              */
            if (comment !== null) {
                this.globVars.comment = comment;
                this.globVars.makeStamp(this.globVars.tsTyp[tsTypeNr]);
            }
            else {
                var toast = this.toastCtrl.create({
                    message: '!!!KEIN!!! Zeitstempel eingetragen - Buchung wurde durch User abgebrochen',
                    duration: 4000,
                    showCloseButton: false,
                    position: 'middle'
                });
                toast.onDidDismiss(function () { });
                toast.present();
            }
            ;
        }
        ;
        if (this.globVars.currPlatform == "Desktop")
            setTimeout(function () {
                _this.myInput.setFocus();
            }, 5000);
        if (this.globVars.currPlatform == "Handy")
            this.keyboard.close();
    };
    return TimestampProPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('focusInput'),
    __metadata("design:type", Object)
], TimestampProPage.prototype, "myInput", void 0);
TimestampProPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\timestamppro\timestamppro.html"*/'<ion-header>\n\n<ion-navbar> <!-- hideBackButton wird vermutlich nicht notwendig sein -->\n\n  <ion-title>\n\n    {{globVars.appNameVers}} - <span *ngIf="globVars.workTimeTodayHour">{{globVars.workTimeTodayHour}}h </span> {{globVars.workTimeTodayMin}}m -\n\n    <span *ngIf="globVars.workTimeRuns"><ion-icon name="time"></ion-icon>  </span>\n\n    <span *ngIf="globVars.workTimeRuns==false"><ion-icon name="close-circle"></ion-icon> </span>\n\n  </ion-title>\n\n</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="page4">\n\n\n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col>\n\n        <img src="https://ordination-kutschera.at/zen.gif" alt="Smiley face" height="80" width="80">\n\n      </ion-col>\n\n      <ion-col>\n\n        <h3 style="text-align:center">{{globVars.globCurrUser.name}} </h3>\n\n      </ion-col>\n\n      <ion-col align="right">\n\n\n\n        <h3>[KW:{{globVars.KW_akt}}]</h3>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n  <span style="background-color:Red" *ngIf="(this.globVars.autoLogout==true)"><p align="right">Logout in: {{globVars.timer}} sec</p></span>\n\n\n\n  <h4 style="text-align:center"> Status:\n\n\n\n    <span style="color:#3dcc82" *ngIf="globVars.globCurrUser.status==globVars.tsTyp[1]||globVars.globCurrUser.status==globVars.tsTyp[2]||globVars.globCurrUser.status==globVars.tsTyp[3]||globVars.globCurrUser.status==globVars.tsTyp[4]||globVars.globCurrUser.status==globVars.tsTyp[5]||globVars.globCurrUser.status==globVars.tsTyp[6]">{{globVars.globCurrUser.status}} </span>\n\n    <span style="color:#488aff" *ngIf="globVars.globCurrUser.status==globVars.tsTyp[7]||globVars.globCurrUser.status==globVars.tsTyp[8]">{{globVars.globCurrUser.status}} </span>\n\n    <span style="color:#f53d3d" *ngIf="globVars.globCurrUser.status==globVars.tsTyp[9]||globVars.globCurrUser.status==globVars.tsTyp[0]">{{globVars.globCurrUser.status}} </span>\n\n\n\n  <span *ngIf="globVars.globCurrUser.lastcomment">\n\n ({{globVars.globCurrUser.lastcomment}}) </span>\n\n <br>\n\n  seit: {{globVars.globCurrUser.lasttimestamp}} </h4>\n\n\n\n  <ion-item>\n\n    <ion-label color="primary" stacked>Kommentar:</ion-label>\n\n    <ion-input [(ngModel)]="globVars.comment" #focusInput (keyup.enter)="handleTEXT()"></ion-input>\n\n  </ion-item>\n\n\n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col align="right">\n\n        <button ion-button small block icon-left color=\'secondary\' (click)="timestampClick(1)">\n\n        <ion-icon name="briefcase"></ion-icon>{{globVars.tsTyp[1]}}&nbsp; (1)</button></ion-col>\n\n      <ion-col>\n\n        <button ion-button small block icon-left color=\'secondary\' (click)="timestampClick(2)">\n\n        <ion-icon name="car"></ion-icon>{{globVars.tsTyp[2]}}&nbsp; (2)</button></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col align="right">\n\n        <button ion-button small icon-left block color=\'secondary\' (click)="timestampClick(3)">\n\n        <ion-icon name="wifi"></ion-icon>{{globVars.tsTyp[3]}}&nbsp;(3)\n\n      </button></ion-col>\n\n      <ion-col>\n\n        <button ion-button small icon-left block color=\'secondary\' (click)="timestampClick(4)">\n\n        <ion-icon name="contact"></ion-icon>{{globVars.tsTyp[4]}}&nbsp;(4)  </button></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col align="right">\n\n        <button ion-button small icon-left block (click)="timestampClick(7)">\n\n        <ion-icon name="cafe"></ion-icon>{{globVars.tsTyp[7]}} &nbsp;(7)</button></ion-col>\n\n      <ion-col>\n\n        <button ion-button small icon-left block (click)="timestampClick(8)">\n\n        <ion-icon name="sunny"></ion-icon>{{globVars.tsTyp[8]}} &nbsp;(8) </button></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col align="right">\n\n        <button ion-button small icon-left block  color="danger" (click)="timestampClick(9)">\n\n        <ion-icon name="home"></ion-icon>{{globVars.tsTyp[9]}} &nbsp;(9) </button></ion-col>\n\n      <ion-col>\n\n        <button ion-button small icon-left block  color="danger"  (click)="timestampClick(0)">\n\n        <ion-icon name="medkit"></ion-icon>{{globVars.tsTyp[0]}} &nbsp;(0)</button></ion-col>\n\n    </ion-row>\n\n\n\n  </ion-grid>\n\n\n\n  <!-- <p align="center"> {{globVars.localDate}} </p> -->\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\timestamppro\timestamppro.html"*/,
        selector: 'page-timestamppro'
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__providers_globalvar__["a" /* GlobalVars */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_keyboard__["a" /* Keyboard */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* ToastController */]])
], TimestampProPage);

//# sourceMappingURL=timestamppro.js.map

/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TeamPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_globalvar__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TeamPage = (function () {
    function TeamPage(backand, navCtrl, globVars) {
        this.backand = backand;
        this.navCtrl = navCtrl;
        this.globVars = globVars;
        this.users = [];
        //this.globVars.timer=30;
    }
    TeamPage.prototype.ionViewWillEnter = function () {
        this.reloadTeam(null);
    };
    ;
    //Aufruf mit (1) sortiert alphabetisch, (0) zeitlich
    TeamPage.prototype.changeSort = function (alpha) {
        if (alpha) {
            this.globVars.teamSortAlpha = true;
        }
        else {
            this.globVars.teamSortAlpha = false;
        }
        this.reloadTeam(null);
    };
    // Falls mit Parameter aufgerufen -> Refresher-Objekt für Pull-Reload
    TeamPage.prototype.reloadTeam = function (refresher) {
        var _this = this;
        var params;
        if (this.globVars.teamSortAlpha) {
            params = {
                filter: this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
                sort: this.backand.helpers.sort.create('name', this.backand.helpers.sort.orders.asc)
            };
        }
        else {
            params = {
                filter: this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, 1),
                sort: this.backand.helpers.sort.create('lasttimestampISO', this.backand.helpers.sort.orders.desc)
            };
        }
        ;
        this.backand.object.getList('Users', params)
            .then(function (res) {
            _this.users = res.data;
            //alert("!");
            if (refresher) {
                refresher.complete();
            }
        }, function (err) {
            alert(err.data);
            if (refresher) {
                refresher.complete();
            }
        });
    };
    ;
    return TeamPage;
}());
TeamPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\team\team.html"*/'<ion-header>\n\n<ion-navbar hideBackButton>\n\n\n\n          <ion-title>{{globVars.appNameVers}} - Team: {{globVars.globCurrUser.name}}</ion-title>\n\n\n\n</ion-navbar>\n\n<!-- <p align="right"> {{globVars.timer}} </p> -->\n\n\n\n</ion-header>\n\n\n\n<ion-content padding class="page5">\n\n\n\n  <ion-refresher (ionRefresh)="reloadTeam($event)">\n\n    <ion-refresher-content>\n\n\n\n    </ion-refresher-content>\n\n  </ion-refresher>\n\n\n\n\n\n  <ion-grid>\n\n    <ion-row class="titles">\n\n      <ion-col>\n\n        <div (click)=\'changeSort(true)\'>Name\n\n          <span *ngIf="globVars.teamSortAlpha"><ion-icon name="arrow-dropdown-circle"></ion-icon></span>\n\n          <span *ngIf="!globVars.teamSortAlpha"><ion-icon name="arrow-dropdown"></ion-icon></span>\n\n         </div>\n\n      </ion-col>\n\n<!--      <ion-col>\n\n        MA_Farbe\n\n      </ion-col>\n\n-->\n\n      <ion-col>\n\n        Status\n\n      </ion-col>\n\n      <ion-col>\n\n        <div (click)=\'changeSort(false)\'>Letzte Buchung\n\n          <span *ngIf="!globVars.teamSortAlpha"><ion-icon name="arrow-dropdown-circle"></ion-icon></span>\n\n          <span *ngIf="globVars.teamSortAlpha"><ion-icon name="arrow-dropdown"></ion-icon></span>\n\n        </div>\n\n      </ion-col>\n\n      <ion-col>\n\n        Kommentar\n\n      </ion-col>\n\n<!--      <ion-col>\n\n        Arbeitszeit\n\n      </ion-col> -->\n\n    </ion-row>\n\n\n\n\n\n    <ion-row *ngFor="let user of users; let odd=odd; let even=even;" [ngClass]="{ odd: odd, even: even }">\n\n\n\n      <ion-col>\n\n\n\n        <span style="background-color:Grey" *ngIf="(user.name==\'Tom\')">__{{user.name}}__</span>\n\n        <span style="background-color:#488aff" *ngIf="(user.name==\'David\')">_ {{user.name}} _</span>\n\n        <span style="background-color:Orange" *ngIf="(user.name==\'Horst\')">_ {{user.name}} _</span>\n\n        <span style="background-color:Red" *ngIf="(user.name==\'Emir\')">__{{user.name}}__</span>\n\n        <span style="background-color:Fuchsia" *ngIf="(user.name==\'Thomas\')">{{user.name}}</span>\n\n        <span style="background-color:Yellow" *ngIf="(user.name==\'Sigi\')">__{{user.name}}__</span>\n\n\n\n  <!--\n\n        <span style="color:Grey" *ngIf="((user.name==\'Tom\') && (this.globVars.currPlatform ==\'Handy\'))"><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Grey" *ngIf="((user.name==\'Tom\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n        <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n\n\n        <span style="color:Blue" *ngIf="((user.name==\'David\') && (this.globVars.currPlatform ==\'Handy\'))"><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Blue" *ngIf="((user.name==\'David\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n        <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n\n\n        <span style="color:Orange" *ngIf="((user.name==\'Horst\') && (this.globVars.currPlatform ==\'Handy\'))"><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Orange" *ngIf="((user.name==\'Horst\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n        <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n\n\n        <span style="color:Fuchsia" *ngIf="((user.name==\'Thomas\') && (this.globVars.currPlatform ==\'Handy\'))"><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Fuchsia" *ngIf="((user.name==\'Thomas\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n        <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n\n\n        <span style="color:Red" *ngIf="((user.name==\'Emir\') && (this.globVars.currPlatform ==\'Handy\'))"><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Red" *ngIf="((user.name==\'Emir\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n        <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n\n\n        <span style="color:Yellow" *ngIf="((user.name==\'Sigi\') && (this.globVars.currPlatform ==\'Handy\'))"><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Yellow" *ngIf="((user.name==\'Sigi\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n        <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n\n\n        <span style="color:Grey"  *ngIf="((user.name==\'Tom\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n          <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Blue"  *ngIf="((user.name==\'David\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n          <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Orange"  *ngIf="((user.name==\'Horst\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n          <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Fuchsia"  *ngIf="((user.name==\'Thomas\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n          <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Red"  *ngIf="((user.name==\'Emir\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n          <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n        <span style="color:Yellow"  *ngIf="((user.name==\'Sigi\') && (this.globVars.currPlatform ==\'Desktop\'))">\n\n          <ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon><ion-icon name="square"></ion-icon></span>\n\n        -->\n\n        <span *ngIf="!((user.name==\'Tom\') || (user.name==\'David\')|| (user.name==\'Horst\')|| (user.name==\'Emir\')|| (user.name==\'Thomas\')|| (user.name==\'Sigi\'))"> {{user.name}} </span>\n\n      </ion-col>\n\n\n\n      <ion-col>\n\n        <span style="background-color:#488aff" *ngIf="((user.status==\'Pause EIN\'))">!!! {{user.status}} !!! </span>\n\n        <span style="background-color:LightPink" *ngIf="((user.lastcomment ==\'bns\') || (user.lastcomment==\'Bns\') )">!! {{user.status}} !! </span>\n\n        <span style="background-color:cyan" *ngIf="((user.lastcomment ==\'#\')||(user.lastcomment ==\'.\'))">!! {{user.status}} !! </span>\n\n        <div *ngIf="!((user.status==\'Pause EIN\') || (user.lastcomment ==\'#\') || (user.lastcomment ==\'.\') || (user.lastcomment ==\'bns\') || (user.lastcomment ==\'Bns\'))">\n\n          <span style="color:#f53d3d" *ngIf="user.status==\'Krank\'"> <ion-icon name="radio-button-on"></ion-icon>  </span>\n\n          <span style="color:#3dcc82" *ngIf="user.status==\'Arbeit EIN\'"> <ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#ffcc00" *ngIf="user.status==\'AD-Fahrt\'"> <ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#ffcc00" *ngIf="user.status==\'AD-Kunde\'"> <ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#3dcc82" *ngIf="user.status==\'Tele-Arbeit\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#3dcc82" *ngIf="user.status==\'Projekt 1\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#3dcc82" *ngIf="user.status==\'Projekt 2\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#488aff" *ngIf="user.status==\'Pause EIN\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n          <span style="color:#488aff" *ngIf="user.status==\'Urlaub\'"> <ion-icon name="radio-button-on"></ion-icon>  </span>\n\n          <span style="color:#f53d3d" *ngIf="user.status==\'Arbeit AUS\'"><ion-icon name="radio-button-on"></ion-icon> </span>\n\n          {{user.status}}\n\n        </div>\n\n      </ion-col>\n\n\n\n      <ion-col>\n\n        {{user.lasttimestamp}}\n\n      </ion-col>\n\n      <ion-col>\n\n        {{user.lastcomment}}\n\n      </ion-col>\n\n<!-- <ion-col>\n\n\n\n      </ion-col>  -->\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\team\team.html"*/,
        selector: 'page-extras',
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__["BackandService"], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_globalvar__["a" /* GlobalVars */]])
], TeamPage);

//# sourceMappingURL=team.js.map

/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(290);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_socket_io_client__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_socket_io_client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_login_login__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_crud_crud__ = __webpack_require__(624);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_timestamp_timestamp__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_team_team__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_extras_extras__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_buchungen_buchungen__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_tabspro_tabspro__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_timestamppro_timestamppro__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_keyboard__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_device__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_status_bar__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_splash_screen__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_dialogs__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_nfc__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__providers_globalvar__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




window["io"] = __WEBPACK_IMPORTED_MODULE_3_socket_io_client___default.a;

















//import { LocalNotifications } from 'ionic-native';

var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_crud_crud__["a" /* CrudPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_timestamp_timestamp__["a" /* TimestampPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_team_team__["a" /* TeamPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_extras_extras__["a" /* ExtrasPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_buchungen_buchungen__["a" /* BuchungenPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_tabspro_tabspro__["a" /* TabsProPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_timestamppro_timestamppro__["a" /* TimestampProPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                links: []
            }),
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_crud_crud__["a" /* CrudPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_timestamp_timestamp__["a" /* TimestampPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_extras_extras__["a" /* ExtrasPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_team_team__["a" /* TeamPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_buchungen_buchungen__["a" /* BuchungenPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_tabspro_tabspro__["a" /* TabsProPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_timestamppro_timestamppro__["a" /* TimestampProPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_18__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_16__backand_angular2_sdk__["BackandService"],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["LOCALE_ID"], useValue: 'de-AT' },
            __WEBPACK_IMPORTED_MODULE_21__providers_globalvar__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_15__ionic_native_device__["a" /* Device */],
            __WEBPACK_IMPORTED_MODULE_14__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_19__ionic_native_dialogs__["a" /* Dialogs */],
            __WEBPACK_IMPORTED_MODULE_20__ionic_native_nfc__["a" /* NFC */],
            __WEBPACK_IMPORTED_MODULE_20__ionic_native_nfc__["b" /* Ndef */],
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 346:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__backand_angular2_sdk__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, backand) {
        var _this = this;
        this.backand = backand;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            backand.init({
                appName: 'julianstodotest',
                signUpToken: '49adba36-4b0c-4154-8ccb-d4d3d89344e2',
                anonymousToken: '2f16bb43-cd8b-4960-96e5-c4f0688a86c8',
                runSocket: true,
                mobilePlatform: 'ionic'
            });
            _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        });
    }
    return MyApp;
}());
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        template: "<ion-nav [root]=\"rootPage\"></ion-nav>"
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_5__backand_angular2_sdk__["BackandService"]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalVars; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_login_login__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__ = __webpack_require__(278);
// Ideen für Parameter/USER
//   teamSortAlpha (Alex)
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var GlobalVars = (function () {
    function GlobalVars(backand, app, device, platform, toastCtrl) {
        this.backand = backand;
        this.app = app;
        this.device = device;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.comment = "";
        // obige Struktur wird aus DB übernommen, wenn User festgelegt wird
        //         worktimeToday
        //
        // public workTimeRuns = false; // gibt an, dass die Arbeitszeit für den akt User läuft oder nicht -> ergibt sich aber aus akt User.lasttimestamp
        this.timer = 0;
        this.appNameVers = "KD-ZEN";
        this.appVers = "V1.0.2A";
        this.testFlag = 0; //AutoLogin mit Julian -> 1, Richie 2, sonst 0
        /* später Versuch, ob 1* pro Tag ausloggen sinnvoll ist
        public logouttime:number = 20*60*60; // = 20*60*60 Sekunden= 20 Stunden - einmal pro Tag
        timestamppro: Countdown, Zeile 20 Kommentar entfernt
        */
        this.autoLogout = false; // steuert den Logout-Timer
        this.logoutTime = 7; //20*60*60; // = 20*60*60 Sekunden= 20 Stunden - einmal pro Tag
        this.pinLength = 3; // Länge des Login-Pins
        this.serverDateStr = ""; // UTC-Zeit des Logins = univ.ServerZeit (Zeit kommt vom Backand-Server!)
        this.clientDateStr = ""; // Zeit des Clients
        this.clientDateStrUTC = "";
        //public localDate:Date = null; // lokale Zeit, weil auf PCs in KD falsche Zeit, wegen Windows-Domain-Controller-Fehler +10min
        this.clientDateDiff = 0; //=localDate-createdat-date(=ServerZeit) =Zeitdiff in ms zwischen localDate und date(universelle Server-Zeit)
        // bei jedem Login wird ein Eintrag in die Login-DB gemacht -> im createdAt-Feld steht die aktuelle universelle Zeit
        // jetzt wird die Zeitdifferenz der aktuellen Instanz berechnet und als globale Var geführt
        // daraus lässt sich über date(Now)(=lokale Zeit)+localDateDiff die "reale"Zeit zu jedem Zeitpunkt berechnen, ohne erneut
        // beim Server nachfragen zu müssen.
        this.currPlatform = "Desktop";
        this.browserPlatform = navigator.platform;
        // public farbe="text-align:center,color:secondary";
        this.KW_akt = 0;
        // tsTyp=Timestamp-Typ -  Array (0..9) - vorläufig 5,6 nicht verwendet (Projekt1,2)
        //                0         1           2           3            4           5          6            7          8          9
        this.tsTyp = ["Krank", "Arbeit EIN", "AD-Fahrt", "Tele-Arbeit", "AD-Kunde", "Projekt 1", "Projekt 2", "Pause EIN", "Urlaub", "Arbeit AUS"];
        this.workTimeTodayShow = new Date(); //dient zur Anzeige der aktuellen Arbeitszeit
        this.workTimeTodayHour = 1; // dient zur Anzeige der Stunden
        this.workTimeTodayMin = 0; // dient zur Anzeige der Minuten
        this.teamSortAlpha = false;
        this.companies = [
            {
                ID: 1,
                name: "Kutschera"
            },
            { ID: 2,
                name: "TestCompany"
            }
        ];
        /*  wenn neues Terminal:
                  1. Terminal-angaben kopieren
                  2. neue devID, usrPIN (Hauptterminal="", MA="Team")
                  3. devAnzahl erhöhen
                  4. autoLogout setzen
                  5. registrierung durchführen
        
         */
        this.devAnzahl = 7;
        this.ZEN_Devices = [
            {
                devID: 1,
                usrPin: "21",
                // als Abkürzung, damit CheckUser genutzt werden kann -> später suche aus DB
                regDate: "15112017",
                companyID: 1,
                MA: "Richie",
                devMAno: 1,
                devTyp: "Handy",
                devOs: "Android6",
                devBrowser: "Samsung",
                devName: "SamsungA5",
                devCode: "r143241"
            },
            {
                devID: 2,
                usrPin: "21",
                regDate: "r15112017",
                companyID: 1,
                MA: "Richie",
                devMAno: 2,
                devTyp: "Desktop",
                devOs: "Windows10",
                devBrowser: "Firefox",
                devName: "Ri-Erazer",
                devCode: "r143242"
            },
            {
                devID: 3,
                usrPin: "21",
                regDate: "15112017",
                companyID: 1,
                MA: "Richie",
                devMAno: 3,
                devTyp: "Desktop",
                devOs: "Windows7",
                devBrowser: "Firefox",
                devName: "Ri-Toshiba",
                devCode: "r143243"
            },
            {
                devID: 4,
                usrPin: "11",
                regDate: "15112017",
                companyID: 1,
                MA: "Horst",
                devMAno: 1,
                devTyp: "Handy",
                devOs: "iOS6",
                devBrowser: "Safari",
                devName: "Ho-iPhone",
                devCode: "r343241"
            },
            {
                devID: 5,
                usrPin: "11",
                regDate: "15112017",
                companyID: 1,
                MA: "Horst",
                devMAno: 2,
                devTyp: "Desktop",
                devBrowser: "Firefox",
                devOs: "Windows7",
                devName: "Horst-PC",
                devCode: "r432241"
            },
            {
                devID: 6,
                usrPin: "23",
                regDate: "15112017",
                companyID: 1,
                MA: "Emir",
                devMAno: 1,
                devTyp: "Desktop",
                devBrowser: "Firefox",
                devOs: "Windows7",
                devName: "Emir-PC",
                devCode: "r331241"
            },
            {
                devID: 7,
                usrPin: "",
                regDate: "15112017",
                companyID: 1,
                MA: "Team",
                devMAno: 1,
                devTyp: "Win-Tablet",
                devBrowser: "Chrome",
                devOs: "Windows10",
                devName: "Haupt-Terminal",
                devCode: "r331241"
            },
            {
                devID: 99999,
                usrPin: "9a9b9c",
                regDate: "15112017",
                companyID: 1,
                MA: "Dummy",
                devMAno: 1,
                devTyp: "Desktop",
                devBrowser: "Firefox",
                devOs: "Windows7",
                devName: "Dummy-PC",
                devCode: "r9a9b9c99999"
            }
        ];
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
        ARM          - Thomas, Julian(Nokia)
        Linux armv7l - Richie
        Linux armv8l - Sigi
        iPhone       - Horst, David
        MacIntel     - Didi (Desktop)
      --eigene Desktops:
        Win32        - Su,To
        Win64        - Ju,Ri,Al
        */
        this.currPlatform = "Handy"; // die meisten unbekannten Codes kommen von einem unbek. Handy
        switch (this.browserPlatform) {
            case "Win64":
                this.currPlatform = "Desktop";
                break;
            case "Win32":
                this.currPlatform = "Desktop";
                break;
            case "MacIntel":
                this.currPlatform = "Desktop";
                break;
        }
        //------------Erkennung, ob bereits registriert
        // Test, ob Browser "Storage" unterstützt
        if (typeof (Storage) !== "undefined") {
            this.currDevice = JSON.parse(window.localStorage.getItem("ZEN-Device1")); //Device1 steht, weil auf
            //     meinem PC bereits ein "ZEN-Device"-Registrierungs-Eintrag vorhanden ist
            //alert("currDevice:" + this.currDevice.MA + this.currDevice.devTyp)
            if (this.currDevice !== null) {
                alert("Bereits registriert! - Da ist ein Device-Objekt");
            }
            ;
            // dieses Device ist noch nicht registriert!!! - weiter zum LOGIN
            //  alert("KEIN Device-Objekt gespeichert-weiter zum Login")
        }
        else
            alert("Ihr Browser unterstützt keine lokale Speicherung");
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
    GlobalVars.prototype.workTimeCounter = function () {
        var _this = this;
        // update alle 60 sec
        var update = 60000;
        this.workTimeTodayShow = new Date(this.globCurrUser.worktimeToday);
        this.workTimeTodayHour = this.workTimeTodayShow.getUTCHours();
        this.workTimeTodayMin = this.workTimeTodayShow.getUTCMinutes();
        //alert("WTT:"+this.globCurrUser.worktimeToday+" - Show: "+this.workTimeTodayShow.toISOString()+"-Hour:"+this.workTimeTodayHour+"-Min:"+this.workTimeTodayMin);
        if (this.workTimeRuns)
            this.globCurrUser.worktimeToday = this.globCurrUser.worktimeToday + update;
        //  else this.workPauseToday=  --> könnte Pausenzeiten auch miterfassen
        this.workTimeTimeout = setTimeout(function () { _this.workTimeCounter(); }, update);
        //  clearTimeout(this.workTimeTimout);
    };
    GlobalVars.prototype.countDown = function () {
        var _this = this;
        this.timer = this.timer - 1;
        if (this.timer > 0) {
            setTimeout(function () { _this.countDown(); }, 1000);
        }
        else {
            this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_login_login__["a" /* LoginPage */]);
        }
        //alert(this.timer);
    };
    GlobalVars.prototype.getTSNumber = function (stampString) {
        var TSNumber = 1;
        switch (stampString) {
            case this.tsTyp[2]:
                TSNumber = 2;
                break;
            case this.tsTyp[3]:
                TSNumber = 3;
                break;
            case this.tsTyp[4]:
                TSNumber = 4;
                break;
            case this.tsTyp[5]:
                TSNumber = 5;
                break;
            case this.tsTyp[6]:
                TSNumber = 6;
                break;
            case this.tsTyp[7]:
                TSNumber = 7;
                break;
            case this.tsTyp[8]:
                TSNumber = 8;
                break;
            case this.tsTyp[9]:
                TSNumber = 9;
                break;
            case this.tsTyp[0]:
                TSNumber = 0;
                break;
        }
        return (TSNumber);
    };
    GlobalVars.prototype.calcWorkTime = function (tsList) {
        //Berechnet Arbeitszeit für eine Liste von TS
        var workON = false;
        var begin = null;
        var end = null;
        var sum = 0;
        for (var i = tsList.length - 1; i > -1; i--) {
            var tsNumber = this.getTSNumber(tsList[i].status);
            if (tsNumber > 0 && tsNumber < 7) {
                begin = new Date(tsList[i].date);
                begin -= begin % 60000; //Runden auf volle Minuten
                workON = true;
                for (; i > -1; --i) {
                    tsNumber = this.getTSNumber(tsList[i].status);
                    if (tsNumber == 0 || tsNumber > 6) {
                        end = new Date(tsList[i].date);
                        end -= end % 60000;
                        sum += end - begin;
                        workON = false;
                        break;
                    }
                }
            } //Wiederhole bis zum Ende der Liste
        }
        if (workON) {
            end = (Date.now() - this.clientDateDiff);
            end -= end % 60000;
            sum += end - begin;
        }
        return (sum);
    };
    GlobalVars.prototype.makeStamp = function (stampType) {
        var _this = this;
        var makeStamp = true;
        var neuStampTypeNr;
        var altStampTypeNr;
        //  var currComm : string;
        var splitCommArr;
        // im Folgenden: Def: Arbeits-Typ=(1..6)=(Arbeit EIN, AD-Fahrt, Tele-Arbeit, AD-Kunde, P1, P2,)
        //               Def: Arbeits-Stop-Typ= (Pause=7, Urlaub=8, Arbeit AUS=9, Krank=  0)
        //               Def: AS = alter status, NS = neuer Status
        //stampTypNr wird gesetzt durch Vergleich, bis passt
        altStampTypeNr = 0;
        while (this.globCurrUser.status != this.tsTyp[altStampTypeNr]) {
            ++altStampTypeNr;
        }
        ;
        neuStampTypeNr = 0;
        while (stampType != this.tsTyp[neuStampTypeNr]) {
            ++neuStampTypeNr;
        }
        ;
        //alert("MAKESTAMP-Start- alter Status:"+this.globCurrUser.status+"-altStampTypeNr:"+altStampTypeNr+"-neuer Status:"+stampType+"-neuStampTypeNr:"+neuStampTypeNr);
        //if AS = Arbeits-Stop-Typ=(Urlaub=8,Arbeit AUS=9,Krank=0)
        if ((altStampTypeNr == 0 || altStampTypeNr == 8) || altStampTypeNr == 9)
            //&& NS = Arbeits-Typ (1..6)= Übergang von Arbeits-Stop auf Arbeit -> worktimeToday auf 0!
            if (neuStampTypeNr >= 1 && neuStampTypeNr <= 6) {
                // !!! könnte auch Re-Start von Arbeit am selben Tag(oder nach Mitternacht) sein
                //  alert("Tagesarbeitszeit wird auf 0 gesetzt!"); //T-Arbeitszeit auf Null setzen = 0
                this.globCurrUser.worktimeToday = 0;
                this.workTimeRuns = true;
            }
            else if (neuStampTypeNr == 7) {
                //  alert("Übergang von Arbeits-Stop-Typ auf Pause");
            } // else NS=(8,9,0)
            else {
                //  alert("Übergang von Status: "+this.globCurrUser.status+" auf: "+ stampType+ "- Arbeitszeit läuft weiterhin nicht");
            }
        else if (altStampTypeNr == 7) {
            // AS=Pause=7 && NS = Arbeits-Typen
            if (neuStampTypeNr >= 1 && neuStampTypeNr <= 6) {
                //alert("Tagesarbeitszeit läuft ab jetzt weiter");
                this.workTimeRuns = true;
            }
            else {
                //workTimeRuns bleibt auf STOP
                this.workTimeRuns = false;
                //alert("alter Status= Pause=7 && neuer Status= 7,8,9,0"+this.workTimeRuns);
            } //else-Ende
        }
        else if (neuStampTypeNr >= 1 && neuStampTypeNr <= 6) {
            //alert("alter Status= Arbeits-Typ(=1..6) && neuer Status= Arbeits-Typ (=1..6)");
        }
        else if (neuStampTypeNr == 7) {
            //    alert ("von Arbeit auf Pause");
            // letzte Arbeitszeit wird zu worktimeToday hinzugezählt
            // aktuelle Zeit - lasttimestamp = Arbeitszeit (ms)
            this.workTimeRuns = false;
        }
        else {
            //  alert("alter Status= Arbeits-Typ(=1..6) && neuer Status= Arbeits-Stop-Typ(=8,9,0)");
            // letzte Arbeitszeit wird zu worktimeToday hinzugezählt
            this.workTimeRuns = false;
        }
        //else-ende
        //else-ende
        //else-ende
        //Ende der Abfrage bzgl worktimeToday
        //alert("Ende der worktimeToday-Behandlung erreicht");
        // else-> wenn "alter Status"=Arbeits-Typ (1..6) && ("neuer Status"= Arbeits-Stop-Typ) -> worktimeToday anhalten
        // else-> wenn "alter Status"= (Pause) && ("neuer Status"= Arbeits-Typ(1..60))-> Zeit weiterlaufen lassen
        // else if (this.clobCurrUser.status=.....)
        var korrektur = 0; // 0..kein Korrektur-Tag, 1..Korrektur OK, 2.. Korrektur Fehler (z.B. Zeit falsch angegeben,etc.)
        if (makeStamp) {
            //ServerZeit wird hochgerechnet aus client + Diff;
            var ziffern = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            var uhrZiffern = ['0', '1', '2', '3', '4', '5', '6'];
            var currComment = this.comment;
            //alert ("makestamp1:"+ currComment+"!");
            if (currComment.charAt(0) == "#" || currComment.charAt(0) == ".")
                currComment = currComment.substr(1).trim(); // "#" od. "." wird wegggeschnitten
            //alert ("makestamp2= #:"+ currComment+"!");
            /*      if (currComment.charAt(0) == "k" || currComment.charAt(0) == "K") { // möglicherweise Korrekturbuchung
                    if (currComment.charAt(1) == " " || uhrErsteZiffer.indexOf(currComment.charAt(1)) !=-1) {  // Korrektur-Zeit wird eingearbeitet
                      currComment = currComment.substr(1).trim();
                      korrektur=2;
                    }
                  }
            */
            if (currComment.charAt(0) == "k" || currComment.charAt(0) == "K") {
                //alert ("makestamp3= #k:"+ currComment+"!");
                korrektur = 2; // wenn später keine korrekte Uhrzeit festgestellt wird, dann Fehler
                // if erste vier Buchstaben sind Zahlen -> einfügen von ":" in currComment
                currComment = currComment.substr(1).trim(); // "k" wird weggeschnitten und getrimmt
                var n = currComment.indexOf(".");
                //alert(currComment+"--n:"+n);
                if (n == 2) {
                    currComment = currComment.replace(".", ":");
                    //alert("Uhrzeit mit . -> Uhrzeit mit : -"+currComment);
                }
                ;
                // if erste vier Buchstaben sind Zahlen -> einfügen von ":" in currComment
                if ((uhrZiffern.indexOf(currComment.charAt(0)) != -1) && (ziffern.indexOf(currComment.charAt(1)) != -1) &&
                    (uhrZiffern.indexOf(currComment.charAt(2)) != -1) && (ziffern.indexOf(currComment.charAt(3)) != -1)) {
                    var part1 = currComment.slice(0, 2);
                    var part2 = currComment.slice(2);
                    currComment = part1 + ":" + part2;
                }
                ;
                // entweder: keine vier Ziffern || vier Ziffern mit ":" in der Mitte
                n = currComment.indexOf(':');
                if (n !== -1) {
                    if (n == 2) {
                        //zerlegen in HH:MM
                        var uhr = currComment.substr(0, 5);
                        //alert ("Uhr:"+ uhr+"!");
                        splitCommArr = uhr.split(':');
                        if (splitCommArr.length = 2) {
                            //alert("Stunden:"+ splitCommArr[0]+"Minuten:"+ splitCommArr[1]); //Minuten
                            if ((splitCommArr[0].length == 2) && (splitCommArr[1].length == 2)) {
                                //alert ("wahrscheinlich Uhrzeit:"+ uhr+"!");
                                if ((uhrZiffern.indexOf(uhr.charAt(0)) != -1) && (ziffern.indexOf(uhr.charAt(1)) != -1) && (uhr.charAt(2) == ':')
                                    && (uhrZiffern.indexOf(uhr.charAt(3)) != -1) && (ziffern.indexOf(uhr.charAt(4)) != -1)) {
                                    if ((Number((uhr.charAt(0) + uhr.charAt(1))) >= 0) && (Number((uhr.charAt(0) + uhr.charAt(1))) <= 23) &&
                                        (Number((uhr.charAt(3) + uhr.charAt(4))) <= 59)) {
                                        //alert("=Uhrzeit!");
                                        korrektur = 1;
                                    }
                                    ;
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                    if (korrektur != 1) {
                        this.comment = 'Falsches Zeit-Format: ' + this.comment;
                    }
                    ;
                }
                else {
                    korrektur = 0;
                    //this.comment = 'Keine Uhrzeit angegeben: '+this.comment;
                }
            }
            //    if (currComment.charAt(0) == "a" || currComment.charAt(0) =="A") {  // Korrektur-Zeit wird eingearbeitet
            //      alert("Hier kommt später der Alarm");  // .a30 -> 30 Min Alarm
            //    }
            //  };
            //alert("comment:"+this.comment+"currComment:"+currComment);
            var clientMillisec = Date.now();
            this.clientDate = new Date(clientMillisec);
            this.serverDate = new Date(clientMillisec - this.clientDateDiff);
            if (korrektur == 1) {
                this.serverDate.setHours(splitCommArr[0]);
                this.serverDate.setMinutes(splitCommArr[1]);
                //  alert("serverDate(korrigiert):"+this.serverDate.toISOString());
            }
            ;
            if (korrektur !== 2) {
                var lastTimeStamp = new Date(this.globCurrUser.lasttimestampISO);
                //  alert("sD:"+this.serverDate.toISOString()+"ltsISO:"+lastTimeStamp.toISOString());
                if (this.serverDate > new Date(clientMillisec - this.clientDateDiff)) {
                    var inp = prompt("!!! ACHTUNG !!!", "Korrektur-Zeit wird GESTERN eingetragen - OK?");
                    if (inp !== null) {
                        this.serverDate = new Date((this.serverDate.setDate(this.serverDate.getDate() - 1)));
                        //alert("gestern:" + this.serverDate.toString());
                    }
                    else
                        korrektur = 2; // nicht eintragen !!!
                }
                //alert("test:"+this.comment + "korr:"+korrektur);
                if (korrektur == 1 && this.comment[0] != "#") {
                    if (this.comment[0] == ".")
                        this.comment = this.comment.substr(1);
                    this.comment = "#" + this.comment;
                }
                if (this.serverDate <= new Date(clientMillisec - this.clientDateDiff)) {
                    if (this.serverDate > lastTimeStamp) {
                        // alert("das zu buchende Datum ist neuer als der letzte Timestamp");
                        // normale Buchung vorbereiten
                        // Server-Zeitproblem auf KD-Desktops -> geht 10 min vor - Workaround
                        //if (this.currPlatform == "Desktop") currMillisec-=(600*1000);
                        // Workaround-Ende
                        //this.clientDate = (new Date(currMillisec)); // ISO-damit alphabet.Sortierung möglich
                        //Umwandlung von String-> Date-Objekt OK:
                        // Stunden,Minuten mit führender 0
                        var Hours = "";
                        var Minutes = "";
                        if (this.serverDate.getHours() < 10)
                            Hours = "0" + this.serverDate.getHours();
                        else
                            Hours = this.serverDate.getHours().toString();
                        if (this.serverDate.getMinutes() < 10)
                            Minutes = "0" + this.serverDate.getMinutes();
                        else
                            Minutes = this.serverDate.getMinutes().toString();
                        this.globCurrUser.lasttimestamp = this.serverDate.getDate() + "." + (this.serverDate.getMonth() + 1) + ". um " + Hours + ":" + Minutes;
                        this.globCurrUser.lasttimestampISO = this.serverDate.toISOString(); //schreibt in Orts-Zeit
                        //this.globCurrUser.lasttimestampUTC = this.localDate.toUTCString(); //schreibt in ISO Zeit
                        //  this.globCurrUser.lasttimestampUTC_d = this.localDate; //schreibt in Backand-"Date"-Feld -> ISO-Zeit
                        this.globCurrUser.lastcomment = this.comment;
                        this.globCurrUser.status = stampType;
                        this.backand.object.update('Users', this.globCurrUser.id, this.globCurrUser);
                    }
                    ;
                    // if-Ende: "normale Buchung" vorbereiten
                    // if "autoLogout" = Kennung vorläufig für HAUPT-Terminal
                    var hauptTerminal = "";
                    if (this.autoLogout)
                        hauptTerminal = "-!!!KD!!!";
                    this.backand.object.create('Timestamps2', "{'date':'" + this.serverDate.toISOString() + "', 'status':'" +
                        stampType + "','userid':'" + this.globCurrUser.id + "','username':'" +
                        this.globCurrUser.name + "','comment':'" + this.comment + "','device':'" + this.currPlatform + hauptTerminal +
                        "','browserPlatform':'" + navigator.platform + "'}")
                        .then(function (res) {
                        //      alert("nach Create: ms->Date:"+this.serverDate.getTime()+ "cms:" + clientMillisec +"clientdiff-ms"+this.clientDateDiff+
                        //      "serverDate:" + this.serverDate.toLocaleString()+
                        //      "--clientDate:" + this.clientDate.toLocaleString()+"!");
                        if (korrektur == 0) {
                            var toast = _this.toastCtrl.create({
                                message: 'Zeitstempel wurde eingetragen',
                                duration: 3000,
                                position: 'top'
                            });
                            toast.onDidDismiss(function () { });
                            toast.present();
                            _this.comment = "";
                        }
                        else {
                            var toast = _this.toastCtrl.create({
                                message: 'Korrektur-Zeitstempel wurde eingetragen',
                                duration: 4000,
                                position: 'top'
                            });
                            toast.onDidDismiss(function () { });
                            toast.present();
                            _this.comment = "";
                        }
                        ;
                    }, function (err) {
                        alert(err.data);
                    });
                    this.comment = "";
                }
                else {
                    var toast = this.toastCtrl.create({
                        message: '!!!KEIN!!! Zeitstempel eingetragen - Korrektur-Zeit in Zukunft',
                        duration: 4000,
                        showCloseButton: false,
                        position: 'middle'
                    });
                    toast.onDidDismiss(function () { });
                    toast.present();
                }
                ;
            }
            else {
                var toast = this.toastCtrl.create({
                    message: '!!!KEIN!!! Zeitstempel eingetragen - Fehler bei Korrektur-Text',
                    duration: 4000,
                    showCloseButton: false,
                    position: 'middle'
                });
                toast.onDidDismiss(function () { });
                toast.present();
            }
            ;
        } // end-if makestamp
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
    };
    GlobalVars.prototype.KW = function () {
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
        var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
        // At the beginnig or end of a year the thursday could be in another year.
        var yearOfThursday = currentThursday.getFullYear();
        // Get first Thursday of the year
        var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
        // +1 we start with week number 1
        // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
        var KW = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
        return KW;
    };
    return GlobalVars;
}()); //export Class: GlobalVars
GlobalVars = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__["BackandService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__["BackandService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* App */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* App */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__["a" /* Device */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__["a" /* Device */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Platform */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Platform */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* ToastController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* ToastController */]) === "function" && _e || Object])
], GlobalVars);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=globalvar.js.map

/***/ }),

/***/ 624:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CrudPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_globalvar__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CrudPage = (function () {
    function CrudPage(backand, globalVars) {
        this.backand = backand;
        this.globalVars = globalVars;
        this.name = "Name";
        this.description = 'Wonderful';
        this.items = [];
        /*    this.searchQuery = '';
            let that = this;
            this.backand.on("items_updated",
              (res: any) => {
                alert("!");
                let a = res as any[];
                let newItem = {};
                a.forEach((kv)=> newItem[kv.Key] = kv.Value);
                that.items.unshift(newItem);
              }
            );
          */
    }
    return CrudPage;
}());
CrudPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\crud\crud.html"*/'\n\n<ion-navbar *navbar>\n\n  <ion-title>\n\n    CRUD\n\n  </ion-title>\n\n</ion-navbar>\n\n\n\n<ion-content class="page3">\n\n	<h2>CRUD</h2>\n\n\n\n\n\n    <ion-list>\n\n        <ion-item>\n\n            ADD TODO:\n\n        </ion-item>\n\n\n\n        <ion-item>\n\n           <ion-label fixed>Name</ion-label>\n\n            <ion-input type="text" [value]="name" (input)="name = $event.target.value"></ion-input>\n\n        </ion-item>\n\n\n\n        <ion-item>\n\n            <ion-label fixed>Description</ion-label>\n\n            <ion-input type="text" [value]="description" (input)="description = $event.target.value"></ion-input>\n\n        </ion-item>\n\n\n\n\n\n\n\n\n\n    </ion-list>\n\n\n\n    <button ion-button (click)="postItem()" color="warning">Post Item</button>\n\n\n\n    <hr/>\n\n\n\n    <button ion-button (click)="getItems()">Get Items</button>\n\n\n\n    <ion-searchbar\n\n      [(ngModel)]="searchQuery"\n\n      (ionInput)="filterItems($event.target.value)">\n\n    </ion-searchbar>\n\n\n\n    <ion-list>\n\n        <ion-item *ngFor="let of items">\n\n          <h2>{{ item.name }}</h2>\n\n          <p>{{ item.description }}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\crud\crud.html"*/,
        selector: 'page-crud'
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__backand_angular2_sdk__["BackandService"], __WEBPACK_IMPORTED_MODULE_2__providers_globalvar__["a" /* GlobalVars */]])
], CrudPage);

//# sourceMappingURL=crud.js.map

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tabs_tabs__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tabspro_tabspro__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_globalvar__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_dialogs__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_nfc__ = __webpack_require__(284);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










//import { LocalNotifications } from 'ionic-native';
//angeblich notwendig, damit die Dialoge "aktiviert" werden.
/*function onDeviceReady() {
    alert('onDevReady'+'navigator.notification');
}
*/
var LoginPage = (function () {
    function LoginPage(backand, navCtrl, globVars, plt, dialogs, nfc, ndef) {
        this.backand = backand;
        this.navCtrl = navCtrl;
        this.globVars = globVars;
        this.plt = plt;
        this.dialogs = dialogs;
        this.nfc = nfc;
        this.ndef = ndef;
        this.textInput = ''; // = eingegebene Textzeile für Commandos und User-PIN
        this.inputID = ''; // = User-ID aus Text-Input-String
        this.items = [];
        this.allusers = [];
        this.onHandy = false;
    }
    LoginPage.prototype.NFC_onSuccess = function () { alert("onSuccess"); };
    ;
    LoginPage.prototype.NFC_onError = function () { alert("onError"); };
    ;
    LoginPage.prototype.ionViewDidEnter = function () {
        /*    var myWindow = window.open("", "MsgWindow", "width=200,height=100");
            myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
        alert("Test"+this.globVars.pinLength);
        */
        var _this = this;
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
        if (this.plt.is('cordova')) {
            this.nfc.addNdefListener(function () { alert('successfully anttached ndef listener'); }, function (err) { alert('error attaching ndef listener' + err); })
                .subscribe(function (event) {
                alert('received ndef message. the tag contains: ' + event.tag);
                alert('decoded tag id' + _this.nfc.bytesToHexString(event.tag.id));
                var message = _this.ndef.textRecord("Hello world", "UTF-8", "8");
                _this.nfc.share([message])
                    .then(_this.NFC_onSuccess)
                    .catch(_this.NFC_onError);
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
        if (!this.globVars.autoLogout) {
            this.textInput = '';
            setTimeout(function () {
                _this.myInput.setFocus();
            }, 150);
        }
        //not so crazy workaround for no login
        if (this.globVars.testFlag == 1) {
            this.inputID = "333";
            this.checkUser();
        }
        if (this.globVars.testFlag == 2) {
            this.inputID = "222";
            this.checkUser();
        }
    };
    /*
      if (this.plt.is('core')) {
          // This will only print when on Desktop
          alert("Zeiterfassung läuft auf Desktop-PC!")
      }
      else alert("Zeiterfassung läuft auf Handy!");
    
    ABFRAGE FÜR HANDY/DESKTOP */
    LoginPage.prototype.loginClear = function () {
        this.textInput = "";
        this.inputID = "";
    };
    ;
    LoginPage.prototype.handleText = function () {
        // wenn Eingabe mit "r" beginnt, dann RegistrierungsCode !!!
        if (this.textInput[0] == "r") {
            var i = -1;
            do {
                i++;
                //      alert("handleText--I: "+i+"Anz:"+this.globVars.devAnzahl);
            } while ((i < this.globVars.devAnzahl) && (this.globVars.ZEN_Devices[i].devCode !== this.textInput));
            if (this.globVars.ZEN_Devices[i].devCode == this.textInput) {
                alert("Eingabe-Text ist ein Reg.Code" + this.globVars.ZEN_Devices[i].MA + "---geplant: Registrierung schreiben+Eintrag, dass registriert"); //Registrierung schreiben
                //weiter zu CheckUser
                this.inputID = this.globVars.ZEN_Devices[i].usrPin;
                this.checkUser();
                return;
            }
            // wenn kein Reg-Code gefunden, obwohl "r" erster Buchstabe ist
            alert("es wurde kein Reg-Code gefunden, obwohl 'r' erster Buchstabe ist");
            this.textInput = "";
            return;
        }
        ;
        //else {     // es ist eine normale PIN-Eingabe -> Suche nach User
        //alert("normale PIN oder hinter Reg-Code");
        /*  let tempId = "";
          for(var i=0;i<this.globVars.pinLength;i++){
            tempId += this.textInput.charAt(i);
          }
          this.inputID = tempId; */
        this.inputID = this.textInput;
        this.checkUser();
    };
    LoginPage.prototype.handlePIN = function (inputNumber) {
        //if (inputNumber == "1"){
        //  alert("1 wurde eingegeben-Zeit läuft");
        //};
        //if (inputNumber == "2"){
        //  alert("2 wurde eingegeben-Zeit angehalten");
        //};
        this.inputID += inputNumber;
        this.textInput += inputNumber;
        if (this.inputID.length == this.globVars.pinLength) {
            this.checkUser();
        }
    };
    LoginPage.prototype.checkUser = function () {
        //  alert("checkUser-InputID:"+this.inputID);
        var _this = this;
        // neue Idee für Tages-Arbeitszeit: wird dann auf 0 gesetzt, wenn der Übergang von
        // "Arbeit AUS" auf "Arbeit"= EIN,AD-Fahrt,...Projekt2 erfolgt.(in globalvar.ts/makestamp) Das ist der Arbeitsbeginn!
        // Arbeitszeit= Tag, Woche, Monats- Arbeitszeit
        // wenn Übergang auf "Arbeit AUS" -> Tages-Arbeitszeit nicht extra speichern
        // Problem, wenn neue Woche, neues Monat: da passt dann das untere Modell
        var params = {
            filter: [
                this.backand.helpers.filter.create('password', this.backand.helpers.filter.operators.text.equals, this.inputID),
            ],
        };
        this.backand.object.getList('Users', params)
            .then(function (res) {
            _this.items = res.data;
            if (_this.items.length > 0) {
                _this.globVars.globCurrUser = _this.items[0];
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
                var loginRec;
                _this.backand.object.create('Login', "{'name':'" + _this.globVars.globCurrUser.name + "', 'userID':'" +
                    _this.globVars.globCurrUser.userID + "', 'device':'" + _this.globVars.currPlatform + ":" + _this.plt.platforms() + "'}")
                    .then(function (res1) {
                    var params = "";
                    _this.backand.object.getOne('Login', res1.data.__metadata.id, params)
                        .then(function (res2) {
                        // hole Client-Zeit
                        var clientMilliSec = Date.now();
                        _this.globVars.clientDate = new Date(Date.now());
                        // hole Server-Zeit aus geschriebenen Login-rec
                        loginRec = res2.data;
                        _this.globVars.serverDate = new Date(loginRec.createdAt + "Z");
                        var servMilliSec = _this.globVars.serverDate.getTime();
                        _this.globVars.clientDateDiff = clientMilliSec - servMilliSec;
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
                        var d = new Date(_this.globVars.globCurrUser.lasttimestampISO);
                        if (d.getDate() !== _this.globVars.serverDate.getDate()) {
                            // Datum d. Logins hat sich geändert -> letzter Arbeitstag speichern in vorletzter = b(efore)last...
                            // klappt nicht mit "blasttimestamp", weil Backand-DB Fehler hat : deswegen ...UTC_d (war schon für Test definiert)
                            // alert("Datum NEU: oldDate:"+d.getDate()+"newDate:"+this.globVars.serverDate.getDate());
                            _this.globVars.globCurrUser.lasttimestampUTC_d = _this.globVars.globCurrUser.lasttimestampISO;
                        }
                        ;
                        //var g = new Date(this.globVars.globCurrUser.lasttimestampUTC_d)
                        //alert ("d-string:"+d.toString()+"g-string:"+ g.toString() + "g:"+g.getDate());
                    }, function (err) {
                        alert("Error: Login/Res2:" + err.data);
                    });
                }, // then res1
                function (err) {
                    alert("Error: Login/Res1:" + err.data);
                });
                //end TimeInit
                // SHOW Timestamp dependig on user level
                if (_this.globVars.globCurrUser.applevel == "pro") {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__tabspro_tabspro__["a" /* TabsProPage */]);
                }
                else {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__tabs_tabs__["a" /* TabsPage */]);
                }
                _this.inputID = '';
            }
            else {
                alert("This user doesn't exist!");
                _this.inputID = '';
                _this.textInput = '';
            }
        }, function (err) {
            alert(err.data);
        });
    };
    return LoginPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('focusInput'),
    __metadata("design:type", Object)
], LoginPage.prototype, "myInput", void 0);
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projects\newTimeCatcher\src\pages\login\login.html"*/'<ion-header>\n\n<ion-navbar hideBackButton>\n\n  <ion-title>\n\n    {{globVars.appNameVers}} {{globVars.appVers}}\n\n  </ion-title>\n\n</ion-navbar>\n\n</ion-header>\n\n<ion-content padding class="page1">\n\n\n\n  <h2 style="text-align:center">PIN eingeben</h2>\n\n\n\n  <p align="center">\n\n    <br> <br>\n\n    <button ion-button large align="center" (click)="handlePIN(1)">1</button>\n\n    <button ion-button large align="center" (click)="handlePIN(2)">2</button>\n\n    <button ion-button large align="center" (click)="handlePIN(3)">3</button>\n\n    <br>\n\n    <button ion-button large align="center" (click)="handlePIN(4)">4</button>\n\n    <button ion-button large align="center" (click)="handlePIN(5)">5</button>\n\n    <button ion-button large align="center" (click)="handlePIN(6)">6</button>\n\n    <br>\n\n    <button ion-button large align="center" (click)="handlePIN(7)">7</button>\n\n    <button ion-button large align="center" (click)="handlePIN(8)">8</button>\n\n    <button ion-button large align="center" (click)="handlePIN(9)">9</button>\n\n  </p>\n\n  <p align="center">\n\n    <ion-item>\n\n      <ion-label color="primary" stacked>PIN:</ion-label>\n\n      <ion-input [(ngModel)]="textInput" #focusInput (keyup.enter)="handleText()"></ion-input>\n\n    </ion-item>\n\n  <br>\n\n  </p>\n\n  <button ion-button align="center" (click)="loginClear()">Clear</button>\n\n  <ion-item>\n\n    <ion-label> = Auto-Logout</ion-label>\n\n    <ion-checkbox [(ngModel)]="this.globVars.autoLogout" color="dark" checked="false"></ion-checkbox>\n\n  </ion-item>\n\n  <span>\n\n    <p align="center">{{loginfehler}} </span>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Projects\newTimeCatcher\src\pages\login\login.html"*/,
        selector: 'page-login',
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__backand_angular2_sdk__["BackandService"], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_6__providers_globalvar__["a" /* GlobalVars */],
        __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_dialogs__["a" /* Dialogs */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_nfc__["a" /* NFC */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_nfc__["b" /* Ndef */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ })

},[285]);
//# sourceMappingURL=main.js.map