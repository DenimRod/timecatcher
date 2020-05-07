import { Component } from '@angular/core';
import { TimestampPage } from '../timestamp/timestamp';
import { ExtrasPage } from '../extras/extras';
import { BuchungenPage } from '../buchungen/buchungen';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimestampPage;
  tab2Root: any = ExtrasPage;
  tab3Root: any = BuchungenPage;

  constructor() {}
}
