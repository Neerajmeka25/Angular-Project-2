import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
    constructor(private fb: FormBuilder,private auth: AuthService,private route: Router){}
    loginForm!: FormGroup;
    ngOnInit(){
        this.loginForm = this.fb.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        });
    }

    onSubmit(){
      const {username,password} = this.loginForm.value;
      if(this.auth.validate(username,password)){
        console.log("Success");
        this.route.navigate(['/dashboard']);
      }
    }

}
