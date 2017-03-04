import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

var API_RACO_URL = 'https://api.fib.upc.edu/v2';
var CLIENT_ID = 'lM6FOOG62LliFSfxYbD3MqwxSDUR7JuEodgNFRX8';

@Injectable()
export class PublicRacoService {
    data = [];

    constructor(private http: Http) {
        console.log('Hello PublicRacoService Provider');
    }

    load() {
        if (this.data) {
            // already loaded data
            //return Promise.resolve(this.data);
        }

        // don't have the data yet
        return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.get(API_RACO_URL + "/assignatures/?format=json" + "&client_id=" + CLIENT_ID)
            .map(res => res.json())
            .subscribe(data => {
                this.data = data.results;
                resolve(this.data);
            });
        });
    }
}
