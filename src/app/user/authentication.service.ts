import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class AuthenticationService {
  private _url = '/API/users';
  private _user$: BehaviorSubject<string>;
  public static redirectUrl: string;
  
  constructor(private http: Http) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this._user$ = new BehaviorSubject<string>(
      currentUser && currentUser.username);
  }

  get user$(): BehaviorSubject<string> {
    return this._user$;
  } 

  get token(): string {
    return JSON.parse(localStorage.getItem('currentUser')).token;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${this._url}/login`, 
      { username: username, password: password })
      .map(res => res.json()).map(res => {
        const token = res.token;
        if (token) {
          localStorage.setItem('currentUser', 
            JSON.stringify({ username: username, token: token , team: res.team, id: res.id }));
          this._user$.next(username);
          return true;
        } else {
          return false;
        }
      });
  }

  register(username: string, password: string, team: string): Observable<boolean> {
    return this.http.post(`${this._url}/register`, 
      { username: username, password: password, team: team })
      .map(res => res.json()).map(res => {
        const token = res.token;
        if (token) {
          localStorage.setItem('currentUser', 
            JSON.stringify({ username: username, token: res.token, team: res.team, id: res.id }));
          this._user$.next(username);
          return true;
        } else {
          return false;
        }
      });
  }
  
  logout() {
    if (this.user$.getValue()) {
      localStorage.removeItem('currentUser');
      setTimeout(() => this._user$.next(null));
    }
  }

  checkUserNameAvailability(username: string): Observable<boolean> {
    return this.http.post(`${this._url}/checkusername`, { username: username })
    .map(res => res.json())
    .map(item => {
      if (item.username === 'alreadyexists') {
        return false;
      } else {
        return true;
      }
    });
  }

}
