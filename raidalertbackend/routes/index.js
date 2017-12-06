
var express = require('express');
var router = express.Router();

let mongoose = require('mongoose');
let Raid = mongoose.model('Raid');
let User = mongoose.model('User');
let Player = mongoose.model('Player');

let jwt = require('express-jwt');
let passport = require('passport');

let auth = jwt({secret: process.env.RAID_BACKEND_SECRET, userProperty: 'payload'});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/API/raids/:user', auth,function(req, res, next) {
  let tags = req.user.tags;
  let query = Raid.find().sort({created_at: -1}).populate('players');
  query.exec((err, raids) => {
    if (err) return next(err);
    if(tags.indexOf('*')>=0){
      res.json(raids);
    }
    else{
      let filtered = new Array();
      for(let i = 0; i< raids.length;i++){
        for(let j = 0;j< tags.length;j++){
          let regex = new RegExp(tags[j].trim(), 'i');
          if(regex.test(raids[i].location.toLowerCase())){
            filtered.push(raids[i]);
            break;
          }
        }
      }
      res.json(filtered);
    }
    /**/   
  })
});

router.post('/API/raids/', auth,function (req, res, next) {
  let raid = new Raid({
    pokemon: req.body.pokemon,
    location: req.body.location,
    hour: req.body.hour,
    min: req.body.min,
    ndex: req.body.ndex,
    creator: req.body.creator
  });
  raid.save(function(err, rd) {
    if (err){ return next(err); }
    res.json(rd);
  });
}); 

router.param('raid', function(req, res, next, id) {
  let query = Raid.findById(id).populate('players');
  query.exec(function (err, raid){
    if (err) { return next(err); }
    if (!raid) { return next(new Error('not found ' + id)); }
    req.raid = raid;
    return next();
  });
});

router.get('/API/raid/:raid', auth,function(req, res) {
  res.json(req.raid);
});

router.delete('/API/raid/:raid', auth,function(req, res, next) {
  Player.remove({ _id: {$in: req.raid.players }}, 
    function (err) {
      if (err) return next(err);
      req.raid.remove(function(err) {
        if (err) { return next(err); }   
        res.json(req.raid);
      });
  })
});

router.post('/API/raid/:raid/players', auth,function(req, res, next) {
  let player = new Player(req.body);

  player.save(function(err, player) {
    if (err) return next(err);

    req.raid.players.push(player);
    req.raid.save(function(err, rec) {
      if (err) return next(err);
      res.json(player);
    })
  });
});

router.param('player', function(req, res, next, id) {
  let query = Player.findById(id);
  query.exec(function (err, player){
    if (err) { return next(err); }
    if (!player) { return next(new Error('not found ' + id)); }
    req.player = player;
    return next();
  });
});

router.delete('/API/player/:player', auth, function(req, res, next) {
  req.player.remove(function(err) {
    if (err) { return next(err); }   
    res.json("removed player");
  });
})

router.post('/API/users/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.team){
      return res.status(400).json(
        {message: 'Please fill out all fields'});
  }
  var user = new User();
  user.username = req.body.username;
  user.team = req.body.team;
  user.setPassword(req.body.password);
  user.save(function (err){
      if(err){ return next(err); }
      return res.json({token: user.generateJWT(), team: user.team, id: user._id})
  });
});

router.post('/API/users/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
      return res.status(400).json(
        {message: 'Please fill out all fields'});
  }
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }
    if(user){
      return res.json({token: user.generateJWT(), team: user.team, id: user._id});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/API/users/checkusername', function(req, res, next) {
  User.find({username: req.body.username}, 
    function(err, result) {
      if (result.length) {
        res.json({'username': 'alreadyexists'})
      } else {
        res.json({'username': 'ok'})
      }
  });
});

router.param('user', function(req, res, next, id) {
  let query = User.findById(id);
  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('not found ' + id)); }
    req.user = user;
    return next();
  });
});

router.get('/API/user/:user/tags', auth, function(req, res, next) {
  res.json(req.user.tags);
});

