import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Raid, Pokemon } from '../raid.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RaidDataService } from '../raid-data.service';
import { Router } from '@angular/router';
import { Player, Team } from '../player/player.model';
declare var $ :any;

@Component({
  selector: 'app-add-raid',
  templateUrl: './add-raid.component.html',
  styleUrls: ['./add-raid.component.css']
})
export class AddRaidComponent implements OnInit {

  @Output() public newRaid = new EventEmitter<Raid>();
  raidForm: FormGroup;
  _pokemon: Pokemon[];
  public static autoCompleteName: String;
  
  constructor(private fb: FormBuilder, private _raidsDataService : RaidDataService, private router: Router) { }

  ngOnInit() {
    this._raidsDataService.pokemon.subscribe(items => {this._pokemon=items;this.loadData(name)});
    this.raidForm = this.fb.group({
      pokemon: ['',[Validators.required]],
      location: ['',[Validators.required]],
      hour: ['',[Validators.required,Validators.min(0),Validators.max(23)]],
      min: ['',[Validators.required,Validators.min(0),Validators.max(59)]]
    });
  }

  onSubmit() {
    if(AddRaidComponent.autoCompleteName){
      if(isNaN(this.raidForm.value.hour) || isNaN(this.raidForm.value.min)){
        if(isNaN(this.raidForm.value.hour)){
          this.raidForm.get("hour").setErrors({"notanumber":"true"});
        }
        if(isNaN(this.raidForm.value.min)){
          this.raidForm.get("min").setErrors({"notanumber":"true"});
        }
        return;
      } 
    let r = new Raid(AddRaidComponent.autoCompleteName.toString(),this.raidForm.value.location,this.raidForm.value.hour,this.raidForm.value.min);
    AddRaidComponent.autoCompleteName = undefined;
    r.ndex = this.getndex(r.pokemon);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser){
      r.creator = currentUser.username;
    }
    this._raidsDataService.addRaid(r).subscribe((res) => this.join(res));
    }
    else{
      this.raidForm.get("pokemon").setErrors({"invalidchoice":"true"});
    }
  }

  join(raid: Raid) {
    this._raidsDataService.join(raid).subscribe(() => this.router.navigate(['/raid/list']));
    return false;
  }

  getnames(){
    return this._pokemon.map(pokemon => pokemon.namestoJSON());
  }

  getndex(name: string): string{
    return this._pokemon.filter(Pokemon => Pokemon.name === name).map(Pokemon => Pokemon.ndex)[0];
  }

  loadData(n: String) {
    $('.ui .search')
    .search({
      source: this.getnames(),
      onSelect: function(result, response) {
        AddRaidComponent.autoCompleteName = result.title;
      }
    })
  ;
  }

}
