import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PublicRacoService } from '../../providers/public-raco-service';

@Component({
    selector: 'page-generator',
    templateUrl: 'generator.html',
    providers: [PublicRacoService]
})
export class GeneratorPage {
    subjects: string[];
    selectedSubjects: string[];
    filteredSelectSubjects: string[];
    filteredDeleteSubjects: string[];
    searchSelectSubjectString = '';
    searchDeleteSubjectString = '';

    dataSubjects: any[];
    dataTimetables: any[];

    constructor(public navCtrl: NavController, public publicRacoService: PublicRacoService) {
        this.loadTimetableSubjects();
        //this.loadSubjects();
    }

    loadTimetableSubjects() {
        this.publicRacoService.loadTimetableSubjects()
        .then(data => {
            console.log("Received timetables");
            this.dataTimetables = Object.keys(data).map(key => data[key]);

            this.loadSubjects();
        });
    }

    loadSubjects() {
        this.publicRacoService.loadSubjects()
        .then(data => {
            console.log("Received Subjects");
            this.dataSubjects = Object.keys(data).map(key => data[key]);
            this.initializeData();
        });
    }

    initializeData() {
        var subjectNamesSemester = this.dataTimetables.map(function(a) {return a.codi_assig;});
        var subjectNames = this.dataSubjects.map(function(a) {return a.sigles;});
        console.log(subjectNames.length);
        subjectNames = subjectNames.filter((v) => {
            var isInSemester = subjectNamesSemester.indexOf(v) > -1;
            return isInSemester;
        })
        console.log(subjectNames.length);

        this.subjects = subjectNames;
        this.selectedSubjects = [];
        this.filteredSelectSubjects = this.subjects;
        this.filteredDeleteSubjects = this.selectedSubjects;
    }

    generateTimetable() {
        console.log(this.selectedSubjects);

        var timetables = this.dataTimetables.filter((v) => {
            var subjectIsSelected = this.selectedSubjects.indexOf(v.codi_assig) > -1;
            return subjectIsSelected;
        })
        console.log(timetables);
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

        console.log(subject);
        console.log(this.selectedSubjects);
    }

    deleteSubject(subject: string) {
        var index = this.selectedSubjects.indexOf(subject, 0);
        if (index > -1) {
            this.selectedSubjects.splice(index, 1);
        }

        this.filteredSelectSubjects.push(subject);
    }

}
