import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PublicRacoService } from '../../providers/public-raco-service';
import { ScheduleAlgorithm } from '../../providers/schedule-algorithm';

@Component({
    selector: 'page-generator',
    templateUrl: 'generator.html',
    providers: [PublicRacoService, ScheduleAlgorithm]
})
export class GeneratorPage {
    subjects: string[];
    selectedSubjects: string[];
    filteredSelectSubjects: string[];
    filteredDeleteSubjects: string[];
    searchSelectSubjectString = '';
    searchDeleteSubjectString = '';

    computedSchedule: any[];
    hours: string[] = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", 
    "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"];
    days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    dataSubjects: any[];
    dataTimetables: any[];

    constructor(public navCtrl: NavController, private publicRacoService: PublicRacoService,
        private scheduleAlgorithm: ScheduleAlgorithm) {
        this.loadTimetableSubjects();
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
        subjectNames = subjectNames.filter((v) => {
            var isInSemester = subjectNamesSemester.indexOf(v) > -1;
            return isInSemester;
        })

        this.subjects = subjectNames;
        this.selectedSubjects = [];
        this.filteredSelectSubjects = this.subjects;
        this.filteredDeleteSubjects = this.selectedSubjects;
    }

    generateTimetable() {
        var timetables = this.dataTimetables.filter((v) => {
            var subjectIsSelected = this.selectedSubjects.indexOf(v.codi_assig) > -1;
            return subjectIsSelected;
        })

        this.scheduleAlgorithm.setData(timetables);
        this.computedSchedule = this.scheduleAlgorithm.calculateTimetable();
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

    hasClassOnTimetable(day: string, hour: string){
        var foundValidClass = false;
        if (this.computedSchedule != undefined){
            var currentStartNum = this.scheduleAlgorithm.translateHourString(hour.split(" -")[0]);
            var currentEndNum = this.scheduleAlgorithm.translateHourString(hour.split("- ")[1]);
            this.computedSchedule.forEach((item, index) => {
                if (foundValidClass == false){
                    var classDay = this.days[item["dia_setmana"] - 1];
                    var itemStartNum = this.scheduleAlgorithm.translateHourString(item["inici"]);
                    var itemEndNum = itemStartNum + item["durada"];

                    if (day == classDay && currentStartNum >= itemStartNum && currentEndNum <= itemEndNum){
                        foundValidClass = true;
                    }
                }
            });
        }
        return foundValidClass;
    }

    getClassOnTimetable(day: string, hour: string){
        var validClass;
        if (this.computedSchedule != undefined){
            var currentStartNum = this.scheduleAlgorithm.translateHourString(hour.split(" -")[0]);
            var currentEndNum = this.scheduleAlgorithm.translateHourString(hour.split("- ")[1]);
            this.computedSchedule.forEach((item, index) => {
                if (validClass == undefined){
                    var classDay = this.days[item["dia_setmana"] - 1];
                    var itemStartNum = this.scheduleAlgorithm.translateHourString(item["inici"]);
                    var itemEndNum = itemStartNum + item["durada"];

                    if (day == classDay && currentStartNum >= itemStartNum && currentEndNum <= itemEndNum){
                        validClass = item["codi_assig"] + " " + item["grup"];
                    }
                }
            });
        }
        return validClass;
    }
}
