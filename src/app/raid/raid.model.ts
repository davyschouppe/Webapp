import { Player } from "./player/player.model";

export class Raid {
    private _id: string;
    private _pokemon: string;
    private _location: string;
    private _hour: number;
    private _min: number;
    private _players = new Array<Player>();
    private _ndex: string;
    private _created: string;
    private _creator: string;
  
    constructor(pokemon: string, location: string, hour: number, min: number) {
      this._pokemon = pokemon;
      this._location = location;
      this._hour = hour;
      this._min = min;
    }
    get id() : string {
      return this._id;
    }
    get pokemon() : string {
      return this._pokemon;
    }
    get location() : string {
        return this._location;
    }
    get hour() : number {
      return this._hour;
    }
    get min() : number {
      return this._min;
    }
    get created() : string {
      return this._created.toString();
    }
    get creator() : string {
      return this._creator;
    }
    set creator(c : string){
      this._creator=c;
    }
    get players() : Player[] {
        return this._players;
    }		
    set players(players: Player[]){
      this._players = players;
    }
    addPlayer(player: Player) {
      this._players.push(player);
    }
    get ndex(): string{
      return this._ndex;
    }
    set ndex(n: string){
      this._ndex=n;
    }

    static fromJSON(json) : Raid{
        const raid = new Raid(json.pokemon,json.location,json.hour,json.min);
        for(let player of json.players) {
          raid.addPlayer(Player.fromJSON(player));
        }
        raid._id=json._id;
        raid._ndex=json.ndex;
        let datetime: string = json.created_at;
        raid._created = datetime.substr(0,datetime.indexOf('T'));
        raid._creator = json.creator;
        return raid;
    }
    toJSON() {
      return {
        _id: this._id,
        pokemon: this._pokemon,
        location: this._location,
        hour: this._hour,
        min: this._min,
        players: this._players,
        ndex: this._ndex,
        creator: this._creator
      };
    }

    getImage() : string{
      return `http://files.pokefans.net/images/pokemon-go/modelle/${this._ndex}.png`
    }

    getTime(): string{
      let h = this.hour.toString();
      let m = this.min.toString();
      if (h.length === 1){
        h = "0"+h;
      }
      if (m.length === 1){
        m = "0"+m;
      }
      return h+":"+m;
    }
  }
  export class Pokemon{
    constructor(public ndex: string, public name: string){}
    static fromJSON(json) : Pokemon{return new Pokemon(json.ndex,json.name);}
    namestoJSON() {
       return {
         title: this.name
       }
    };
  }