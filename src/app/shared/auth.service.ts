import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User} from "../assignments/user.model";
import {catchError, map, Observable, tap} from "rxjs";
import {Assignment} from "../assignments/assignment.model";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?:User;
  loggedIn = false;
  users:User[] =  [
    {
      _id : "aaze",
      iduser : 1,
      pseudo : "andry",
      mdp : "andry",
      admin : true,
    },
    {
      _id : "aaze3",
      iduser : 2,
      pseudo : "itu",
      mdp : "itu",
      admin : false,
    },
    {
      _id : "aaz2",
      iduser : 3,
      pseudo : "itu2",
      mdp : "itu2",
      admin : false,
    }
  ];

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
    let isUserAdmin = new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });

    //return this.loggedIn;
    return isUserAdmin;
  }

  // isAdmin().then(admin => { if(admin) { console.log("L'utilisateur est administrateur"); }})


}
