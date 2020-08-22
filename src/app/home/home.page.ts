import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public navCtrl: NavController, public firebaseAuthentication: FirebaseAuthentication) {
  	firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      if (user) {
        console.log("the user is ==>", user);
        navCtrl.navigateRoot(['/home'])
      }
      else {
        navCtrl.navigateRoot(['/'])
      }
    })
  }
}
