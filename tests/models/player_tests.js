var amdrequire = require("../amd.js");

var Player = amdrequire("models/player");

module.exports = {
    'symbol is initially null': function( test ) {
        var player = new Player();

        test.equal( player.get("symbol"), null );

        test.done();
    },
    'your_move event calls make_move()': function( test ) {
        var make_move_called = false;
        var StubbedPlayer = Player.extend({
            make_move: function() { make_move_called = true; }
        });

        var player = new StubbedPlayer();

        test.equal( make_move_called, false );

        player.trigger( "your_move" );

        test.equal( make_move_called, true );

        test.done();
    },
    'make_move throws error': function( test ) {
        var player = new Player();

        test.throws( player.make_move );

        test.done();
    }
};
