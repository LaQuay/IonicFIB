import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

var CLIENT_ID = 'lM6FOOG62LliFSfxYbD3MqwxSDUR7JuEodgNFRX8';

@Injectable()
export class RacoService {
    data = [];

    constructor(private http: Http) {
        console.log('Hello RacoService Provider');
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
            this.http.get("https://api.fib.upc.edu/v2/assignatures/?format=json" + "&client_id=" + CLIENT_ID)
            .map(res => res.json())
            .subscribe(data => {
                this.data = data;
                resolve(this.data);
            });
        });
    }
}
