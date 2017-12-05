import { Component, OnInit } from '@angular/core';
import { Raid } from '../raid.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RaidDataService } from '../raid-data.service';
import { Player, Team } from '../player/player.model';
import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'app-raid-details',
  templateUrl: './raid-details.component.html',
  styleUrls: ['./raid-details.component.css'],
  providers: [AuthenticationService]
})
export class RaidDetailsComponent implements OnInit {
  private _raid: Raid;
  
    constructor(private route: ActivatedRoute, 
      private raidDataService: RaidDataService,
      private authenticationService: AuthenticationService,
      private router: Router ) {
    }
  
    ngOnInit() { 
      this.route.data.subscribe(item =>{ 
        this._raid = item['raid'];
      });
    }

    get raid() : Raid{
      return this._raid;
    }

    join() : boolean {
      this.raidDataService.join(this._raid).subscribe(player => this.raid.players.push(player));
      return false;
    }

    joined() : boolean{
      const me = JSON.parse(localStorage.getItem('currentUser')).username;
      let joined=false;
      this.raid.players.forEach(player => {
        if(player.name === me){
          joined=true;
        }
      });
      return joined;
    }

    leave() {
      const me = JSON.parse(localStorage.getItem('currentUser')).username;
      let id;
      this.raid.players.forEach(player => {
        if(player.name === me){
          id=player.id;
        }
      });
      this.raidDataService.leave(id).subscribe(() => {
        for(let i = 0 ; i< this.raid.players.length;i++){
          if(this.raid.players[i].name === me){
            this.raid.players.splice(i,1);
          }
        }
      });
    }

}
