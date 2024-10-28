  import { Component, OnInit } from '@angular/core';
  import { AuthService } from 'src/app/service/auth.service';
  import { FormComponent } from '../form/form.component';
  import { MatDialog, MatDialogRef } from '@angular/material/dialog';

  @Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
  })
  export class EditComponent implements OnInit {
    todayDate = new Date();
    day = String(this.todayDate.getDate()).padStart(2, '0');
    month = String(this.todayDate.getMonth() + 1).padStart(2, '0'); 
    year = this.todayDate.getFullYear();
    formattedDate = `${this.day}/${this.month}/${this.year}`;
    loggedInUsername: string = '';
    userData: any = {};
    imageUrl = 'assests/accept.png'
    constructor(private auth: AuthService,private dialog: MatDialog, private dialog1: MatDialogRef<EditComponent>
    ) { }

    ngOnInit(): void {
      this.loggedInUsername = this.auth.loggedinuser;

      const storedData = localStorage.getItem(this.loggedInUsername);
      if (storedData) {
        this.userData = JSON.parse(storedData);
      }
    }

    get reportList() {
      return this.userData.reports?.reports_list || [];
    }

    get emailList() {
      return this.userData.email_list?.email_list || [];
    }
    openForm(){
      this.dialog1.close();
      this.dialog.open(FormComponent,{
        width: '565px',
        height: '565px',
        disableClose: true, 
        data: {
          username: this.loggedInUsername,
          reports: this.userData.reports,
          email_list: this.userData.email_list,
          schedule_time: this.userData.schedule_time,
          schedule_date: this.userData.schedule_date,
        }
      });
    }
  }
