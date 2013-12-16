var amdrequire = require("../amd.js");

var Player = amdrequire("models/player");

module.exports = {
    'symbol is initially null': function( test ) {
        var player = new Player();

        test.equal( player.get("symbol"), null );

        test.done();
    },
    'opponent returns the opposite symol': function( test ) {
        var player = new Player({'symbol': 'o'});

        test.equal( player.opponent(), "x" );

        player.set( "symbol", "x" );

        test.equal( player.opponent(), "o" );

        test.done();
    }
};
