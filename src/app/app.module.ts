import { LOCALE_ID, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import io from 'socket.io-client';
window["io"] = io;

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TimestampPage } from '../pages/timestamp/timestamp';
import { TeamPage } from '../pages/team/team';
import { TabsPage } from '../pages/tabs/tabs';
import { ExtrasPage } from '../pages/extras/extras';
import { BuchungenPage } from '../pages/buchungen/buchungen';
import { Buchungen_fremdPage } from '../pages/buchungen_fremd/buchungen_fremd';
import { TabsProPage } from '../pages/tabspro/tabspro';
import { TimestampProPage } from '../pages/timestamppro/timestamppro';

import { Keyboard } from '@ionic-native/keyboard';
import { Device } from '@ionic-native/device';
//import { BackandService } from '@backand/angular2-sdk';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Dialogs } from '@ionic-native/dialogs';
import { NFC, Ndef } from '@ionic-native/nfc';
//import { LocalNotifications } from 'ionic-native';
import { GlobalVars } from '../providers/globalvar';
import { AutoStatusUpdateProvider } from '../providers/auto-status-update/auto-status-update';

//Imports for Firebase
//import { AngularFireModule} from 'angularfire2';
//import { FIREBASE_CONFIG} from './firebase.credentials';
//import { AngularFireDatabaseModule } from 'angularfire2/database';
//import { ShoppingListService } from '../providers/shopping-list.service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TimestampPage,
    TeamPage,
    ExtrasPage,
    BuchungenPage,
    Buchungen_fremdPage,
    TabsPage,
    TabsProPage,
    TimestampProPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //AngularFireModule.initializeApp(FIREBASE_CONFIG),
    //AngularFireDatabaseModule,
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    LoginPage,
    TimestampPage,
    ExtrasPage,
    TeamPage,
    BuchungenPage,
    Buchungen_fremdPage,
    TabsPage,
    TabsProPage,
    TimestampProPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
  //  BackandService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'de-AT' },
    GlobalVars,
    Device,
    Keyboard,
    Dialogs,
    NFC,
    Ndef,
    AutoStatusUpdateProvider,
//    ShoppingListService
//    LocalNotifications,
  ]
})
export class AppModule {}
