import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  // NodeJS.Timer doesn't work so use any
  //private tokenTimer: NodeJS.Timer;
  private tokenTimer: any;
  private userId: string;
  private loggedInUserEmail: string;

  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email, password: password
    };

    this.http.post(BACKEND_URL + "/signup", authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/"]);
      }, error => {
        //console.log(error)
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    this.loggedInUserEmail = email;
    const authData: AuthData = {
      email: email, password: password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + "/login", authData)
      .subscribe(response => {
        //console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          //console.log(expiresInDuration);
          //setTimeout works with milli seconds so multiply seconds with 1000
          // this.tokenTimer = setTimeout(() => {
          //   this.logout();
          // }, expiresInDuration * 1000);
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          // redirect to home page upon successful login
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  getLoggedInUserEmail() {
    return this.loggedInUserEmail;
  }

  getUserId() {
    return this.userId;
  }

  // Set token to null
  // Set isAuthenticated flag to false
  // Inform all the subscribers
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // go back to home page upon successful logout
    this.userId = null;
    this.router.navigate(['/']);
  }

  // store token info in local storage
  // when page is reloaded just read it from there
  // when token expires, we'll be force user to sign back into
  // the application, which is cool!!
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    // validate the expiration date
    const now = new Date();
    // if isInFuture then user is authenticated
    const isInFuture = authInformation.expirationDate > now;
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      // divide by 1000 because difference is already interms of milli second
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
}
