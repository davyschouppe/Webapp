var mongoose = require('mongoose');

let RaidSchema = new mongoose.Schema({
    pokemon: String,
    location: String,
    hour: Number,
    min: Number,
    players: [{type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player'}],
    ndex: String,
    creator: String
},{ timestamps: { createdAt: 'created_at' } });	
mongoose.model('Raid', RaidSchema);