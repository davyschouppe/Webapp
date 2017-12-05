import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: FormGroup;
  public errMsg: string;

  constructor(private fb: FormBuilder,private authenticationService : AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.user = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  onSubmit() {
    this.authenticationService.login(this.user.value.username, this.user.value.password).subscribe(val => {
      if (val) {
        if (AuthenticationService.redirectUrl) {
          //redirect werkt niet
          //console.log(AuthenticationService.redirectUrl);
          //this.router.navigateByUrl(AuthenticationService.redirectUrl);
          //this.router.navigate([AuthenticationService.redirectUrl]).then(() => AuthenticationService.redirectUrl = undefined );
          //this.router.navigate(['raid/list']);
        } else {
          //this.router.navigate(['raid/list']);
        }
      }
    }, err => this.errMsg = err.json().message);
  }
  

}
