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
  
  constructor(private _raidDataService: RaidDataService) {
  }

  ngOnInit() {
    this.updateRaids();
  }

  get raids() : Raid[]{
    return this._raids;
  }

  updateRaids(){
    this._raidDataService.raids.subscribe(items => {this._raids = items;});
  }

}