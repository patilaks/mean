import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenersub: Subscription;
  userisAuthenticated = false;
  constructor(public authservice: AuthService) {}
  ngOnInit() {
    this.userisAuthenticated = this.authservice.getAuth();
    this.authListenersub = this.authservice
      .getauthstatusListener()
      .subscribe((isAuthenticated) => {
        console.log(isAuthenticated);
        this.userisAuthenticated = isAuthenticated;
      });
  }

  logoutUser() {
    this.authservice.logout();
  }

  ngOnDestroy() {
    this.authListenersub.unsubscribe();
  }
}
