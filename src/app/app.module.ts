import { LOCALE_ID, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import io from 'socket.io-client';
window["io"] = io;


import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { CrudPage } from '../pages/crud/crud';
import { TimestampPage } from '../pages/timestamp/timestamp';
import { TeamPage } from '../pages/team/team';
import { TabsPage } from '../pages/tabs/tabs';
import { ExtrasPage } from '../pages/extras/extras';
import { BuchungenPage } from '../pages/buchungen/buchungen';
import { TabsProPage } from '../pages/tabspro/tabspro';
import { TimestampProPage } from '../pages/timestamppro/timestamppro';

import { Keyboard } from '@ionic-native/keyboard';
import { Device } from '@ionic-native/device';
import { BackandService } from '@backand/angular2-sdk';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Dialogs } from '@ionic-native/dialogs';
import { NFC, Ndef } from '@ionic-native/nfc';

import { GlobalVars } from '../providers/globalvar';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CrudPage,
    TimestampPage,
    TeamPage,
    ExtrasPage,
    BuchungenPage,
    TabsPage,
    TabsProPage,
    TimestampProPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    LoginPage,
    CrudPage,
    TimestampPage,
    ExtrasPage,
    TeamPage,
    BuchungenPage,
    TabsPage,
    TabsProPage,
    TimestampProPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackandService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'de-AT' },
    GlobalVars,
    Device,
    Keyboard,
    Dialogs,
    NFC,
    Ndef,
  ]
})
export class AppModule {}
