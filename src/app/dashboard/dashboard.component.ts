import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from './form/form.component';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  alreadyFilled: boolean = false;
  
  constructor(private auth: AuthService, private route: Router, private dialog: MatDialog) {
    this.checkStorage();
  }

  @ViewChild('nameOfUser') userLoggedIn!: ElementRef;
  loggedInUser = this.auth.loggedinuser;

  ngAfterViewInit() {
    this.userLoggedIn.nativeElement.textContent = `Welcome ${this.auth.loggedinuser}`;
  }

  loggedOut() {
    this.auth.loggedOut();
    this.route.navigate(["login"]);
  }

  navs = ["dashboard", "about", "contact", "logout"];

  navigate(data: string) {
    if (data === "logout") {
      this.auth.loggedOut();
      this.route.navigate([""]);
    }
  }

  edit() {
    this.dialog.open(EditComponent, {
      width: '500px',
      height: '250px'
    });
  }

  openForm() {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '565px',
      height: '565px',
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alreadyFilled = true;
      }
    });
  }

  checkStorage() {
    const storeData = localStorage.getItem(this.loggedInUser);
    if (storeData !== null) {
      this.alreadyFilled = true;
    }
  }
}
