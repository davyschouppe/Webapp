import { Injectable } from '@angular/core';
import { Raid, Pokemon } from './raid.model';
import { Http, Response , Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthenticationService } from '../user/authentication.service';
import { Player, Team } from './player/player.model';

@Injectable()
export class RaidDataService {
  private  _raidsUrl = '/API/raids/';
  private  _raidUrl = '/API/raid/';
  private  _pokemonUrl = '/API/pokemon/';
  private  _playerUrl = '/API/player/';
  private  _userUrl = '/API/user/';

  private _pokemon;

    constructor(private http: Http, private auth: AuthenticationService) {    
    }

    ngOnInit() {
      this.http.get(this._pokemonUrl)
      .map(response => response.json().map(item => Pokemon.fromJSON(item)));
    }

    get pokemon() : Observable<Pokemon[]> {
      return this.http.get(this._pokemonUrl)
      .map(response => response.json().map(item => Pokemon.fromJSON(item)));
    }

    get raids(): Observable<Raid[]> {
      const id = JSON.parse(localStorage.getItem('currentUser')).id;
      const theUrl = `${this._raidsUrl}${id}`;
      return this.http.get(theUrl, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) })
        .map(response => response.json().map(item => Raid.fromJSON(item))
      );
    }

    getRaid(id : string) : Observable<Raid>{
      return this.http.get(`${this._raidUrl}${id}`, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`})})
        .map(response => response.json()).map(item => Raid.fromJSON(item));
    }

    addRaid(raid): Observable<Raid> {
      return this.http.post(this._raidsUrl, raid, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) })
        .map(res => res.json()).map(item => Raid.fromJSON(item));
    }

    deleteRaid(id :string) {
      return this.http.delete(`${this._raidUrl}${id}`, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) });
    }

    join(raid: Raid): Observable<Player> {
      const theUrl = `${this._raidUrl}${raid.id}/players`;
      let player = new Player(
        JSON.parse(localStorage.getItem('currentUser')).username,
        Player.getTeam(JSON.parse(localStorage.getItem('currentUser')).team)
      );
      return this.http.post(theUrl,player, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) })
        .map(res => res.json())
        .map(items => Player.fromJSON(items.player));
    }

    leave(id : string) {
      return this.http.delete(`${this._playerUrl}${id}`, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) });
    }

    getTags() : Observable<string[]> {
      const id = JSON.parse(localStorage.getItem('currentUser')).id;
      const theUrl = `${this._userUrl}${id}/tags`;
      return this.http.get(theUrl, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`})})
      .map(response => response.json());
    }

    addTag(tag: String) : Observable<string> {
      const id = JSON.parse(localStorage.getItem('currentUser')).id;
      const theUrl = `${this._userUrl}${id}/tags`;
      return this.http.post(theUrl, {tag: tag}, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) })
      .map(res => res.json());
    }

    deleteTag(tag: String) : Observable<string>{
      const id = JSON.parse(localStorage.getItem('currentUser')).id;
      const theUrl = `${this._userUrl}${id}/tags`;
      return this.http.put(theUrl, {tag: tag}, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) })
      .map(res => res.json());
    }

}
