import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { Clock } from '../shared/models/clock';
import { ClockService } from '../shared/services/clock.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  panelOpenState = false;
  clock: Clock;
  constructor(private electronService: ElectronService, private clockService: ClockService) { }

  ngOnInit(): void {
    this.clock = this.clockService.clock;
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

  closeMainWindow() {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.send('closeMainWindow');
    }
  }

  minimizeMainWindow() {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.send('minimizeMainWindow');
    }
  }

}
