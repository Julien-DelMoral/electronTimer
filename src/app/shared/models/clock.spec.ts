import { fakeAsync, tick } from '@angular/core/testing';
import { Clock } from './clock';

describe('Clock :', () => {
    let clock: Clock;
    let originalTimeout: any;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

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


    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});