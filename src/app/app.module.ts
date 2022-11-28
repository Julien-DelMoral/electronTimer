import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimerComponent } from './timer/timer.component';

// Services imports
import { ElectronService } from './core/services';

// Modules imports
import { AppMaterialModule } from './material/material.module';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    TitlebarComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
