import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireDatabase } from "@angular/fire/database";
// import { IonicTelInputModule } from 'ionic-tel-input';
declare let $: any;

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
  slides:any;
  isActive:boolean = false;
  isUser:boolean = false;
  isVerify: boolean = false;
  allUsers:any = [];
  countries:any = [];
  mobileNumber:any;
  userInfo:any;
  errorMessage:any;  
  isError : boolean = false;


  constructor(public router: Router, public navCtrl: NavController, private firebaseAuthentication: FirebaseAuthentication, private afDB: AngularFireDatabase) { 
    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      mobileNo: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      code: new FormControl('', Validators.required),
      otp: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.getdata();
  }

  ionViewWillEnter(){
    this.countries = [{"name":"Afghanistan","dial_code":"+93","code":"AF"},{"name":"Argentina","dial_code":"+54","code":"AR"},{"name":"Iceland","dial_code":"+354","code":"IS"},{"name":"India","dial_code":"+91","code":"IN"},{"name":"Indonesia","dial_code":"+62","code":"ID"},{"name":"Iraq","dial_code":"+964","code":"IQ"}];
  }

  getdata(){
    this.afDB.list('users').valueChanges().subscribe(data => {
      console.log("subject", data);
      this.allUsers = data;
    });
  }

  send(value) {
    var num = value.mobileNo.toString().length;
    console.log("called funcrion", value, num);    
    this.mobileNumber = value.code + value.mobileNo;
    if (num != 10) { 
      this.isError = true;
      console.log("condition is working");
      this.errorMessage = "Invalid Number try again"; 
    }


    this.firebaseAuthentication.verifyPhoneNumber(value.code + value.mobileNo, 30000).then((verificationID) => {
      console.log("verificationID ==>",verificationID);
      this.verificationID = verificationID;
      if (value.mobileNo && verificationID) {
        this.isActive = true;
        this.isVerify = true;
      }
    }).catch((error) => {
      this.isError = true;
      this.errorMessage = "Check your Mobile Number and try again";
      console.log("error", error);
    });
    this.loginForm.reset();
  }

  verify(value) {
    this.isError = false;
    let code = value.otp.toString();

    if (value.otp) {
      this.isUser = true;
      this.isActive = true;
      this.isVerify = false;
    }
    console.log("the value of the otp is ==>", value, this.verificationID);
    this.firebaseAuthentication.signInWithVerificationId(this.verificationID, code).then((user)=>{
      console.log("the user is the ===>", user);
      this.userInfo = user;
    });
    this.loginForm.reset();

    var allUsersData = this.allUsers.filter((userMessage:any, ind) => {
      let flag = false
      this.allUsers.forEach((o_userMessage:any, index)=>{
        if(userMessage.mobileNo != this.mobileNumber){
          flag = true
          return false
        }
      });
      if(!flag){
        return userMessage
      }
    });

    console.log("the allData is the =========>", allUsersData);
    if (allUsersData[0]) {
      localStorage.setItem('uid', JSON.stringify(allUsersData[0]));
      this.navCtrl.navigateRoot(['/']);
    }
  }

  sendDetail(value){
    this.isError = false;
    if (value.name == '' && value.username == '') {
      this.isError = true;
      this.errorMessage = "Please Enter Your Details";
    }
    this.firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      if (user) {
        console.log("the user is ==>", user);
        this.afDB.object("users/" + user.uid).set({
          name: value.name,
          username: value.username,
          mobileNo: user.phoneNumber,
          createdAt: Date.now(),
          uid: user.uid
        }).then(() => {
          localStorage.setItem('uid', JSON.stringify(user));
          console.log("the demo is ====>", user);
          this.navCtrl.navigateRoot(['/']);
        });
      }
    })
  }
}