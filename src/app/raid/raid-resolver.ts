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
    return this.raidDataService.getRaid((route.params['id']));
  }
}