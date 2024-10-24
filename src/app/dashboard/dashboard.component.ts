import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from './form/form.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private auth: AuthService, private route: Router, private dialog: MatDialog) { }
  @ViewChild('nameOfUser') userLoggedIn !: ElementRef;
  loggedInUser = this.auth.loggedinuser;
  showForm : boolean = false;
  ngAfterViewInit() {
    this.userLoggedIn.nativeElement.textContent = `Welcome ${this.auth.loggedinuser}`;
  }
  loggedOut() {
    this.auth.loggedOut();
    this.route.navigate(["login"]);
  }

  navs = ["dashboard", "about", "contact", "logout"];
  navigate(data: string) {
    if (data == "logout") {
      this.auth.loggedOut();
      this.route.navigate([""]);
    }
  }
  openForm() {
    this.dialog.open(FormComponent, {
      width: '500PX',
      height: '500px',
      data: {
        username:   this.loggedInUser
      },
    });
  }
}
