import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
    providers: [AuthService]
})

export class HomePage {
  isUserLogged: boolean;

  constructor(public navCtrl: NavController, public authService: AuthService, private platform: Platform) {
    this.isUserLogged = false;
  }

  public login() {
    this.platform.ready().then(() => {
        this.authService.login().then(success => {
            alert("Log in successfully! :)");
            this.isUserLogged = true;
        }, (error) => {
            alert("Error, not logged in :(");
            this.isUserLogged = false;
        });
    });
  }

  public logout(){
    console.log("log out click");
    this.platform.ready().then(() => {
        this.authService.logout().then(success => {
          this.isUserLogged = false;
        }, (error) => {
        });
    });
  }
}
