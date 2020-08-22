import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup;
  verificationId: any;
  phoneNumber: number;
  verificationID: string = "";

  constructor(public router: Router, public navCtrl: NavController, public firebaseAuthentication: FirebaseAuthentication) { 
    firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      if (user) {
        console.log("the user is ==>", user);
        navCtrl.navigateRoot(['/home'])
      }
      else {
        navCtrl.navigateRoot(['/'])
      }
    })
    this.loginForm = new FormGroup({
      mobileNo: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
  }

  loginGoogle(){
    console.log("called funcrion");
  }

  send(value) {
    console.log("called funcrion", value);
    this.firebaseAuthentication.verifyPhoneNumber("+91"+value.mobileNo, 30000).then((verificationID) => {
      console.log("verificationID ==>",verificationID);
      this.verificationID = verificationID;

    }).catch((error) => {
      console.log("error", error);
    });
  }

  verify(value) {
    let code = value.code.toString();
    console.log("the value of the otp is ==>", value, this.verificationID);
    this.firebaseAuthentication.signInWithVerificationId(this.verificationID, code).then((user)=>{
      console.log(user)
    });
    this.loginForm.reset();
  }
}