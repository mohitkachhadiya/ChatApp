import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import * as firebase from 'firebase';
import { } from "@ionic/angular";
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  uid;
  allUsers: any = [];
  users: any = [];
  userInfo;

  constructor(public navCtrl: NavController, public firebaseAuthentication: FirebaseAuthentication, private afs: AngularFirestore, 
    public userService: UserService, private db: AngularFireDatabase) {

    this.getdata();
    this.userInfo = JSON.parse(localStorage.getItem('uid'));

    console.log("the userInfo is the =======>", this.userInfo); 
    this.uid = JSON.parse(localStorage.getItem("uid")).uid;
    console.log("the uid is the ====>", this.uid);
  }

  gotoChat(uid, value){
    sessionStorage.setItem("uid", uid);
    sessionStorage.setItem("name", value.name);
    sessionStorage.setItem("username", value.username);

    this.navCtrl.navigateForward("/chat");
  }

  getdata(){
    this.db.list('users').valueChanges().subscribe(data => {
      this.allUsers = data;
      console.log("subject", data);

      data.filter((item:any, index) => {
        console.log("the item is the ====>", item, index);
        if (item.uid != this.userInfo.uid) {
          console.log("the item of filter array is the ====>", item);
          this.users[index] = item;
        }
      })
    });

    console.log("the user data is the ======>", this.users);
  }
}
