import {Component, Input, OnInit} from '@angular/core';
import {SchedulesService} from '../../../services/schedule/schedules.service';
import {Group} from '../../models';



@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
    @Input() currentGroup: Group;
    @Input() participants: any;

    groupId = 1;
    months = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];
    date = new Date();
    currentMonth = (this.date.getMonth() + 1).toString();
    year = (this.date.getFullYear()).toString();
    month = this.months[(this.date.getMonth())];
    day = (this.date.getDate()).toString();
    weeks = [];
    override = false;
    ready = false;
    calendarEvents = [];
    eventColors = ['#0087e4', '#0096fe', '#3badfc', '#59d4ff', '#9debff']
    constructor(private scheduleService: SchedulesService) {
    }

    ngOnInit() {
        this.createCalendar(parseInt(this.year, 10), parseInt(this.currentMonth, 10) - 1);
    }

    changeMonth() {
        let newMonth = parseInt(this.currentMonth, 10);
        newMonth += 1;
        if (newMonth > 12) {
            newMonth = 1;
        }
        this.month = this.months[newMonth - 1];
        this.currentMonth = newMonth.toString();
        this.weeks = [];
        this.createCalendar(parseInt(this.year, 10), parseInt(this.currentMonth, 10) - 1);
    }

    createCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const firstWeekDay = firstDay.getDay();
        const lastDay = new Date(year, month + 1, 0);
        const lastDate = lastDay.getDate();
        const weeksInMonth = this.getWeeks(year, month, firstDay, lastDay);
        let weekToAdd = [];
        let dayValue = 1;
        let holdDayValue = 0;

        for (let i = 0; i <= weeksInMonth; i++) {
            weekToAdd = [];
            if (i === 0) {
                for (let j = 0; j < 7; j++) {
                    if (j < firstWeekDay) {
                        weekToAdd.push('');
                    } else {
                        weekToAdd.push({day: dayValue, schedule: [], weekDay: (new Date(year, month, dayValue)).getDay().toString()});
                        dayValue += 1;
                    }
                }
                holdDayValue = dayValue;
            } else {
                for (let j = 0; j < 7; j++) {
                    if (holdDayValue > (i * 7)) {
                        if ((dayValue + (i * 7)) <= lastDate) {
                            weekToAdd.push({day: dayValue + (i * 7), schedule: [], weekDay: (new Date(year, month, dayValue + (i * 7))).getDay().toString()});
                        } else {
                            weekToAdd.push('');
                        }
                        holdDayValue += 1;
                        dayValue += 1;
                    } else {
                        if (holdDayValue <= lastDate) {
                            weekToAdd.push({day: holdDayValue, schedule: [], weekDay: (new Date(year, month, holdDayValue)).getDay().toString()});
                            holdDayValue++;
                        } else {
                            weekToAdd.push('');
                        }
                    }
                }
            }
            if (weekToAdd[0] !== '' || weekToAdd[6] !== '') {
                this.weeks.push(weekToAdd);
            }
            dayValue = 1;
        }
        console.log(this.weeks);
    }

    getWeeks(year, month, firstOfMonth, lastOfMonth) {

        const lastDate = lastOfMonth.getDate();

        let day = firstOfMonth.getDay() || 6;
        day = day === 1 ? 0 : day;
        if (day) {
            day -= 1;
        }

        let diff = 7 - day;
        if (lastOfMonth.getDay() === 1) {
            diff -= 1;
        }

        const result = Math.ceil((lastDate - diff) / 7);
        return result + 1;
    }
}
