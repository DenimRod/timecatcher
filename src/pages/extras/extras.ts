import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TimestampPage } from '../timestamp/timestamp';
import { GlobalVars } from '../../providers/globalvar';

@Component({
    templateUrl: 'extras.html',
    selector: 'page-extras',
})
export class ExtrasPage {

  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars) {

  }
  }
