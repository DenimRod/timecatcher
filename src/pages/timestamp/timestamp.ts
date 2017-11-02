import { Component } from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';


@Component({
  templateUrl: 'timestamp.html',
  selector: 'page-timestamp'
})
export class TimestampPage {

  public currentDate:string="";
  public localDate:Date= null;

  name:any="";
  description:string = 'Wonderful';
  public items:any[] = [];
  searchQuery: string;

  constructor(private backand: BackandService, public globVars: GlobalVars, public navCtrl: NavController, public app: App) {

    this.globVars.timer=this.globVars.logouttime;
    this.globVars.countDown();

  }

public changeUser(){
  this.navCtrl.push(LoginPage);
}
/*
public startBreak(){
  this.globVars.globCurrUser.status="Pause";
  this.backand.object.update('Users', this.globVars.globCurrUser.id, this.globVars.globCurrUser);
}

public endBreak(){
  if (this.globVars.globCurrUser.status=="Pause"){
    this.globVars.globCurrUser.status="Arbeit";
    this.backand.object.update('Users', this.globVars.globCurrUser.id, this.globVars.globCurrUser);
  }
}

public endWork(){
  this.globVars.globCurrUser.status="Außer Dienst";
  this.backand.object.update('Users', this.globVars.globCurrUser.id, this.globVars.globCurrUser);
}
public startWork(){
  this.globVars.globCurrUser.status="Arbeit";
  this.backand.object.update('Users', this.globVars.globCurrUser.id, this.globVars.globCurrUser);

  this.currentDate = (new Date()).toISOString();
  this.localDate = new Date(this.currentDate);

  this.backand.object.create('Timestamps', "{'date':'" + this.currentDate + "', 'status':'" + this.globVars.globCurrUser.status + "'}")
}*/
  public postItem() {
    let item = {
      name: this.name,
      description: this.description
    };

    if (item.name && item.description) {
      this.backand.object.create('todo', item)
      .then((res: any) => {
        // add to beginning of array
        this.items.unshift({ id: null, name: this.name, description: this.description });
        this.name = '';
        this.description = '';
      },
      (err: any) => {
        alert(err.data);
      });
    }
  }

  public getItems() {
   this.backand.object.getList('todo')
    .then((res: any) => {
      this.items = res.data;
    },
    (err: any) => {
      alert(err.data);
    });
  }

  public filterItems() {
    // set q to the value of the searchbar
    var q = this.searchQuery;

    // if the value is an empty string don't filter the items
    if (!q || q.trim() == '') {
      return;
    }
    else{
        q = q.trim();
    }


    let params = {
      filter: [
        this.backand.helpers.filter.create('name', this.backand.helpers.filter.operators.text.contains, q),
      ],
    }

    this.backand.object.getList('todo', params)
    .then((res: any) => {
      this.items = res.data;
    },
    (err: any) => {
      alert(err.data);
    });
  }

}
