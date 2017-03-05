import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

declare var window: any;

@Injectable()
export class PrivateRacoService {

  constructor(public http: Http) {

  }

  public getUserData() {
    console.log("Getting user data");

    var self = this;

    return new Promise(function(resolve, reject) {
	    var URL = "https://api.fib.upc.edu/v2/jo/";
	  	var access_token = window.localStorage.getItem('access_token');
	  	var headers = new Headers();
	    headers.append('Authorization', 'Bearer ' + access_token);
	    headers.append('Accept', 'application/json');

	    console.log("Access Token: " + access_token);

		self.http.get(URL, {"headers": headers})
	            .map(res => res.json())
	            .subscribe(data => {
	                resolve(data);
	            });
    });				
  }

  public getUserImage() {
    console.log("Getting user photo");

    var self = this;

    return new Promise(function(resolve, reject) {
	    var URL = "https://api.fib.upc.edu/v2/jo/foto/";
	  	var access_token = window.localStorage.getItem('access_token');
	  	var headers = new Headers();
	    headers.append('Authorization', 'Bearer ' + access_token);
	    headers.append('Accept', 'application/json');

		self.http.get(URL, {"headers": headers})
	            .map(res => res.json())
	            .subscribe(data => {
	                resolve(data);
	            });
    });				
  }

  public getUserClasses() {
    console.log("Getting user classes");

    var self = this;

    return new Promise(function(resolve, reject) {
	    var URL = "https://api.fib.upc.edu/v2/jo/classes/";
	  	var access_token = window.localStorage.getItem('access_token');
	  	var headers = new Headers();
	    headers.append('Authorization', 'Bearer ' + access_token);
	    headers.append('Accept', 'application/json');

		self.http.get(URL, {"headers": headers})
	            .map(res => res.json())
	            .subscribe(data => {
	                resolve(data);
	            });
    });				
  }

  public getUserAlerts() {
    console.log("Getting user alerts");

    var self = this;

    return new Promise(function(resolve, reject) {
	    var URL = "https://api.fib.upc.edu/v2/jo/avisos/";
	  	var access_token = window.localStorage.getItem('access_token');
	  	var headers = new Headers();
	    headers.append('Authorization', 'Bearer ' + access_token);
	    headers.append('Accept', 'application/json');

		self.http.get(URL, {"headers": headers})
	            .map(res => res.json())
	            .subscribe(data => {
	                resolve(data);
	            });
    });				
  }
}
