export class Player{
    private _id: string;
    private _name: string;
    private _team: Team;

    constructor(name: string, team: Team) {
        this._name=name;
        this._team=team;
    }

    get name() : string{
        return this._name;
    }

    get team() : Team{
        return this._team;
    }

    get id() : string{
        return this._id;
    }

    set id(id: string){
        this._id = id;
    }

    getIcon() : string{
        switch(this._team){
            case Team.Mystic:return "http://www.symbols.com/gi.php?type=1&id=3295"
            case Team.Valor:return "http://www.symbols.com/gi.php?type=1&id=3297&i=1"
            case Team.Instinct:return "http://www.symbols.com/gi.php?type=1&id=3296&i=1"
        }
    }
    static getTeam(key : string) : Team{
        return Team[key];
    }
    static getKey(value : string) : number{
        return Team[value];
    }
    static fromJSON(json) : Player{
        const player = new Player(json.name,Player.getKey(json.team));
        player._id=json._id;
        return player;
    }
    toJSON() {
      return {
        _id: this._id,
        name: this._name,
        team: this._team
      };
    }
}

export enum Team {
    Mystic,
    Valor,
    Instinct
}