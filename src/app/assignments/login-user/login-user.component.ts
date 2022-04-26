import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/auth.service";
import {Router} from "@angular/router";
import {User} from "../model/user.model";

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  pseudo?:string;
  mdp?:string;
  erreur?:string;

  constructor(private authservice:AuthService, private router: Router) { }

  ngOnInit(): void {
    var a:User = new User ();
    a._id="aaz";
    a.iduser=1;
    a.pseudo="andry";
    a.mdp="andry";
    a.admin=true;
    this.authservice.user=a;

    this.authservice.loggedIn=true;
  }

  seConnecter (){
    console.log("Loggin : "+this.authservice.loggedIn);
    if(!this.pseudo || !this.mdp) {
      this.erreur="Des champs sont nuls";
      return ;
    }

    this.authservice.getUsers().subscribe( reponse => {
      for(var val of reponse) {
        if(val.pseudo===this.pseudo && val.mdp===this.mdp){
          this.authservice.user = val;
          this.authservice.loggedIn=true;
          this.router.navigate(['/home'])
        }
      }
      this.erreur="login incorrect ";
    });
  }

}
