
import { Subject } from 'rxjs';

export interface IClockValue {
  seconds: number;
  minutes: number;
  hours: number;
}

export class Clock {
  public clockEventBus = new Subject<string>();
  private _hundredthsOfSeconds: number;
  private _seconds: number;
  private _minutes: number;
  private _hours: number;
  private _timerEndingDate: Date;
  private _timerRemainingTimeInMillisecond: number;
  private _isRunning = false;
  private _isStopped = true;
  private _timerInterval: NodeJS.Timer;
  private _timerRefreshRate = 75;
  private _initialClock: IClockValue;

  constructor(seconds: number = 0, minutes: number = 0, hours: number = 0) {
    const ms = seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000;
    this._timerEndingDate = this.msToTimerEndingDate(ms);
    this.updateClock();
    this._initialClock = { seconds, minutes, hours };
  }


  get hundredthsOfSeconds() {
    return this._hundredthsOfSeconds;
  }
  get seconds() {
    return this._seconds;
  }

  get minutes() {
    return this._minutes;
  }

  get hours() {
    return this._hours;
  }

  get timerEndingDate() {
    return this._timerEndingDate;
  }

  get isTimerAtZero() {
    return this._hundredthsOfSeconds + this._seconds + this._minutes + this._hours === 0;
  }

  get isRunning() {
    return this._isRunning;
  }

  get isStopped() {
    return this._isStopped;
  }

  public startTimer() {
    this._isRunning = true;
    this._isStopped = false;
    this._timerEndingDate = this.msToTimerEndingDate(this.getClockValuesInMilliSeconds());
    this.updateClock();
    this._timerInterval = setInterval(
      () => {
        if (new Date().getTime() < this._timerEndingDate.getTime()) {
          this.updateClock();
        }
        else {
          this.stopTimer();
          this.clockEventBus.next('clockReachedZero');
        }
      },
      this._timerRefreshRate
    );
  }

  public stopTimer() {
    clearInterval(this._timerInterval);
    this.setClockToZero();
    this._timerRemainingTimeInMillisecond = 0;
    this._isRunning = false;
    this._isStopped = true;
  }

  public pauseTimer() {
    clearInterval(this._timerInterval);
    this._isRunning = false;
  }

  public resetTimer(
    seconds: number = this._initialClock.seconds,
    minutes: number = this._initialClock.minutes,
    hours: number = this._initialClock.hours
  ) {
    this.stopTimer();
    this._seconds = seconds;
    this._minutes = minutes;
    this._hours = hours;
  }

  public addTimeToTimer(milliseconds: number) {
    this._timerEndingDate = this.msToTimerEndingDate(this.getClockValuesInMilliSeconds() + milliseconds);
    this.updateClock();
  }

  private msToTimerEndingDate(ms: number): Date {
    return new Date(new Date().getTime() + ms);
  }

  private getClockValuesInMilliSeconds(): number {
    return this._hundredthsOfSeconds * 10 + this._seconds * 1000 + this._minutes * 60 * 1000 + this._hours * 60 * 60 * 1000;
  }

  private getTimeRemainingInMilliSeconds(): number {
    return this._timerEndingDate.getTime() - new Date().getTime();
  }

  private updateClock() {
    this._timerRemainingTimeInMillisecond = this.getTimeRemainingInMilliSeconds();
    this._hundredthsOfSeconds = (Math.floor(this._timerRemainingTimeInMillisecond / 10) % 100);
    this._seconds = (Math.floor(this._timerRemainingTimeInMillisecond / 1000) % 60 * 1000) / 1000;
    this._minutes = Math.floor((this._timerRemainingTimeInMillisecond) / (1000 * 60) % 60);
    this._hours = Math.floor((this._timerRemainingTimeInMillisecond) / (1000 * 60 * 60));
  }

  private setClockToZero() {
    this._hundredthsOfSeconds = 0;
    this._seconds = 0;
    this._minutes = 0;
    this._hours = 0;
  }
}
