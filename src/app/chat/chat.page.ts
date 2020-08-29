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
	receiver_id;
	usersname = sessionStorage.getItem('username');
	username;
	sender_id;

	chats = [];
	textMsg;

	constructor(public navCtrl: NavController, public firebaseAuthentication: FirebaseAuthentication, public db: AngularFireDatabase) {

		this.username = sessionStorage.getItem("username");
		this.receiver_id = sessionStorage.getItem("uid");
		this.name = sessionStorage.getItem("name");

		this.sender_id = JSON.parse(localStorage.getItem("currentUser")).uid;

		this.chatForm = new FormGroup({
			username: new FormControl('', Validators.required),
			textMsg: new FormControl('', Validators.required),
		});
	}

	ionViewWillEnter(){
		this.db.list('Messages').valueChanges().subscribe(data => {
			console.log("subject", data);

			this.chats = data.filter((userMessage:any, ind) => {
				let flag = false
				console.log("the userMessage is the =========>", userMessage);
				data.forEach((o_userMessage:any, index)=>{
				// console.log("the o_userMessage is the =========>", o_userMessage);

					if(userMessage.sender_id == this.sender_id){
						flag = true
						return false
					}
				});
				if(!flag){
					return userMessage
				}
			console.log("created user ============>" , data);

			});
			console.log("Absent user ============>" , this.chats);
		});
	}

	ngOnInit() {
	}

	send(value){
		value.username = this.username
		console.log("the function is called", value);

		this.db.list('/Messages').push({
			username: value.username,
			message: value.textMsg,
			sender_id:this.sender_id,
			receiver_id: this.receiver_id,
		});

		this.chatForm.reset();
		console.log("the chats is other ----->", this.chats); 	
	}
}
