import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector:'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy{ 

    isLoading=false;
    private authStatusSub:Subscription;
   constructor(public authService:AuthService){}
   ngOnInit()
   {
     this.authStatusSub=this.authService.getauthstatusListener().subscribe(
         authStatus=>{
             this.isLoading=false;
         },
         error=>{
             this.authService.getErrorsubject().subscribe(errors=>{
                  console.log(errors);
             })
         }
     )
   }
    onSignup(form:NgForm){

        if(form.invalid)
        {
            return;
        }
        this.isLoading=true;
        this.authService.createUser(form.value.email,form.value.password);
        this.authService.getErrorsubject().subscribe(errors=>{
            console.log(errors);
        })


    } 
    ngOnDestroy(){
        this.authStatusSub.unsubscribe()
    }
}