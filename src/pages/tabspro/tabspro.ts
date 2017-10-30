import { Component } from '@angular/core';

import { TimestampPage } from '../timestamp/timestamp';
import { ExtrasPage } from '../extras/extras';

@Component({
  templateUrl: 'tabspro.html'
})
export class TabsProPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ExtrasPage;
  tab2Root: any = ExtrasPage;


  constructor() {}
}
