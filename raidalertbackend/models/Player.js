let mongoose = require('mongoose');

let PlayerSchema = new mongoose.Schema({
    name: String,
    team: String
});

PlayerSchema.pre('remove', function (next) {
    this.model('Raid').update({}, { $pull: { players: this._id } }, { safe: true, multi: true }, next);
})
mongoose.model('Player', PlayerSchema);