import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User} from "../assignments/model/user.model";
import {catchError, map, Observable, tap} from "rxjs";
import {Assignment} from "../assignments/model/assignment.model";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?:User;
  loggedIn = false;

  constructor(private http:HttpClient) { }

  getUsers():Observable<User[]> {
    return this.http.get<User[]>("http://localhost:8010/api/users");
  }

  logOut() {
    this.loggedIn = false;
    this.user = undefined;
  }

  getAdmin(rang : number){
    if (rang ===0) return true;
    return false;
  }

  isConnected() {
    let User = new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });

    //return this.loggedIn;
    return User;
  }

  // isAdmin().then(admin => { if(admin) { console.log("L'utilisateur est administrateur"); }})


}
