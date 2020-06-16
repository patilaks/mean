import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { ROUTER_INITIALIZER, Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  public autherror;
  private authstatusListener = new Subject<boolean>();
  private errorsubject = new Subject<any>();

  constructor(private http: HttpClient, public router: Router) {}

  getToken() {
    return this.token;
  }

  getAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getauthstatusListener() {
    return this.authstatusListener.asObservable();
  }

  getErrorsubject() {
    return this.errorsubject.asObservable();
  }

  createUser(email: string, password: string) {
    const authdata: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + "/signup", authdata).subscribe(
      (result) => {
        this.router.navigate(["/"]);
      },
      (error) => {
        this.authstatusListener.next(false);
        console.log(error);
        this.errorsubject.next(error);
      }
    );
  }

  loginUser(email: string, password: string) {
    const authdata: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "/login",
        authdata
      )
      .subscribe(
        (result) => {
          const token = result.token;
          this.token = token;
          if (token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = result.userId;
            this.authstatusListener.next(true);
            const now = new Date();
            const expirationdate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationdate);
            this.saveAuthData(token, expirationdate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authstatusListener.next(false);
        }
      );
  }

  autoauthuser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authstatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("setting timer" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authstatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userid", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userid");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userid");
    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
