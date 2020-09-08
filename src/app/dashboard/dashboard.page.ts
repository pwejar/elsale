import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


export interface MyData {
  Address: string;
  Age: number;
  Name: string;
  name: string;
  filepath: string;
  size: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  images: Observable<MyData[]>;
  userEmail: string;
  title = 'Firestore CRUD Operations Students App';

  students: any;
  studentName: string;
  studentAge: number;
  studentAddress: string;
  constructor(
    private navCtrl: NavController,
    private crudService: AuthenticationService,
    private authService: AuthenticationService,
    private menu: MenuController,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {this.imageCollection = database.collection<MyData>('freakyImages');
  this.images = this.imageCollection.valueChanges(); }

  ngOnInit() {

    if (this.authService.userDetails()) {
      this.userEmail = this.authService.userDetails().email;
    } else {
      this.navCtrl.navigateBack('');
    }
    this.crudService.read_Students().subscribe(data => {

      this.students = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Age: e.payload.doc.data()['Age'],
          Address: e.payload.doc.data()['Address'],
        };
      })
      console.log(this.students);

    });
  }

  logout() {
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    });
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  goToAddStock() {
    this.navCtrl.navigateForward('/admin');
  }
  RemoveRecord(rowID) {
    this.crudService.delete_Student(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Age'] = recordRow.EditAge;
    record['Address'] = recordRow.EditAddress;
    this.crudService.update_Student(recordRow.id, record);
    recordRow.isEdit = false;
  }
}
