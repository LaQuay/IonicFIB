import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

var API_RACO_URL = 'https://api.fib.upc.edu/v2';
var SUBJECT_ID = 'assignatures';
var SEMESTER_ID = 'quadrimestres';
var CLASS_ID = 'classes';

var CLIENT_ID = 'lM6FOOG62LliFSfxYbD3MqwxSDUR7JuEodgNFRX8';
var JSON_FORMAT = 'format=json'

@Injectable()
export class PublicRacoService {
    dataSubjects = [];
    dataTimetables = [];

    constructor(private http: Http) {
        console.log('Hello PublicRacoService Provider');
    }

    loadSubjects() {
        if (this.dataSubjects) {
            // already loaded data
            //return Promise.resolve(this.data);
        }

        // don't have the data yet
        return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.get(API_RACO_URL + '/' + SUBJECT_ID + '/?' + JSON_FORMAT + '&' + 'client_id=' + CLIENT_ID)
            .map(res => res.json())
            .subscribe(data => {
                this.dataSubjects = data.results;
                resolve(this.dataSubjects);
            });
        });
    }

    loadTimetableSubjects() {
        return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.get(API_RACO_URL + '/' + SEMESTER_ID + '/?' + JSON_FORMAT + '&' + 'client_id=' + CLIENT_ID)
            .map(res => res.json())
            .subscribe(data => {
                var semesterIDs = (data.results).map(function(a) {return a.id;});
                semesterIDs.sort(function(id1, id2){
                    return id1 < id2;
                });
                var lastSemesterID = semesterIDs[0];

                resolve(this.loadSemesterTimetableSubjects(lastSemesterID));
            });
        });
    }

    loadSemesterTimetableSubjects(semesterID: string) {
        return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.get(API_RACO_URL + '/' + SEMESTER_ID + '/' + semesterID + '/' + CLASS_ID
                + '/?' + JSON_FORMAT + '&' + 'client_id=' + CLIENT_ID)
            .map(res => res.json())
            .subscribe(data => {
                this.dataTimetables = data.results;
                resolve(this.dataTimetables);
            });
        })
    }
}
