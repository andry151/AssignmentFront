import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../model/user.model";
import {AssignmentsService} from "../../shared/assignments.service";

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  pseudo?:string ;
  mdp?:string ;
  /*pseudo:string="ituadmin" ;
  mdp:string="ituadmin" ;*/
  erreur?:string;

  constructor(private authservice:AuthService, private router: Router,private route: ActivatedRoute, private ass: AssignmentsService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.erreur = params['erreur'];
      });
  }

  seConnecter (){
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

  matieresPeuple(){
    this.ass.peuplerBD();
  }

}
