import { Injectable } from '@angular/core';
import { HTTP } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';

declare var window: any;
declare var JSO: any;

var BASE_URL: string="https://api.fib.upc.edu/v2/o/";
var AUTH_URL: string="authorize/";
var CODE_URL: string="token/";
var CLIENT_PARAM: string="client_id="; 
var CLIENT_ID: string="lM6FOOG62LliFSfxYbD3MqwxSDUR7JuEodgNFRX8";
var CLIENT_SECRET_PARAM: string="client_secret="; 
var CLIENT_SECRET_ID: string="3SprqSpnD2hF7XdUdfAseDS8e3YDHQYcSnciW3F3VxU3SDz1jI4qFUidEZZTJoe3KIpIR1epJ17rMHsT36xX19YIQYTZTNtuZmS0LurQ5QZayBSGweJ1WfoNGF5mStsn";
var REDIRECT_PARAM: string="redirect_uri=";
var REDIRECT_URI: string="http://localhost/callback";
var RANDOM_STRING: string="fast_parrot";

var USE_AUTH_TOKEN_HARDCODED: boolean=true;
var AUTH_TOKEN_HARDCODED: string="L0eeH5P4CWCKrn8S8LDAeSBhe5lZnP";

@Injectable()
export class AuthService {
  currentToken: string;
  
  public login(): Promise<any> {
    var self = this;
    return new Promise(function(resolve, reject) {
      //IF ANDROID OR IOS
      if (window.cordova != undefined){
        var browserRefExitFunc = function(event) {
          console.log("The sign-in flow was canceled");
          reject("The sign-in flow was canceled");
        };
        var url_OAUTH_CODE = BASE_URL + AUTH_URL + "?" + CLIENT_PARAM + CLIENT_ID + "&" + REDIRECT_PARAM + REDIRECT_URI + "&response_type=code&state=" + RANDOM_STRING;
        console.log('URL OAUTH_CODE: ' + url_OAUTH_CODE);
        //GETTING THE AUTH CODE
        var browserRef = window.cordova.InAppBrowser.open(url_OAUTH_CODE, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
        browserRef.addEventListener("loadstart", (event) => {
          if ((event.url).indexOf(REDIRECT_URI) === 0) {
            //RECEIVING THE AUTH CODE
            var code = (event.url).split("code=")[1];
            console.log("Code: " + code);
            browserRef.removeEventListener("exit", browserRefExitFunc);
            browserRef.close();

            var url_OAUTH_AUTH = BASE_URL + CODE_URL + "?" + CLIENT_PARAM + CLIENT_ID + "&" + CLIENT_SECRET_PARAM + CLIENT_SECRET_ID + "&grant_type=authorization_code&code=" + code + "&" + REDIRECT_PARAM + REDIRECT_URI;
            console.log('URL OAUTH_AUTH: ' + url_OAUTH_AUTH);
            HTTP.post(url_OAUTH_AUTH, {}, {})
            .then(data => {
              console.log("Response OK");
              console.log(data.status);
              console.log(data.data); // data received by server
              console.log(data.headers);
              var response = JSON.parse(data.data);
              self.setCurrentToken(response.access_token);
              resolve();
            })
            .catch(error => {
              console.log("Response Fail");
              console.log(error.status);
              console.log(error.error);
              console.log(error.headers);
            });
          }
        });
        browserRef.addEventListener("exit", browserRefExitFunc);
      } else {
        //TODO OAUTH for PC
        //https://github.com/andreassolberg/jso
        //https://forum.ionicframework.com/t/how-to-implement-google-oauth-in-an-ionic-2-app/47038/4
        //https://github.com/myurasov/Salesforce-REST-API-Ionic-Framework-App-Sample
      }
    });
  }
  
  public logout(): Promise<any> {
    return new Promise(function(resolve, reject) {
      window.localStorage.removeItem('access_token');   
      resolve();
    });
  }

  public setCurrentToken(access_token) {
    console.log("Saving token: " + access_token);
    window.localStorage.setItem('access_token', access_token);    
  }

  public getCurrentToken() {
    var access_token = window.localStorage.getItem('access_token');
    if (USE_AUTH_TOKEN_HARDCODED){
      access_token = AUTH_TOKEN_HARDCODED;
    }
    console.log("Loading token: " + access_token);
    return access_token;    
  }

  public useAuthHardcoded() {
    return USE_AUTH_TOKEN_HARDCODED;
  }
}