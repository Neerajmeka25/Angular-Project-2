import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{
  
  loggedInUsername = "NeerajMeka";
  storeData = localStorage.getItem(this.loggedInUsername);
  userData : any;

  ngOnInit(): void {
    const storedData = localStorage.getItem(this.loggedInUsername);

    if (storedData) {
      this.userData = JSON.parse(storedData);
      console.log(this.userData);
      console.log(typeof this.storeData);
      console.log(typeof this.userData);
       
    }
  }
  
}
