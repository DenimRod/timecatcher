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
  public textInput:string = '';
  userInput:string = '';
  public items:any[] = [];


  constructor(private backand: BackandService, public navCtrl: NavController, public globVars: GlobalVars, public plt: Platform) {
/*    this.backand.user.getUserDetails().then(
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
  if (this.plt.is('core')) {
      // This will only print when on Desktop
      alert("Zeiterfassung läuft auf Desktop-PC!")
  }
  else alert("Zeiterfassung läuft auf Handy!");
//  alert("platforms:"(this.plt.platforms()));
//crazy workaround for no login
this.userInput = "2";
this.checkUser("2");

}

  public handleOrder(){
//    alert(this.textInput);
    this.textInput = '';
  }

  public checkUser(inputNumber:string){
    this.userInput += inputNumber;
    this.textInput += inputNumber;

    if (this.userInput.length == 2){
      let params = {
        filter: [
          this.backand.helpers.filter.create('password', this.backand.helpers.filter.operators.text.equals, this.userInput),
        ],
      }

      this.backand.object.getList('Users', params)
       .then((res: any) => {
         this.items = res.data;

         if (this.items.length > 0) {
           this.globVars.globCurrUser = this.items[0];

          if (this.globVars.globCurrUser.applevel == "pro"){
            this.navCtrl.push(TabsProPage);
          }
          else {
            this.navCtrl.push(TabsPage);
          }

            this.userInput = '';
         }
         else {
           alert ("This user doesn't exist!");
           this.userInput = '';
           this.textInput='';
         }
       },
       (err: any) => {
         alert(err.data);
       });
    }
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
