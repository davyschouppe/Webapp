import { Component } from '@angular/core';
import { Raid } from './raid/raid.model';
import { AuthenticationService } from './user/authentication.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ AuthenticationService ]
})
export class AppComponent {

  constructor(private authService: AuthenticationService, private router: Router) {
    
  }

  get currentUser(): Observable<string> {
    return this.authService.user$;
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.authService.user$.asObservable().subscribe(user => {
      if(user){
        if(AuthenticationService.redirectUrl){
          this.router.navigateByUrl(AuthenticationService.redirectUrl).then(() => AuthenticationService.redirectUrl=undefined);
        }
        else{
          this.router.navigate(['/raid/list']);
        }
      }
      else{
        this.router.navigate(['/user/login']);
      }
    })
  }

}
