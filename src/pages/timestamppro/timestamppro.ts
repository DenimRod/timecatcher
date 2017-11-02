import { Component,ViewChild } from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';


@Component({
  templateUrl: 'timestamppro.html',
  selector: 'page-timestamppro'
})
export class TimestampProPage {
@ViewChild('focusInput') myInput;

//  public currentDate:string="";
//  public localDate:Date= null;

  
  name:any="";
  description:string = 'Wonderful';
  public items:any[] = [];
  searchQuery: string;

  constructor(private backand: BackandService, public globVars: GlobalVars, public navCtrl: NavController, public app: App) {
/*
    this.searchQuery = '';
    let that = this;
    this.backand.on("items_updated",
      (res: any) => {
        alert("!");
        let a = res as any[];
        let newItem = {};
        a.forEach((kv)=> newItem[kv.Key] = kv.Value);
        that.items.unshift(newItem);
      }
    );*/
    this.globVars.timer=this.globVars.logouttime;
    this.globVars.countDown();
  /*this.globVars.timer = 5;
   this.globVars.logouttime=60000;
  alert(this.globVars.logouttime);
  setTimeout(function(){globVars.countDown()}, 1000);
  setTimeout(function(){globVars.countDown()}, 2000);
  setTimeout(function(){globVars.countDown()}, 3000);
  setTimeout(function(){globVars.countDown()}, 4000);
  setTimeout(function(){globVars.countDown()}, 5000);

  setTimeout(()=>{this.app.getRootNav().setRoot(LoginPage );this.globVars.timer=5;},this.globVars.logouttime);
  //  var TimeoutID = window.setTimeout(alert, 2000, "!");
*/
  }

ionViewDidEnter() {
    this.comment = '';
    setTimeout(() => {
      this.myInput.setFocus();
    },400);

 }

public handleComment(){

}

public changeUser(){
  this.navCtrl.push(LoginPage);
}

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
