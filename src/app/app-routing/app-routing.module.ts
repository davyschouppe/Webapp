import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthGuardService } from '../user/auth-guard.service';
import { AuthenticationService } from '../user/authentication.service';
import { HttpModule } from '@angular/http';

const appRoutes: Routes = [
    {
      path: 'user',
      loadChildren: 'app/user/user.module#UserModule'
    },
    {
      path: 'raid',
      canActivate: [ AuthGuardService ],
      loadChildren: 'app/raid/raid.module#RaidModule'
    },
   // { path: '', redirectTo: 'raid/list', pathMatch: 'full'},
    { path: '**', component: PageNotFoundComponent}
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    HttpModule
  ],
  declarations: [],
  providers: [AuthGuardService, AuthenticationService],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }