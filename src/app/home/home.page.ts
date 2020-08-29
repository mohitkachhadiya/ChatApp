import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
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
    public userService: UserService, private db: AngularFireDatabase, public alertController: AlertController) {

    this.getdata();
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    console.log("the userInfo is the =======>", this.userInfo); 

    // firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      //     console.log("the user is ==>", user);
      //   if (user) {
        //     localStorage.setItem('uid', JSON.stringify(user));
        //     navCtrl.navigateRoot(['/'])
        //   }
        //   else {
          //     navCtrl.navigateRoot(['/login'])
          //   }
          // });

          if (localStorage.getItem('currentUser')) {  
            this.uid = JSON.parse(localStorage.getItem("currentUser")).uid;
            console.log("the uid is the ====>", this.uid); 
          }
          else{
            navCtrl.navigateRoot(['/login'])
          }
        }

        gotoChat(uid, value){
          sessionStorage.setItem("uid", uid);
          sessionStorage.setItem("name", value.name);
          sessionStorage.setItem("username", value.username);

          this.navCtrl.navigateForward("/chat");
        }

        membersId: any = [];

        getdata(){
          this.db.list('users').valueChanges().subscribe(data => {
            this.allUsers = data;
            console.log("subject", data);

            this.users = data.filter((userMessage:any, ind) => {
              let flag = false
              data.forEach((o_userMessage:any, index)=>{
                if(userMessage.uid == this.uid){
                  flag = true
                  return false
                }
              });
              if(!flag){
                return userMessage
              }
            });
            console.log("the user data is the ======>", this.users);
            this.users.forEach((item) => {
              console.log("the item is the ========>", item);
              this.membersId.push(item.uid);
            })
            console.log("the membersId is the =====>", this.membersId, this.users);
            this.db.object("chats/" + this.uid).set({
              participantUsers: this.users,
              chatId: this.membersId
            })
          });
        }

        async delete() {
          const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Are you sure want to delete this user?',
            buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('cancel');
              }
            }, {
              text: 'Okay',
              handler: () => {
                firebase.database().ref('users/' + this.uid).remove();
                this.navCtrl.navigateForward(['/login']);
                localStorage.removeItem('currentUser')
              }
            }
            ]
          });
          await alert.present();
        }
      }
