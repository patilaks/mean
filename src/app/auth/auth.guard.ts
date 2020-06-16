import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
  
    constructor(private authservice:AuthService,private router:Router){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot): boolean | Observable<boolean>|Promise<boolean>
    {
        const isAuth=this.authservice.getAuth();
        if(!isAuth)
        {
            this.router.navigate(['/auth/login']);
        }
        return isAuth;
    }


}