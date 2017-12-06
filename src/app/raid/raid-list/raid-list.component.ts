import { Component, OnInit } from '@angular/core';
import { Raid } from '../raid.model';
import { RaidDataService } from '../raid-data.service';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.css']
})
export class RaidListComponent implements OnInit {
  private _raids: Raid[];
  private loading: boolean;
  
  constructor(private _raidDataService: RaidDataService) {
    this.loading=true;
  }

  ngOnInit() {
    this.updateRaids();
  }

  get raids() : Raid[]{
    return this._raids;
  }

  updateRaids(){
    this.loading=true;
    this._raidDataService.raids.subscribe(items => {this._raids = items;this.loading=false;});
  }

  empty(){
    if (this._raids) {
      return this._raids.length === 0;
    }
    if(this.loading){
      return false;
    }
    return true;
  }

}
