import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from "angularfire2/";
import { environment } from '../environments/environment';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
// import { FIREBASE_CONFIG } from "../environments/environment";
import { AngularFireDatabaseModule } from "@angular/fire/database";
// import { AngularFire} from 'angularfire2';
import { AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore';
  import * as firebase from 'firebase';
import {Ng2TelInputModule} from 'ng2-tel-input';


firebase.initializeApp(environment.FIREBASE_CONFIG);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  BrowserModule, 
  IonicModule.forRoot(), 
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  AngularFireModule.initializeApp(environment.FIREBASE_CONFIG, 'test'),
  // AngularFireModule,
  AngularFireDatabaseModule,
  AngularFirestoreModule,
  Ng2TelInputModule
  // IonicTelInputModule
  ],
  providers: [
  StatusBar,
  SplashScreen,
  FirebaseAuthentication,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
