import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { RacoService } from '../../providers/raco-service';

@Component({
    selector: 'page-generator',
    templateUrl: 'generator.html',
    providers: [RacoService]
})
export class GeneratorPage {
    subjects: string[];
    selectedSubjects: string[];
    filteredSelectSubjects: string[];
    filteredDeleteSubjects: string[];
    searchSelectSubjectString = '';
    searchDeleteSubjectString = '';

    public people: any;
    items : any;

    constructor(public navCtrl: NavController, public racoService: RacoService) {
        this.subjects = [ 'AC', 'BD' ];
        this.selectedSubjects = [];
        this.filteredSelectSubjects = this.subjects;
        this.filteredDeleteSubjects = this.selectedSubjects;

        this.loadSubjects();
    }

    loadSubjects(){
        this.racoService.load()
        .then(data => {
            this.people = data;
            console.log("Received data");
        });
    }

    generateTimetable() {
        console.log(this.people);
    }

    searchSelectSubjects(searchbar) {
        this.filteredSelectSubjects = this.subjects.filter((v) => {
            var isSelected = this.selectedSubjects.indexOf(v) > -1;
            return !isSelected;
        })

        // set q to the value of the searchbar
        var q = searchbar.target.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.filteredSelectSubjects = this.filteredSelectSubjects.filter((v) => {
            if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }

    searchDeleteSubjects(searchbar) {
        this.filteredDeleteSubjects = this.selectedSubjects;

        // set q to the value of the searchbar
        var q = searchbar.target.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.filteredDeleteSubjects = this.filteredDeleteSubjects.filter((v) => {
            if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }

    selectSubject(subject: string) {
        this.selectedSubjects.push(subject);

        this.filteredSelectSubjects = this.filteredSelectSubjects.filter((v) => {
            var isSelected = this.selectedSubjects.indexOf(v) > -1;
            return !isSelected;
        })
    }

    deleteSubject(subject: string) {
        var index = this.selectedSubjects.indexOf(subject, 0);
        if (index > -1) {
            this.selectedSubjects.splice(index, 1);
        }

        this.filteredSelectSubjects.push(subject);
    }

}
