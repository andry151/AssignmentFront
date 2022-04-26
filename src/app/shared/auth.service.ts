import { Injectable } from '@angular/core';
import {User} from "../assignments/user.model";
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

  logIn(login:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    for (var val of this.users) {
      if(val.pseudo===login && val.mdp===password){
        this.user = val;
        this.loggedIn = true;
      }
    }
    // et recevoir un token d'authentification, etc. etc.

    // pour le moment, si on appelle cette méthode, on ne vérifie rien et on se loggue

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

  constructor() { }
}
