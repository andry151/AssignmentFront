import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/auth.service";
import {Router} from "@angular/router";

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
  }

  seConnecter (){
    if(!this.pseudo || !this.mdp) {
      this.erreur="Des champs sont nuls";
      return ;
    }
    this.authservice.logIn(this.mdp,this.mdp);
    if(this.authservice.loggedIn){
      this.router.navigate(['/home']);
      return ;
    }else{
      this.erreur="login incorrect";
    }
  }
}
