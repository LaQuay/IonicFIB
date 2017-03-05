import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PrivateRacoService } from '../../providers/private-raco-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AuthService, PrivateRacoService]
})

export class HomePage {
  isUserLogged: boolean;
  username: string;
  name: string;
  surname: string;
  email: string;
  photo_url: string;
  classesResult: any;

  constructor(public navCtrl: NavController, public authService: AuthService, public privateRacoService: PrivateRacoService, private platform: Platform) {
    this.isUserLogged = false;

    this.classesResult = [];

    //Test only
    this.isUserLogged = this.authService.useAuthHardcoded();
    //

    if (this.isUserLogged){
      this.loadUserData();
    }
  }

  public login() {
    this.platform.ready().then(() => {
      this.authService.login().then(success => {
        alert("Log in successfully! :)");
        this.isUserLogged = true;
        this.loadUserData();
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

  public loadUserData(){
    this.loadUserImage();
    this.getUserClasses();
    this.privateRacoService.getUserData().then(success => {
      console.log(success);
      this.username = success["username"];
      this.name = success["nom"];
      this.surname = success["cognoms"];
      this.email = success["email"];
    }, (error) => {
      console.log(error);
    });
  }

  public loadUserImage(){
    this.privateRacoService.getUserImage().then(success => {
      console.log(success);
      this.photo_url = success["foto"];
    }, (error) => {
      console.log(error);
    });
  }

  public getUserClasses(){
    this.privateRacoService.getUserClasses().then(success => {
      console.log(success);
      this.classesResult = success["results"];
      console.log(this.classesResult);
    }, (error) => {
      console.log(error);
    });
  }

  public getTodayClasses(){
    var todayClasses: any[] = [];

    var day = new Date();
    var currentDay = 1; //day.getDay(); //TODO Remove comment in production

    this.classesResult.forEach((item, index) => {
      var itemClaseDia = item["dia_setmana"];
      if (currentDay == itemClaseDia){
        todayClasses.push(item);
      }
    });

    //TODO Sort

    return todayClasses;
  }
}
