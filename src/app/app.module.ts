import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GeneratorPage } from '../pages/generator/generator';
import { AuthService } from '../providers/auth-service';
import { PublicRacoService } from '../providers/public-raco-service';
import { ScheduleAlgorithm } from '../providers/schedule-algorithm';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GeneratorPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GeneratorPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, PublicRacoService, ScheduleAlgorithm],
})
export class AppModule {}
