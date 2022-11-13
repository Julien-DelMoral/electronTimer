import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ElectronService } from '../core/services';

import { Clock } from '../shared/models/clock';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  /*Clock*/
  clock: Clock;
  
  /*Form*/
  selectedHour = 0;
  selectedMinute = 0;
  selectedSecond = 0;
  hours: number[] = Array(25).fill(1).map((x, i) => i);
  minutes: number[] = Array(61).fill(1).map((x, i) => i);
  seconds: number[] = Array(61).fill(1).map((x, i) => i);


  constructor(private electronService: ElectronService) {
  }


  ngOnInit() {
    this.clock = new Clock(0,30,1);
  }

  
  startCountdown() {
    this.clock.startTimer();
  }

  resetCountdown() {
    this.clock.resetTimer();
  }

  stopCountdown() {
   this.clock.stopTimer();
  }

  pauseCountdown() {
    this.clock.pauseTimer();
  }

  addTimeToClock() {
    const selectedHourInMilliseconds = this.selectedHour * 60 * 60 * 1000;
    const selectedMinuteInMilliseconds = this.selectedMinute * 60 * 1000;
    const selectedSecondInMilliseconds = this.selectedSecond * 1000;
    this.clock.addTimeToTimer(selectedHourInMilliseconds + selectedMinuteInMilliseconds + selectedSecondInMilliseconds)
  }

  replaceClockTime() {
    this.clock.resetTimer(this.selectedSecond, this.selectedMinute, this.selectedHour)
  }

  formatClockNumberToText(n:number): string{
    return String(n).padStart(2, '0');
 }
}
