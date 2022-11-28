import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { Clock } from '../shared/models/clock';
import { ClockService } from '../shared/services/clock.service';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  /*Clock*/
  clock: Clock;

  /*Form*/
  selectedHour: number;
  selectedMinute: number;
  selectedSecond: number;
  hours: number[] = Array(24).fill(1).map((x, i) => i + 1);
  minutes: number[] = Array(60).fill(1).map((x, i) => i + 1);
  seconds: number[] = Array(60).fill(1).map((x, i) => i + 1);

  constructor(private electronService: ElectronService, private clockService: ClockService) {
  }

  ngOnInit() {
    this.clock = this.clockService.clock;
    this.clock.clockEventBus.subscribe((event)=>{
      if(event === 'clockReachedZero'){
        if (this.electronService) {
          this.electronService.ipcRenderer.send('notify', {
              title: 'Time\'s up !', message: 'You should know what to do next ;)'
          });
      }
      }
    });
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
    const selectedHourInMilliseconds = this.selectedHour ? this.selectedHour * 60 * 60 * 1000 : 0;
    const selectedMinuteInMilliseconds = this.selectedMinute ? this.selectedMinute * 60 * 1000 : 0;
    const selectedSecondInMilliseconds = this.selectedSecond ? this.selectedSecond * 1000 : 0;
    this.clock.addTimeToTimer(selectedHourInMilliseconds + selectedMinuteInMilliseconds + selectedSecondInMilliseconds);
  }

  replaceClockTime() {
    this.clock.resetTimer(
      this.selectedSecond ? this.selectedSecond : 0,
      this.selectedMinute ? this.selectedMinute : 0,
      this.selectedHour ? this.selectedHour : 0
    );
  }

  formatClockNumberToText(n: number): string {
    return String(n).padStart(2, '0');
  }

  isFormEmpty(): boolean {
    if (!this.selectedHour && !this.selectedMinute && !this.selectedSecond) {
      return true;
    }
    return false;
  }
}
