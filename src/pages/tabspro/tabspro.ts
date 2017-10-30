import { Component } from '@angular/core';

import { TimestampProPage } from '../timestamppro/timestamppro';
import { ExtrasPage } from '../extras/extras';

@Component({
  templateUrl: 'tabspro.html'
})
export class TabsProPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimestampProPage;
  tab2Root: any = ExtrasPage;


  constructor() {}
}
