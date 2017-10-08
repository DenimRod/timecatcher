import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { BackandService } from '@backand/angular2-sdk'

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
// @Component({
//   template: `<h1>Hello World!</h1>`
// })
export class MyApp {
  rootPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private backand:BackandService) {
    platform.ready().then(() => {
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
      this.rootPage = TabsPage;
    });
  }
}
