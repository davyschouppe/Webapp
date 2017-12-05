import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Raid } from "./raid.model";
import { RaidDataService } from "./raid-data.service";
import { Observable } from "rxjs";

@Injectable()
export class RaidResolver implements Resolve<Raid> { 
  constructor(private raidDataService: RaidDataService,private router: Router) {}
 
  resolve(route: ActivatedRouteSnapshot, 
          state: RouterStateSnapshot): Observable<Raid> {
    return this.raidDataService.getRaid(route.params['id'])
    .map(raid => {
      if(raid){
        return raid;
      }
      console.log("notfound");
      this.router.navigate(['/']);
      return Observable.of(null);
    })
    .catch(error => {
      console.log(`Retrieval error: ${error}`);
      this.router.navigate(['/']);
      return Observable.of(null);
    });
  }
}