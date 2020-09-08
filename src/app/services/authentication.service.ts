import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  imageDetailList: AngularFireList<any>;

  constructor(
    private firestore: AngularFirestore,
    private firebase: AngularFireDatabase
  ) { }
  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err));
    });
   }

   loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err));
    });
   }

   logoutUser() {
     return new Promise((resolve, reject) => {
       if (firebase.auth().currentUser) {
         firebase.auth().signOut()
         .then(() => {
           console.log('LOG Out');
           resolve();
         }).catch((error) => {
           reject();
         });
       }
     });
   }

   userDetails() {
     return firebase.auth().currentUser;
   }
   create_NewStudent(record) {
    return this.firestore.collection('Students').add(record);
  }

  read_Students() {
    return this.firestore.collection('Students').snapshotChanges();
  }

  update_Student(recordID, record) {
    this.firestore.doc('Students/' + recordID).update(record);
  }

  delete_Student(record_id) {
    this.firestore.doc('Students/' + record_id).delete();
  }
  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  insertImageDetails(imageDetails) {
    this.imageDetailList.push(imageDetails);
  }
}
