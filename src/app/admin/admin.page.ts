import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { MenuController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { finalize, tap } from 'rxjs/operators';


export interface MyData {
  Address: string;
  Age: number;
  Name: string;
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;
  
  
  
  userEmail: string;
  title = 'Firestore CRUD Operations Students App';

  students: any;
  studentName: string;
  studentAge: number;
  studentAddress: string;
  imageCollection: any;

  constructor(
    private crudService: AuthenticationService,
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private menu: MenuController,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) { 
    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('freakyImages');
    this.images = this.imageCollection.valueChanges();
  }

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
          Name: e.payload.doc.data().Name,
          Age: e.payload.doc.data().Age,
          Address: e.payload.doc.data().Address,
        };
      });
      console.log(this.students);

    });
  }
uploadFile(event: FileList) {
    
 
    // The File object
    const file = event.item(0)
 
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }
 
    this.isUploading = true;
    this.isUploaded = false;
 
 
    this.fileName = file.name;
 
    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;
 
    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };
 
    //File reference
    const fileRef = this.storage.ref(path);
 
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
 
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }
 
  addImagetoDB(image: MyData) {
    image.Name = this.studentName;
    image.Age = this.studentAge;
    image.Address = this.studentAddress;
    //Create an ID for document
    const id = this.database.createId();

 
    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      this.studentName = '';
      this.studentAge = undefined;
      this.studentAddress = '';
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }
  /*
  CreateRecord() {
    const record = {};
    record.Name = this.studentName;
    record.Age = this.studentAge;
    record.Address = this.studentAddress;
    this.crudService.create_NewStudent(record).then(resp => {
      this.studentName = '';
      this.studentAge = undefined;
      this.studentAddress = '';
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }
*/


}

