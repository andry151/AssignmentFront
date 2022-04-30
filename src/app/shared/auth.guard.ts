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

    return this.authService.isConnected()
    .then((user):boolean => {
      if(user) {
        console.log("Autorise la navigation, user ="+this.authService.user?.pseudo);
        return true;
      } else {
        // si pas admin on force la navigation vers la page d'accueil
        this.router.navigate(['/login'], {
          queryParams: {
            erreur: 'Accès refusé : veuillez d\'abord vous connecter'
          },
          replaceUrl: true
        });
        return false;
      }
    })
  }

}
