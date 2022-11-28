import { Injectable } from '@angular/core';
import { Clock } from '../models/clock';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  clock: Clock;
  constructor() {
    this.clock = new Clock(0,30,1);
  }

}
