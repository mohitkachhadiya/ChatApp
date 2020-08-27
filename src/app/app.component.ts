import { Component } from '@angular/core';

import { Platform, NavController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  countries: Observable<any[]>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private firebaseAuthentication: FirebaseAuthentication,
    public navCtrl: NavController,
    public db: AngularFireDatabase
    ) {
    firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      if (user) {
        localStorage.setItem('uid', JSON.stringify(user));
        console.log("the user is ==>", user);
        navCtrl.navigateRoot(['/home'])
      }
      else {
        navCtrl.navigateRoot(['/'])
      }
    });

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    // firebase.initializeApp(FIREBASE_CONFIG);
  }
}
