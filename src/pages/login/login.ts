import {Component, ViewChild} from '@angular/core';
import 'rxjs/Rx'
import { BackandService } from '@backand/angular2-sdk';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { TabsProPage } from '../tabspro/tabspro';
import { GlobalVars } from '../../providers/globalvar';
import { Platform } from 'ionic-angular';



@Component({
    templateUrl: 'login.html',
    selector: 'page-login',
})
export class LoginPage {
  @ViewChild('focusInput') myInput;


/*  username:string = 'ionic2@backand.io';
  password:string = '123456';
  auth_type:string = "N/A";
  is_auth_error:boolean = false;
  auth_status:string = null;
  loggedInUser: string = '';

  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
*/
// Heres tha real code
  public textInput:string = ''; // = eingegebene Textzeile für Commandos und User-PIN
  inputID:string = ''; // = User-ID aus Text-Input-String
  public items:any[] = [];
  public allusers:any[] = [];
  public onHandy:boolean=false;
  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars, public plt: Platform) {
  /* ??? noch benutzt ???
    this.backand.user.getUserDetails().then(
      (res: any) => {
        if(res.data) {
          this.loggedInUser = res.data.username;
          this.auth_status = 'OK';
          this.auth_type = res.data.token_type == 'Anonymous' ? 'Anonymous' : 'Token';
        }
      },
      (err: any) => {
        this.loggedInUser = null;
        this.auth_status = null;
        this.auth_type = null;
      }
    );
*/
  }

ionViewDidEnter() {
  this.textInput = '';
  setTimeout(() => {
    this.myInput.setFocus();
  },150);


/*  if (this.plt.is('core')) {
      // This will only print when on Desktop
      alert("Zeiterfassung läuft auf Desktop-PC!")
  }
  else alert("Zeiterfassung läuft auf Handy!");

ABFRAGE FÜR HANDY/DESKTOP */

//not so crazy workaround for no login
//this.inputID = "22";
//this.checkUser();

}


  public handleText(){
    let tempId = "";

    for(var i=0;i<this.globVars.pinlength;i++){
      tempId += this.textInput.charAt(i);
    }
    this.inputID = tempId;
    this.checkUser();
  }

  public handlePIN(inputNumber:string){
    this.inputID += inputNumber;
    this.textInput += inputNumber;

    if (this.inputID.length == this.globVars.pinlength){
      this.checkUser();
    }
  }

  public checkUser(){
      let params = {
        filter: [
          this.backand.helpers.filter.create('password', this.backand.helpers.filter.operators.text.equals, this.inputID),
        ],
      }

      this.backand.object.getList('Users', params)
       .then((res: any) => {
         this.items = res.data;

         if (this.items.length > 0) {
           this.globVars.globCurrUser = this.items[0];

         // COMPANY QUERY
           let params2 = {
             filter: [
               this.backand.helpers.filter.create('id', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrUser.companyid),
             ],
           }

           this.backand.object.getList('Companies', params2)
            .then((res: any) => {
              this.globVars.globCurrComp = res.data[0];

              // Check if last login was before today
                // if monatstag != last monatstag  ...
                let currentDate = new Date();
                this.globVars.globCurrComp.lastLoginDay = currentDate.getDate();

            //get every user of this company and set worktimeToday = 0
                let params3 = {
                  filter: [
                    this.backand.helpers.filter.create('companyid', this.backand.helpers.filter.operators.text.equals, this.globVars.globCurrComp.id),
                  ],
                }

                this.backand.object.getList('Users', params3)
                 .then((res: any) => {
                   this.allusers = res.data;
                   var d = new Date(0);
                   for (let i=0;i<this.allusers.length;i++){
                     this.allusers[i].worktimeToday=d;
                     this.backand.object.update('Users', i+1, this.allusers[i]);
                   }
                 },
                 (err: any) => {
                   alert(err.data);
                 });
            },
            (err: any) => {
              alert(err.data);
            });

      // auf Handy?
         if (this.onHandy) this.globVars.currPlatform="Handy"
         else this.globVars.currPlatform="Desktop";
      // SHOW Timestamp dependig on user level
          if (this.globVars.globCurrUser.applevel == "pro"){
            this.navCtrl.push(TabsProPage);
          }
          else {
            this.navCtrl.push(TabsPage);
          }
            this.inputID = '';
         }
         else {
           alert ("This user doesn't exist!");
           this.inputID = '';
           this.textInput = '';
           }
       },
       (err: any) => {
         alert(err.data);
       });
    }


/*    public getAuthTokenSimple() {
      this.auth_type = 'Token';
      this.backand.signin(this.username, this.password)
        .then((res: any) => {
          this.auth_status = 'OK';
          this.is_auth_error = false;
          this.loggedInUser = res.data.username;
          this.username = '';
          this.password = '';
        },
        (error: any) => {
          let errorMessage: string = error.data.error_description;
          this.auth_status = `Error: ${errorMessage}`;
          this.is_auth_error = true;
          this.auth_status = 'ERROR';
        }
      );
    }

    public useAnonymousAuth() {
      this.backand.useAnonymousAuth()
        .then((res: any) => {
          this.auth_status = 'OK';
          this.is_auth_error = false;
          this.loggedInUser = res.data.username;
        },
        (error: any) => {
          let errorMessage: string = error.data.error_description;
          this.auth_status = `Error: ${errorMessage}`;
          this.is_auth_error = true;
          this.auth_status = 'ERROR';
        });
    }

    public socialSignin(provider: string) {
      this.backand.socialSignin(provider)
        .then((res: any) => {
          this.auth_status = 'OK';
          this.is_auth_error = false;
          this.loggedInUser = res.data.username;
        },
        (error: any) => {
          let errorMessage: string = error.data.error_description;
          this.auth_status = `Error: ${errorMessage}`;
          this.is_auth_error = true;
          this.auth_status = 'ERROR';
        }
      );
    }

    public signOut() {
      this.auth_status = null;
      this.backand.signout();
    }


    public changePassword() {
      if (this.newPassword != this.confirmNewPassword){
        alert('Passwords should match');
        return;
      }
      this.backand.changePassword(this.oldPassword, this.newPassword)
        .then((res: any) => {
          alert('Password changed');
          this.oldPassword = this.newPassword = this.confirmNewPassword = '';
        },
        (err: any) => {
          alert(err.data)
        }
      );
    }
*/
  }
