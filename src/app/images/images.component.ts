import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styles: []
})
export class ImagesComponent implements OnInit {

  constructor(private service: AuthenticationService) { }

  ngOnInit() {
    this.service.getImageDetailList();
  }

}
