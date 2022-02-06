import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  //message = "An unknown error occured!";
  //this is the way to pass data from external source
  // error component is invoked by error interceptor without using the selector
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

  ngOnInit() {
  }

}
