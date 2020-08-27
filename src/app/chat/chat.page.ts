import { Component, OnInit} from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import * as firebase from 'firebase';

import { } from "@ionic/angular";
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-chat',
	templateUrl: 'chat.page.html',
	styleUrls: ['chat.page.scss'],
})
export class ChatPage implements OnInit{
	chatForm:FormGroup;
	name;
	o_uid;
	usersname = sessionStorage.getItem('username');
	username;
	uid;

	chats = [];
	textMsg;

	constructor(public navCtrl: NavController, public firebaseAuthentication: FirebaseAuthentication, public db: AngularFireDatabase) {

		this.username = sessionStorage.getItem("username");
		this.o_uid = sessionStorage.getItem("uid");
		this.name = sessionStorage.getItem("name");

		this.uid = JSON.parse(localStorage.getItem("uid")).uid;

		this.chatForm = new FormGroup({
			username: new FormControl('', Validators.required),
			textMsg: new FormControl('', Validators.required),
		});
	}

	ionViewWillEnter(){
		this.db.list('chat').valueChanges().subscribe(data => {
			console.log("subject", data);

			this.chats = data.filter((userMessage:any, ind) => {
				let flag = false
				data.forEach((o_userMessage:any, index)=>{
					if(userMessage.username != this.username){
						flag = true
						return false
					}
				});
				if(!flag){
					return userMessage
				}
			});
			console.log("Absent user ============>" , this.chats);
		});
	}

	ngOnInit() {
	}

	send(value){
		value.username = this.username
		console.log("the function is called", value);

		this.db.list('/chat').push({
			username: value.username,
			message: value.textMsg,
			uid:this.uid,
			o_uid: this.o_uid,
		});

		this.chatForm.reset();
		console.log("the chats is other ----->", this.chats); 	
	}
}
