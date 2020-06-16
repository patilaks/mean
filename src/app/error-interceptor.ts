import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor
{
   constructor(public dialog: MatDialog){}
  intercept(req:HttpRequest<any>,next:HttpHandler)
  { 
    
    return next.handle(req).pipe(
        catchError((error:HttpErrorResponse)=>{
            let errorMessage="An unknown error"
            if(error.error.message)
            {
                errorMessage=error.error.message

            }
            this.dialog.open(ErrorComponent,{data:{message:errorMessage}});
            return throwError(error)
        })
    )
  }
}