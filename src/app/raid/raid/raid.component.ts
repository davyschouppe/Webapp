import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Raid } from '../raid.model';
import { RaidDataService } from '../raid-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raid',
  templateUrl: './raid.component.html',
  styleUrls: ['./raid.component.css']
})
export class RaidComponent implements OnInit {

  @Input() public raid: Raid;
  @Output() public deleteRaid = new EventEmitter<String>();
  public isDeleteDisabled = false;

  constructor(private _raidsDataService : RaidDataService) {
  }

  ngOnInit() {
  }

  delete() : boolean {
    this.isDeleteDisabled=true;
    this._raidsDataService.deleteRaid(this.raid.id).subscribe(() => this.deleteRaid.emit(null));
    return false;
  }

  isMine(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser){
       return this.raid.creator === currentUser.username;
    }
    return false;
  }

  joined() : boolean{
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let me;
    if(currentUser){
      me =currentUser.username;
    }
    let joined=false;
    this.raid.players.forEach(player => {
      if(player.name === me){
        joined=true;
      }
    });
    return joined;
  }





}