router.post('/API/user/:user/tags', auth, function(req, res, next) {
  req.user.tags.push(req.body.tag);
  req.user.save(function(err, user) {
    if (err) return next(err);
    res.json("tag added");
  })
});

router.put('/API/user/:user/tags', auth, function(req, res, next) {
  let tag = req.body.tag;
  req.user.tags.splice(req.user.tags.indexOf(tag),1);
  req.user.save(function(err, user) {
    if (err) return next(err);
    res.json("tag removed");
  })
})


router.get('/API/pokemon/',function(req, res, next) {
  res.json([
    {'ndex':'001','name':'Bulbasaur'},
    {'ndex':'002','name':'Ivysaur'},
    {'ndex':'003','name':'Venusaur'},
    {'ndex':'004','name':'Charmander'},
    {'ndex':'005','name':'Charmeleon'},
    {'ndex':'006','name':'Charizard'},
    {'ndex':'007','name':'Squirtle'},
    {'ndex':'008','name':'Wartortle'},
    {'ndex':'009','name':'Blastoise'},
    {'ndex':'010','name':'Caterpie'},
    {'ndex':'011','name':'Metapod'},
    {'ndex':'012','name':'Butterfree'},
    {'ndex':'013','name':'Weedle'},
    {'ndex':'014','name':'Kakuna'},
    {'ndex':'015','name':'Beedrill'},
    {'ndex':'016','name':'Pidgey'},
    {'ndex':'017','name':'Pidgeotto'},
    {'ndex':'018','name':'Pidgeot'},
    {'ndex':'019','name':'Rattata'},
    {'ndex':'020','name':'Raticate'},
    {'ndex':'021','name':'Spearow'},
    {'ndex':'022','name':'Fearow'},
    {'ndex':'023','name':'Ekans'},
    {'ndex':'024','name':'Arbok'},
    {'ndex':'025','name':'Pikachu'},
    {'ndex':'026','name':'Raichu'},
    {'ndex':'027','name':'Sandshrew'},
    {'ndex':'028','name':'Sandslash'},
    {'ndex':'029','name':'Nidoran♀'},
    {'ndex':'030','name':'Nidorina'},
    {'ndex':'031','name':'Nidoqueen'},
    {'ndex':'032','name':'Nidoran♂'},
    {'ndex':'033','name':'Nidorino'},
    {'ndex':'034','name':'Nidoking'},
    {'ndex':'035','name':'Clefairy'},
    {'ndex':'036','name':'Clefable'},
    {'ndex':'037','name':'Vulpix'},
    {'ndex':'038','name':'Ninetales'},
    {'ndex':'039','name':'Jigglypuff'},
    {'ndex':'040','name':'Wigglytuff'},
    {'ndex':'041','name':'Zubat'},
    {'ndex':'042','name':'Golbat'},
    {'ndex':'043','name':'Oddish'},
    {'ndex':'044','name':'Gloom'},
    {'ndex':'045','name':'Vileplume'},
    {'ndex':'046','name':'Paras'},
    {'ndex':'047','name':'Parasect'},
    {'ndex':'048','name':'Venonat'},
    {'ndex':'049','name':'Venomoth'},
    {'ndex':'050','name':'Diglett'},
    {'ndex':'051','name':'Dugtrio'},
    {'ndex':'052','name':'Meowth'},
    {'ndex':'053','name':'Persian'},
    {'ndex':'054','name':'Psyduck'},
    {'ndex':'055','name':'Golduck'},
    {'ndex':'056','name':'Mankey'},
    {'ndex':'057','name':'Primeape'},
    {'ndex':'058','name':'Growlithe'},
    {'ndex':'059','name':'Arcanine'},
    {'ndex':'060','name':'Poliwag'},
    {'ndex':'061','name':'Poliwhirl'},
    {'ndex':'062','name':'Poliwrath'},
    {'ndex':'063','name':'Abra'},
    {'ndex':'064','name':'Kadabra'},
    {'ndex':'065','name':'Alakazam'},
    {'ndex':'066','name':'Machop'},
    {'ndex':'067','name':'Machoke'},
    {'ndex':'068','name':'Machamp'},
    {'ndex':'069','name':'Bellsprout'},
    {'ndex':'070','name':'Weepinbell'},
    {'ndex':'071','name':'Victreebel'},
    {'ndex':'072','name':'Tentacool'},
    {'ndex':'073','name':'Tentacruel'},
    {'ndex':'074','name':'Geodude'},
    {'ndex':'075','name':'Graveler'},
    {'ndex':'076','name':'Golem'},
    {'ndex':'077','name':'Ponyta'},
    {'ndex':'078','name':'Rapidash'},
    {'ndex':'079','name':'Slowpoke'},
    {'ndex':'080','name':'Slowbro'},
    {'ndex':'081','name':'Magnemite'},
    {'ndex':'082','name':'Magneton'},
    {'ndex':'083','name':'Farfetch\'d'},
    {'ndex':'084','name':'Doduo'},
    {'ndex':'085','name':'Dodrio'},
    {'ndex':'086','name':'Seel'},
    {'ndex':'087','name':'Dewgong'},
    {'ndex':'088','name':'Grimer'},
    {'ndex':'089','name':'Muk'},
    {'ndex':'090','name':'Shellder'},
    {'ndex':'091','name':'Cloyster'},
    {'ndex':'092','name':'Gastly'},
    {'ndex':'093','name':'Haunter'},
    {'ndex':'094','name':'Gengar'},
    {'ndex':'095','name':'Onix'},
    {'ndex':'096','name':'Drowzee'},
    {'ndex':'097','name':'Hypno'},
    {'ndex':'098','name':'Krabby'},
    {'ndex':'099','name':'Kingler'},
    {'ndex':'100','name':'Voltorb'},
    {'ndex':'101','name':'Electrode'},
    {'ndex':'102','name':'Exeggcute'},
    {'ndex':'103','name':'Exeggutor'},
    {'ndex':'104','name':'Cubone'},
    {'ndex':'105','name':'Marowak'},
    {'ndex':'106','name':'Hitmonlee'},
    {'ndex':'107','name':'Hitmonchan'},
    {'ndex':'108','name':'Lickitung'},
    {'ndex':'109','name':'Koffing'},
    {'ndex':'110','name':'Weezing'},
    {'ndex':'111','name':'Rhyhorn'},
    {'ndex':'112','name':'Rhydon'},
    {'ndex':'113','name':'Chansey'},
    {'ndex':'114','name':'Tangela'},
    {'ndex':'115','name':'Kangaskhan'},
    {'ndex':'116','name':'Horsea'},
    {'ndex':'117','name':'Seadra'},
    {'ndex':'118','name':'Goldeen'},
    {'ndex':'119','name':'Seaking'},
    {'ndex':'120','name':'Staryu'},
    {'ndex':'121','name':'Starmie'},
    {'ndex':'122','name':'Mr. Mime'},
    {'ndex':'123','name':'Scyther'},
    {'ndex':'124','name':'Jynx'},
    {'ndex':'125','name':'Electabuzz'},
    {'ndex':'126','name':'Magmar'},
    {'ndex':'127','name':'Pinsir'},
    {'ndex':'128','name':'Tauros'},
    {'ndex':'129','name':'Magikarp'},
    {'ndex':'130','name':'Gyarados'},
    {'ndex':'131','name':'Lapras'},
    {'ndex':'132','name':'Ditto'},
    {'ndex':'133','name':'Eevee'},
    {'ndex':'134','name':'Vaporeon'},
    {'ndex':'135','name':'Jolteon'},
    {'ndex':'136','name':'Flareon'},
    {'ndex':'137','name':'Porygon'},
    {'ndex':'138','name':'Omanyte'},
    {'ndex':'139','name':'Omastar'},
    {'ndex':'140','name':'Kabuto'},
    {'ndex':'141','name':'Kabutops'},
    {'ndex':'142','name':'Aerodactyl'},
    {'ndex':'143','name':'Snorlax'},
    {'ndex':'144','name':'Articuno'},
    {'ndex':'145','name':'Zapdos'},
    {'ndex':'146','name':'Moltres'},
    {'ndex':'147','name':'Dratini'},
    {'ndex':'148','name':'Dragonair'},
    {'ndex':'149','name':'Dragonite'},
    {'ndex':'150','name':'Mewtwo'},
    {'ndex':'151','name':'Mew'},
    {'ndex':'152','name':'Chikorita'},
    {'ndex':'153','name':'Bayleef'},
    {'ndex':'154','name':'Meganium'},
    {'ndex':'155','name':'Cyndaquil'},
    {'ndex':'156','name':'Quilava'},
    {'ndex':'157','name':'Typhlosion'},
    {'ndex':'158','name':'Totodile'},
    {'ndex':'159','name':'Croconaw'},
    {'ndex':'160','name':'Feraligatr'},
    {'ndex':'161','name':'Sentret'},
    {'ndex':'162','name':'Furret'},
    {'ndex':'163','name':'Hoothoot'},
    {'ndex':'164','name':'Noctowl'},
    {'ndex':'165','name':'Ledyba'},
    {'ndex':'166','name':'Ledian'},
    {'ndex':'167','name':'Spinarak'},
    {'ndex':'168','name':'Ariados'},
    {'ndex':'169','name':'Crobat'},
    {'ndex':'170','name':'Chinchou'},
    {'ndex':'171','name':'Lanturn'},
    {'ndex':'172','name':'Pichu'},
    {'ndex':'173','name':'Cleffa'},
    {'ndex':'174','name':'Igglybuff'},
    {'ndex':'175','name':'Togepi'},
    {'ndex':'176','name':'Togetic'},
    {'ndex':'177','name':'Natu'},
    {'ndex':'178','name':'Xatu'},
    {'ndex':'179','name':'Mareep'},
    {'ndex':'180','name':'Flaaffy'},
    {'ndex':'181','name':'Ampharos'},
    {'ndex':'182','name':'Bellossom'},
    {'ndex':'183','name':'Marill'},
    {'ndex':'184','name':'Azumarill'},
    {'ndex':'185','name':'Sudowoodo'},
    {'ndex':'186','name':'Politoed'},
    {'ndex':'187','name':'Hoppip'},
    {'ndex':'188','name':'Skiploom'},
    {'ndex':'189','name':'Jumpluff'},
    {'ndex':'190','name':'Aipom'},
    {'ndex':'191','name':'Sunkern'},
    {'ndex':'192','name':'Sunflora'},
    {'ndex':'193','name':'Yanma'},
    {'ndex':'194','name':'Wooper'},
    {'ndex':'195','name':'Quagsire'},
    {'ndex':'196','name':'Espeon'},
    {'ndex':'197','name':'Umbreon'},
    {'ndex':'198','name':'Murkrow'},
    {'ndex':'199','name':'Slowking'},
    {'ndex':'200','name':'Misdreavus'},
    {'ndex':'201','name':'Unown'},
    {'ndex':'202','name':'Wobbuffet'},
    {'ndex':'203','name':'Girafarig'},
    {'ndex':'204','name':'Pineco'},
    {'ndex':'205','name':'Forretress'},
    {'ndex':'206','name':'Dunsparce'},
    {'ndex':'207','name':'Gligar'},
    {'ndex':'208','name':'Steelix'},
    {'ndex':'209','name':'Snubbull'},
    {'ndex':'210','name':'Granbull'},
    {'ndex':'211','name':'Qwilfish'},
    {'ndex':'212','name':'Scizor'},
    {'ndex':'213','name':'Shuckle'},
    {'ndex':'214','name':'Heracross'},
    {'ndex':'215','name':'Sneasel'},
    {'ndex':'216','name':'Teddiursa'},
    {'ndex':'217','name':'Ursaring'},
    {'ndex':'218','name':'Slugma'},
    {'ndex':'219','name':'Magcargo'},
    {'ndex':'220','name':'Swinub'},
    {'ndex':'221','name':'Piloswine'},
    {'ndex':'222','name':'Corsola'},
    {'ndex':'223','name':'Remoraid'},
    {'ndex':'224','name':'Octillery'},
    {'ndex':'225','name':'Delibird'},
    {'ndex':'226','name':'Mantine'},
    {'ndex':'227','name':'Skarmory'},
    {'ndex':'228','name':'Houndour'},
    {'ndex':'229','name':'Houndoom'},
    {'ndex':'230','name':'Kingdra'},
    {'ndex':'231','name':'Phanpy'},
    {'ndex':'232','name':'Donphan'},
    {'ndex':'233','name':'Porygon2'},
    {'ndex':'234','name':'Stantler'},
    {'ndex':'235','name':'Smeargle'},
    {'ndex':'236','name':'Tyrogue'},
    {'ndex':'237','name':'Hitmontop'},
    {'ndex':'238','name':'Smoochum'},
    {'ndex':'239','name':'Elekid'},
    {'ndex':'240','name':'Magby'},
    {'ndex':'241','name':'Miltank'},
    {'ndex':'242','name':'Blissey'},
    {'ndex':'243','name':'Raikou'},
    {'ndex':'244','name':'Entei'},
    {'ndex':'245','name':'Suicune'},
    {'ndex':'246','name':'Larvitar'},
    {'ndex':'247','name':'Pupitar'},
    {'ndex':'248','name':'Tyranitar'},
    {'ndex':'249','name':'Lugia'},
    {'ndex':'250','name':'Ho-Oh'},
    {'ndex':'251','name':'Celebi'},
    {'ndex':'252','name':'Treecko'},
    {'ndex':'253','name':'Grovyle'},
    {'ndex':'254','name':'Sceptile'},
    {'ndex':'255','name':'Torchic'},
    {'ndex':'256','name':'Combusken'},
    {'ndex':'257','name':'Blaziken'},
    {'ndex':'258','name':'Mudkip'},
    {'ndex':'259','name':'Marshtomp'},
    {'ndex':'260','name':'Swampert'},
    {'ndex':'261','name':'Poochyena'},
    {'ndex':'262','name':'Mightyena'},
    {'ndex':'263','name':'Zigzagoon'},
    {'ndex':'264','name':'Linoone'},
    {'ndex':'265','name':'Wurmple'},
    {'ndex':'266','name':'Silcoon'},
    {'ndex':'267','name':'Beautifly'},
    {'ndex':'268','name':'Cascoon'},
    {'ndex':'269','name':'Dustox'},
    {'ndex':'270','name':'Lotad'},
    {'ndex':'271','name':'Lombre'},
    {'ndex':'272','name':'Ludicolo'},
    {'ndex':'273','name':'Seedot'},
    {'ndex':'274','name':'Nuzleaf'},
    {'ndex':'275','name':'Shiftry'},
    {'ndex':'276','name':'Taillow'},
    {'ndex':'277','name':'Swellow'},
    {'ndex':'278','name':'Wingull'},
    {'ndex':'279','name':'Pelipper'},
    {'ndex':'280','name':'Ralts'},
    {'ndex':'281','name':'Kirlia'},
    {'ndex':'282','name':'Gardevoir'},
    {'ndex':'283','name':'Surskit'},
    {'ndex':'284','name':'Masquerain'},
    {'ndex':'285','name':'Shroomish'},
    {'ndex':'286','name':'Breloom'},
    {'ndex':'287','name':'Slakoth'},
    {'ndex':'288','name':'Vigoroth'},
    {'ndex':'289','name':'Slaking'},
    {'ndex':'290','name':'Nincada'},
    {'ndex':'291','name':'Ninjask'},
    {'ndex':'292','name':'Shedinja'},
    {'ndex':'293','name':'Whismur'},
    {'ndex':'294','name':'Loudred'},
    {'ndex':'295','name':'Exploud'},
    {'ndex':'296','name':'Makuhita'},
    {'ndex':'297','name':'Hariyama'},
    {'ndex':'298','name':'Azurill'},
    {'ndex':'299','name':'Nosepass'},
    {'ndex':'300','name':'Skitty'},
    {'ndex':'301','name':'Delcatty'},
    {'ndex':'302','name':'Sableye'},
    {'ndex':'303','name':'Mawile'},
    {'ndex':'304','name':'Aron'},
    {'ndex':'305','name':'Lairon'},
    {'ndex':'306','name':'Aggron'},
    {'ndex':'307','name':'Meditite'},
    {'ndex':'308','name':'Medicham'},
    {'ndex':'309','name':'Electrike'},
    {'ndex':'310','name':'Manectric'},
    {'ndex':'311','name':'Plusle'},
    {'ndex':'312','name':'Minun'},
    {'ndex':'313','name':'Volbeat'},
    {'ndex':'314','name':'Illumise'},
    {'ndex':'315','name':'Roselia'},
    {'ndex':'316','name':'Gulpin'},
    {'ndex':'317','name':'Swalot'},
    {'ndex':'318','name':'Carvanha'},
    {'ndex':'319','name':'Sharpedo'},
    {'ndex':'320','name':'Wailmer'},
    {'ndex':'321','name':'Wailord'},
    {'ndex':'322','name':'Numel'},
    {'ndex':'323','name':'Camerupt'},
    {'ndex':'324','name':'Torkoal'},
    {'ndex':'325','name':'Spoink'},
    {'ndex':'326','name':'Grumpig'},
    {'ndex':'327','name':'Spinda'},
    {'ndex':'328','name':'Trapinch'},
    {'ndex':'329','name':'Vibrava'},
    {'ndex':'330','name':'Flygon'},
    {'ndex':'331','name':'Cacnea'},
    {'ndex':'332','name':'Cacturne'},
    {'ndex':'333','name':'Swablu'},
    {'ndex':'334','name':'Altaria'},
    {'ndex':'335','name':'Zangoose'},
    {'ndex':'336','name':'Seviper'},
    {'ndex':'337','name':'Lunatone'},
    {'ndex':'338','name':'Solrock'},
    {'ndex':'339','name':'Barboach'},
    {'ndex':'340','name':'Whiscash'},
    {'ndex':'341','name':'Corphish'},
    {'ndex':'342','name':'Crawdaunt'},
    {'ndex':'343','name':'Baltoy'},
    {'ndex':'344','name':'Claydol'},
    {'ndex':'345','name':'Lileep'},
    {'ndex':'346','name':'Cradily'},
    {'ndex':'347','name':'Anorith'},
    {'ndex':'348','name':'Armaldo'},
    {'ndex':'349','name':'Feebas'},
    {'ndex':'350','name':'Milotic'},
    {'ndex':'351','name':'Castform'},
    {'ndex':'352','name':'Kecleon'},
    {'ndex':'353','name':'Shuppet'},
    {'ndex':'354','name':'Banette'},
    {'ndex':'355','name':'Duskull'},
    {'ndex':'356','name':'Dusclops'},
    {'ndex':'357','name':'Tropius'},
    {'ndex':'358','name':'Chimecho'},
    {'ndex':'359','name':'Absol'},
    {'ndex':'360','name':'Wynaut'},
    {'ndex':'361','name':'Snorunt'},
    {'ndex':'362','name':'Glalie'},
    {'ndex':'363','name':'Spheal'},
    {'ndex':'364','name':'Sealeo'},
    {'ndex':'365','name':'Walrein'},
    {'ndex':'366','name':'Clamperl'},
    {'ndex':'367','name':'Huntail'},
    {'ndex':'368','name':'Gorebyss'},
    {'ndex':'369','name':'Relicanth'},
    {'ndex':'370','name':'Luvdisc'},
    {'ndex':'371','name':'Bagon'},
    {'ndex':'372','name':'Shelgon'},
    {'ndex':'373','name':'Salamence'},
    {'ndex':'374','name':'Beldum'},
    {'ndex':'375','name':'Metang'},
    {'ndex':'376','name':'Metagross'},
    {'ndex':'377','name':'Regirock'},
    {'ndex':'378','name':'Regice'},
    {'ndex':'379','name':'Registeel'},
    {'ndex':'380','name':'Latias'},
    {'ndex':'381','name':'Latios'},
    {'ndex':'382','name':'Kyogre'},
    {'ndex':'383','name':'Groudon'},
    {'ndex':'384','name':'Rayquaza'},
    {'ndex':'385','name':'Jirachi'},
    {'ndex':'386','name':'Deoxys'}
  ]);
});

module.exports = router;
