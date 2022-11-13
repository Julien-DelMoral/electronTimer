import { ElectronService } from '../../core/services';

export interface IClockValue{
    seconds: number,
    minutes: number,
    hours:number
}

export class Clock {
    private _hundredthsOfSeconds: number;
    private _seconds: number;
    private _minutes: number;
    private _hours: number;
    private _timerEndingDate: Date;
    private _timerRemainingTimeInMillisecond: number
    private _isRunning: boolean;
    private _isStopped: boolean;
    private _timerInterval: NodeJS.Timer;
    private _timerRefreshRate: number = 75;
    private _electronService: ElectronService;
    private _initialClock: IClockValue;

    constructor(seconds: number = 0, minutes: number = 0, hours: number = 0) {
        const ms = seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000;
        this._hundredthsOfSeconds = (Math.floor(ms/10)%100)
        this._seconds = (Math.floor(ms/1000)% 60 * 1000)/1000;
        this._minutes = Math.floor((ms) / (1000 * 60) % 60);
        this._hours = Math.floor((ms) / (1000 * 60 * 60));
        this._timerRemainingTimeInMillisecond = ms;
        this._isRunning = false;
        this._isStopped = true;
        this._initialClock = {seconds: seconds, minutes: minutes, hours: hours};
        this._electronService = new ElectronService;
    }


    get hundredthsOfSeconds() {
        return this._hundredthsOfSeconds
    }
    get seconds() {
        return this._seconds
    }

    get minutes() {
        return this._minutes
    }

    get hours() {
        return this._hours
    }

    get timerEndingDate() {
        return this._timerEndingDate
    }

    get isRunning() {
        return this._isRunning
    }

    get isStopped() {
        return this._isStopped
    }

    private clockToTimerEndingDate(): Date {
        let ms = this._hundredthsOfSeconds * 10 + this._seconds * 1000 + this._minutes * 60 * 1000 + this._hours * 60 * 60 * 1000;
        return new Date(new Date().getTime() + ms);
    }

    private getTimeRemainingInMilliSeconds(): number {
        return this._timerEndingDate.getTime() - new Date().getTime();
    }

    private updateClock() {
        this._timerRemainingTimeInMillisecond = this.getTimeRemainingInMilliSeconds();
        this._hundredthsOfSeconds = (Math.floor(this._timerRemainingTimeInMillisecond/10)%100);
        this._seconds = (Math.floor(this._timerRemainingTimeInMillisecond/1000)% 60 * 1000)/1000;
        this._minutes = Math.floor((this._timerRemainingTimeInMillisecond) / (1000 * 60) % 60);
        this._hours = Math.floor((this._timerRemainingTimeInMillisecond) / (1000 * 60 * 60));
    }

    private setClockToZero() {
        this._hundredthsOfSeconds = 0;
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
    }

    public startTimer() {
        this._isRunning = true;
        this._isStopped = false;
        this._timerEndingDate = this.clockToTimerEndingDate();
        this.updateClock();
        this._timerInterval = setInterval(
            () => {
                if (new Date().getTime() < this._timerEndingDate.getTime()) {
                    this.updateClock();
                }
                else {
                    this.stopTimer();
                    if (this._electronService.isElectron) {
                        this._electronService.ipcRenderer.send('notify', {
                            title: 'Time\'s up !', message: 'You should know what to do next ;)'
                        });
                    }
                }
            },
            this._timerRefreshRate
        );
        
        console.log(this._hours+':'+this._minutes+':'+this._seconds);
        console.log(this._timerEndingDate)
        console.log(this._timerRemainingTimeInMillisecond)
        console.log('----- end start timer-----');
    }

    public stopTimer() {
        clearInterval(this._timerInterval);
        this.setClockToZero();
        this._timerRemainingTimeInMillisecond = 0;
        this._isRunning = false;
        this._isStopped = true;
    }

    public pauseTimer() {
        console.log('-----pause timer-----')
        console.log(this._hours+':'+this._minutes+':'+this._seconds)
        console.log(this._timerEndingDate)
        console.log(this._timerRemainingTimeInMillisecond)
        clearInterval(this._timerInterval);
        this._isRunning = false;
        console.log(this._hours+':'+this._minutes+':'+this._seconds);
        console.log(this._timerEndingDate)
        console.log(this._timerRemainingTimeInMillisecond)
        console.log('----- end pause timer-----');
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
        this._timerEndingDate = new Date(this.clockToTimerEndingDate().getTime() + milliseconds);
        this.updateClock();
    }

}