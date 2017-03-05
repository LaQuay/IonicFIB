import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

var TOO_MANY_HOURS_PENALTY = 60;
var DEAD_HOUR_PENALTY = 1;
var LARGE_DAY_PENALTY = 30;
var SUBJECT_NOT_CHOSEN = 1000;

var OVERLAPPING_PENALTY = Infinity;
var INVALID_SOLUTION = Infinity;

@Injectable()
export class ScheduleAlgorithm {
    subjecTimetable: any[];
    nClasses: number;

    resultTimeTable: any[];
    resultScore: number;

    constructor() {
        console.log('Hello ScheduleAlgorithm Provider');
    }

    setData(timetable) {
        this.subjecTimetable = timetable;
        this.nClasses = this.subjecTimetable.length;

        this.resultTimeTable = [];
        this.resultScore = INVALID_SOLUTION;
    }

    calculateTimetable() {
        var result = new Array(this.nClasses).fill(false);
        this.calculateTimetableRec(result, 0);
        console.log(this.translateTimetableResult(this.resultTimeTable));
        console.log("Score: " + this.resultScore);

        return this.translateTimetableResult(this.resultTimeTable);
    }

    calculateTimetableRec(result, i) {
        if (i == this.nClasses) {
            var score = this.calculateScoreTimetable(result);
            if (score < this.resultScore) {
                this.resultScore = score;

                this.resultTimeTable = [];
                for (var j = 0; j < result.length; ++j) {
                    this.resultTimeTable[j] = result[j];
                }
            }
        }
        else {
            result[i] = true; this.calculateTimetableRec(result, i+1);
            result[i] = false; this.calculateTimetableRec(result, i+1);
        }
    }

    calculateScoreTimetable(result) {
        var score = 0;

        var maxDays = 5;
        var hourInit = 8;
        var hourEnd = 21;
        var intervalsPerHour = 2;
        var timetableIntervals = [];
        for(var i: number = 0; i < maxDays; i++) {
            timetableIntervals[i] = [];
            for(var j: number = 0; j < (hourEnd-hourInit)*intervalsPerHour; j++) {
                timetableIntervals[i][j] = false;
            }
        }


        var resultSubjects = [];
        var allSubjects = [];

        var resultSubjectsGroups = [];
        var allSubjectsGroups = [];

        for (var i = 0; i< this.nClasses; ++i) {
            var subjectName = this.subjecTimetable[i].codi_assig;
            var group = this.subjecTimetable[i].grup;
            var type = this.subjecTimetable[i].tipus;

            // Student timetable must have all classes of Theory and all classes of Lab
            var subjectNameType = subjectName + type;

            // For simplify, Lab+Prob must be the same group
            if (type === 'P') type = 'L';
            group = group + type;

            if (!result[i]) { // If subject is not chosen
                // If the group of the subject was chosen, the solution is invalid
                if (this.subjectGroupInArray(resultSubjectsGroups, subjectNameType, group))
                    return INVALID_SOLUTION;
            }
            else { // If subject is chosen
                // Another class of the subject was not chosen
                if (this.subjectGroupInArray(allSubjectsGroups, subjectNameType, group) &&
                    !this.subjectGroupInArray(resultSubjectsGroups, subjectNameType, group)) 
                    return INVALID_SOLUTION;

                // If another group of the same subject was chosen
                var groupsSubj = resultSubjectsGroups.filter((v) => {
                    return v.codi_assig === subjectNameType;
                }).map(function(a) {return a.grup;});
                if (groupsSubj.length > 0 && groupsSubj.indexOf(group) === -1) return INVALID_SOLUTION;

                // All subject names of the solution
                if (resultSubjects.indexOf(subjectNameType) === -1) resultSubjects.push(subjectNameType);
                if (!this.subjectGroupInArray(resultSubjectsGroups, subjectNameType, group))
                    resultSubjectsGroups.push({
                        codi_assig: subjectNameType,
                        grup: group
                    });

                var dia = this.subjecTimetable[i].dia_setmana;
                var inici = this.translateHourString(this.subjecTimetable[i].inici);
                var durada = this.subjecTimetable[i].durada;

                var intervalInit = (inici - hourInit) * intervalsPerHour;
                var intervals = durada * intervalsPerHour;

                for (var j = 0; j < intervals; ++j) {
                    var int = intervalInit + j;
                    if (timetableIntervals[dia-1][int]) score += OVERLAPPING_PENALTY;
                    timetableIntervals[dia-1][int] = true;
                }
            }

            // All subject names
            if (allSubjects.indexOf(subjectNameType) === -1) allSubjects.push(subjectNameType);
            if (!this.subjectGroupInArray(allSubjectsGroups, subjectNameType, group))
                allSubjectsGroups.push({codi_assig: subjectNameType, grup: group});
        }

        var nSubjectsNotChosen = allSubjects.length - resultSubjects.length;
        score += nSubjectsNotChosen * SUBJECT_NOT_CHOSEN;

        /* Penalties:
            * more than 6h / day
            * dead hours between classes
            * morning and afternoon classes
            */
            for (var i = 0; i < timetableIntervals.length; ++i) {
                var firstHour = -1;
                var lastHour = -1;
                var sumHoursDay = 0;
                for (var j = 0; j < timetableIntervals[i].length; ++j) {
                    if (timetableIntervals[i][j]) {
                        var hour = hourInit + (j / intervalsPerHour);
                        if (lastHour !== -1) {
                            if ((hour-lastHour) > 0.5) score += DEAD_HOUR_PENALTY;
                        }
                        if (firstHour === -1) firstHour = hour;
                        lastHour = hour;
                        sumHoursDay += 1.0 / intervalsPerHour;
                    }
                }
                if (sumHoursDay >= 6) score += TOO_MANY_HOURS_PENALTY;
                if (sumHoursDay > 0 && lastHour > 16 && firstHour < 12)  score += LARGE_DAY_PENALTY;
            }

            return score;
        }

        translateTimetableResult(result) {
            var timetable = [];
            for (var i = 0; i < this.nClasses; ++i) {
                if (result[i]) {
                    timetable.push({
                        codi_assig: this.subjecTimetable[i].codi_assig,
                        dia_setmana: this.subjecTimetable[i].dia_setmana,
                        inici: this.subjecTimetable[i].inici,
                        iniciHour: this.translateHourString(this.subjecTimetable[i].inici),
                        durada: this.subjecTimetable[i].durada,
                        grup: (this.subjecTimetable[i].grup + this.subjecTimetable[i].tipus),
                    });
                }
            }
            return timetable;
        }

        translateHourString(hm) {
            var a = hm.split(':');

            var hour = (+a[0]) + (+a[1]/2);
            return hour;
        }

        subjectGroupInArray(array, name, group) {
            var subset = array.filter((v) => {
                return v.codi_assig === name && v.grup === group;
            });
            return subset.length > 0;
        }
    }
