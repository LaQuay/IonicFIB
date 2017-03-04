import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { GeneratorPage } from '../pages/generator/generator';
import { AuthService } from '../providers/auth-service';
import { PublicRacoService } from '../providers/public-raco-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    GeneratorPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    GeneratorPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, PublicRacoService],
})
export class AppModule {}
