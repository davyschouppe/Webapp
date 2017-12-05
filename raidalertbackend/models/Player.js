let mongoose = require('mongoose');

let PlayerSchema = new mongoose.Schema({
    name: String,
    team: String
});
mongoose.model('Player', PlayerSchema);