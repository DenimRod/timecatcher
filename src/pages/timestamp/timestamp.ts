import { Component } from '@angular/core';
import { BackandService } from '@backand/angular2-sdk';
import { GlobalVars } from '../../providers/globalvar';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'timestamp.html',
  selector: 'page-timestamp'
})
export class TimestampPage {

  name:string = this.globVars.globCurrUser.name;
  description:string = 'Wonderful';
  public items:any[] = [];
  searchQuery: string;

  //my vars
//  timer:number = 5+3;

  constructor(private backand: BackandService, public globVars: GlobalVars, public navCtrl: NavController) {
    this.searchQuery = '';
    let that = this;
    this.backand.on("items_updated",
      (res: any) => {
        let a = res as any[];
        let newItem = {};
        a.forEach((kv)=> newItem[kv.Key] = kv.Value);
        that.items.unshift(newItem);
      }
    );
  //  this.navCtrl.push(LoginPage);
  setTimeout(function(){globVars.countDown()}, 1000);
  setTimeout(function(){globVars.countDown()}, 2000);
  setTimeout(function(){globVars.countDown()}, 3000);
  setTimeout(function(){globVars.countDown()}, 4000);
  setTimeout(function(){globVars.countDown()}, 5000);

  setTimeout(function(){navCtrl.push(LoginPage)}, 6000);
  //  var TimeoutID = window.setTimeout(alert, 2000, "!");

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
