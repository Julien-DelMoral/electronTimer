import { fakeAsync, tick } from '@angular/core/testing';
import { Clock } from './clock';

describe('Clock :', () => {
    let clock: Clock;

    it('clock should be empty after being created without args', () => {
        clock = new Clock();
        expect(clock.hundredthsOfSeconds).toEqual(0);
        expect(clock.seconds).toEqual(0);
        expect(clock.minutes).toEqual(0);
        expect(clock.hours).toEqual(0);
    });

    it('clock should not be running after creation', () => {
        clock = new Clock();
        expect(clock.isRunning).toBeFalsy();
        expect(clock.isStopped).toBeTruthy();
    });

    it('clock should be created with correct values', () => {
        clock = new Clock(70.25, 61.10, 3.25);
        expect(clock.hundredthsOfSeconds).toEqual(25);
        expect(clock.seconds).toEqual(16);
        expect(clock.minutes).toEqual(17);
        expect(clock.hours).toEqual(4);
    });

    it('clock should be running after being started', fakeAsync(() => {
        clock = new Clock(30);
        clock.startTimer();
        tick(2000);
        expect(clock.isRunning).toBeTruthy();
        expect(clock.seconds).toEqual(28);
        tick(2000);
        expect(clock.seconds).toEqual(26);
        clock.stopTimer();
    }));

    it('30s clock should be stopped after 30s' , fakeAsync(()=>{
        clock = new Clock(30);
        clock.startTimer();
        tick(30000);
        expect(clock.isRunning).toBeFalsy();
        expect(clock.isStopped).toBeTruthy();
        expect(clock.seconds).toEqual(0);
    }));

    it('paused clock should not be running and not be stopped' , fakeAsync(()=>{
        clock = new Clock(30);
        clock.startTimer();
        tick(2000);
        clock.pauseTimer();
        tick(2000);
        expect(clock.isRunning).toBeFalsy();
        expect(clock.isStopped).toBeFalsy();
        expect(clock.seconds).toEqual(28);
        clock.stopTimer();
    }));

    it('90s clock should be equal to 30s after raising pause event 1min after start' , fakeAsync(()=>{
        clock = new Clock(30,1);
        clock.startTimer();
        tick(60000);
        clock.pauseTimer();
        expect(clock.seconds).toEqual(30);
        clock.stopTimer();
    }));

    it('paused clock should be running after raising resume event' , fakeAsync(()=>{
        clock = new Clock(30,1);
        clock.startTimer();
        tick(10000);
        clock.pauseTimer();
        tick(1000);
        clock.startTimer();
        expect(clock.isRunning).toBeTruthy();
        expect(clock.isStopped).toBeFalsy();
        clock.stopTimer();
    }));

    it('90s resumed clock should be equal to 30s after raising pause event 30s after start and running 30s more' , fakeAsync(()=>{
        clock = new Clock(30,1);
        clock.startTimer();
        tick(30000);
        clock.pauseTimer();
        expect(clock.seconds).toEqual(0);
        expect(clock.minutes).toEqual(1);
        clock.startTimer();
        tick(30000);
        expect(clock.seconds).toEqual(30);
        expect(clock.minutes).toEqual(0);
        clock.stopTimer();
    }));


    it('running clock should not be running after reset', () => {
        clock = new Clock(30);
        clock.startTimer();
        clock.resetTimer();
        expect(clock.isRunning).toBeFalsy();
        expect(clock.isStopped).toBeTruthy();
        clock.stopTimer();
    });

    it('30s clock should be equal to 30s after default reset', fakeAsync(() => {
        clock = new Clock(30);
        clock.startTimer();
        tick(10000);
        clock.resetTimer();
        expect(clock.seconds).toEqual(30);
        clock.stopTimer();
    }));

    it('30s clock should be equal to 1h 30m 15s after reset with value (15,30,1)', fakeAsync(() => {
        clock = new Clock(30);
        clock.startTimer();
        tick(10000);
        clock.resetTimer(15,30,1);
        expect(clock.seconds).toEqual(15);
        expect(clock.minutes).toEqual(30);
        expect(clock.hours).toEqual(1);
        clock.stopTimer();
    }));

    it('30s clock should be equal to 1m after adding 30s', fakeAsync(() => {
        clock = new Clock(30);
        const s = 30;
        const ms = s * 1000;
        clock.addTimeToTimer(ms);
        expect(clock.seconds).toEqual(0);
        expect(clock.minutes).toEqual(1);
        expect(clock.hours).toEqual(0);
        clock.stopTimer();
    }));

    it('addTimeToTimer should not change timer status', fakeAsync(() => {
        const s = 30;
        const ms = s * 1000;

        clock = new Clock(30);
        clock.startTimer();
        tick(1000);
        let isRunningSaved = clock.isRunning;
        let isStoppedSaved = clock.isStopped;


        clock.addTimeToTimer(ms);
        tick(1000);

        expect(clock.isRunning).toEqual(isRunningSaved);
        expect(clock.isStopped).toEqual(isStoppedSaved);

        clock.stopTimer();
        tick(1000);
        isRunningSaved = clock.isRunning;
        isStoppedSaved = clock.isStopped;
        clock.addTimeToTimer(ms);

        expect(clock.isRunning).toEqual(isRunningSaved);
        expect(clock.isStopped).toEqual(isStoppedSaved);
    }));
});
