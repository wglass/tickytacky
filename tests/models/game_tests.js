var amdrequire = require("../amd.js");

var Game = amdrequire("models/game");

module.exports = {
    'basic initialization': function( test ) {
        var game = new Game();
        test.equal(game.get("state"), "started");

        test.done();
    }
};
