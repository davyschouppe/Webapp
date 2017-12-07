
var Request = require("request");

describe("Server", () => {
    let server;
    let RaidId;
    beforeAll(() => {
        server = require("../server_test");
    });
    afterAll(() => {
    });
    //Raid toevoegen
    describe("POST /API/raids", () => {
        let data = {};
        beforeAll((done) => {
            Request(
                { method: 'POST'
                , uri: 'http://localhost:4200/API/raids'
                , json: true
                , body: {
                    pokemon: "pickachu",
                    location: "Station Aalst",
                    hour: 4,
                    min: 15,
                    ndex: "25",
                    creator: "Ash"
                  }
                }, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            }).auth(null, null, true, process.env.TEST_TOKEN);
        });
        it("status 200", () => {
            expect(data.status).toBe(200);
        });
        it("check body", () => {
            expect(data.body.pokemon).toBe("pickachu");
            expect(data.body.location).toBe("Station Aalst");
            expect(data.body.hour).toBe(4);
            expect(data.body.min).toBe(15);
            expect(data.body.ndex).toBe("25");
            expect(data.body.creator).toBe("Ash");
            expect(data.body.players.length).toBe(0);
            expect(data.body._id).toBeDefined();
            this.RaidId = data.body._id;
        });
    });
    //player toevoegen aan raid
    describe("POST /API/raid/{raid_id}/players", () => {
        let data = {};
        beforeAll((done) => {
            Request(
                { method: 'POST'
                , uri: `http://localhost:4200/API/raid/${this.RaidId}/players`
                , json: true
                , body: {
                    name: "testUser",
                    team: "Mystic"
                }
                }, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            }).auth(null, null, true, process.env.TEST_TOKEN);
        });
        it("status 200", () => {
            expect(data.status).toBe(200);
        });
        it("check body", () => {
            expect(data.body.raidId).toBe(this.RaidId);
            expect(data.body.player.name).toBe("testUser");
            expect(data.body.player.team).toBe("Mystic");
        });
    });
    //testen of na het verwijderen van een raid de speler ook verwijderd worden
    describe("DELETE /API/raid", () => {
        var data = {};
        beforeAll((done) => {
            Request.delete(`http://localhost:4200/API/raid/${this.RaidId}`, (error, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            }).auth(null, null, true, process.env.TEST_TOKEN);
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("Check if players where removed", () => {
            expect(data.body.count).toBe(0);
        });
    });
});
