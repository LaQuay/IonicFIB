import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HTTP } from 'ionic-native';
import { Http, Headers } from '@angular/http';
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

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, private platform: Platform, private http: Http) {

  }

  public askMyInfo() {
  	var URL = "https://api.fib.upc.edu/v2/jo/";
  	var access_token = window.localStorage.getItem('access_token');
  	var headers = "Authorization:Bearer vGCKMRe2E63GN5n8a2Ngvy77Rb42KM";
  	console.log("askMyInfo() - URL " + URL);
  	console.log("askMyInfo() - HEADERS " + headers);
    /*HTTP.get(URL, {}, headers)
	  .then(data => {
	  	console.log("OK");
	    console.log(data.status);
	    console.log(data.data); // data received by server
	    console.log(data.headers);
	  })
	  .catch(error => {
	  	console.log("FAIL");
	    console.log(error.status);
	    console.log(error.error); // error message as string
	    console.log(error.headers);
	  });*/

	  this.testJo()
        .then(data => {
            console.log("Received data");
            console.log(data);
        });

  }

  public testJo(){
  	var URL = "https://api.fib.upc.edu/v2/jo/";
  	var access_token = window.localStorage.getItem('access_token');

  	var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + access_token);
    headers.append('Accept', 'application/json');
  	return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.get(URL, {"headers": headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
  }

  public login() {
    this.platform.ready().then(() => {
        this.fibRacoLogin().then(success => {
            alert(success.access_token);
        }, (error) => {
            alert(error);
        });
    });
  }
 
  public fibRacoLogin(): Promise<any> {
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
	                /*var responseParameters = ((event.url).split("#")[1]).split("&");
	                var parsedResponse = {};
	                for (var i = 0; i < responseParameters.length; i++) {
	                    parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
	                }
	                if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
	                    resolve(parsedResponse);
	                } else {
	                    reject("Problem authenticating");
	                }*/

	                var url_OAUTH_AUTH = BASE_URL + CODE_URL + "?" + CLIENT_PARAM + CLIENT_ID + "&" + CLIENT_SECRET_PARAM + CLIENT_SECRET_ID + "&grant_type=authorization_code&code=" + code + "&" + REDIRECT_PARAM + REDIRECT_URI;
					console.log('URL OAUTH_AUTH: ' + url_OAUTH_AUTH);
	                HTTP.post(url_OAUTH_AUTH, {}, {})
					  .then(data => {
					    console.log(data.status);
					    console.log(data.data); // data received by server
					    console.log(data.headers);
					    var response = JSON.parse(data.data);
					    var access_token = response.access_token;
					    console.log("Access token: " + access_token);
					    window.localStorage.setItem('access_token', access_token);
					  })
					  .catch(error => {
					    console.log(error.status);
					    console.log(error.error); // error message as string
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
	        var jso = new JSO({
		        providerID: "fibRaco",
		        client_id: CLIENT_ID,
		        redirect_uri: REDIRECT_URI,
	       		authorization: AUTH_URL,
		    });

		    jso.callback();

		    jso.getToken(function(token) {
		       console.log("I got the token: " + token);
		       console.log("Access token string itself:" + token.access_token);
		    });
        }
    });
  }
}
