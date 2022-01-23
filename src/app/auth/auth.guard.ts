import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

// Guard is just a service and a class that we export
// Guard basically get executed by the angular router before it loads the actual route
// basically it will check to see if it can proceed or cancel
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // router will know the route is accessible if route guard returns true
    const isAuth = this.authService.getIsAuth();

    if (!isAuth) {
      this.router.navigate(['/login']);
    }

    return isAuth;
  }
}
