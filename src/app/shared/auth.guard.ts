import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // si renvoie true ça dit que les routes associées à ce gardien sont navigables
    return this.authService.isConnected()
    .then((user):boolean => {
      //console.log("admin = " + admin + " type : " + (typeof admin))
      if(user) {
        console.log("Autorise la navigation, user ="+this.authService.user?.pseudo);
        return true;
      } else {
        // si pas admin on force la navigation vers la page d'accueil
        console.log("Veuillez vous connectez avant de choisir l'Url" );
        this.router.navigate(["/login"]);
        return false;
      }
    })
  }

}
