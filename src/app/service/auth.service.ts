import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username: any;
  isLoggedIn: boolean = false;
  loggedinuser!: string;
  
  constructor() { }
  private users = [
    {username: "NeerajMeka", password: "123"},
    {username: "SaiganeshGurrapu", password: "456"},
    {username: "VinayKoli", password: "789"},
    {username: "DarshanShetty", password: "12345"},
    {username: "AryanPal", password: "67890"},
  ];
  
  
  
  validate(formUser:string,formPassword:string): boolean{
    for(let data of this.users){
      if(data.username == formUser && data.password == formPassword){
        this.isLoggedIn = true;
        this.loggedinuser = formUser;
        return true;
      }
    }
    return false;
  }

  loggedOut(){
    this.isLoggedIn = false;
  }

  isAuth(){
    return this.isLoggedIn;
  }
}