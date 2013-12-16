var amdrequire = require("../amd.js");

var Game = amdrequire("models/game");
var Backbone = require("backbone");

var PlayerStub = Backbone.Model.extend({});


module.exports = {
    'initialize sets two player attributes': function( test ) {
       var game = new Game();

        test.ok( game.human );
        test.ok( game.computer );

        test.done();
    },
    'state is null at first': function( test ) {
        var game = new Game();
        test.equal( game.get("state"), null );

        test.done();
    },
    'start() updates state': function( test ) {
        var game = new Game();
        game.start();

        test.equal( game.get("state"), "started" );

        test.done();
    },
    'finish() with tie': function( test ) {
        var game = new Game();

        game.start();
        game.grid.set( "winner", "tie");
        game.finish();

        test.equal( game.get("state"), "tie" );

        test.done();
    },
    'finish() with winner': function( test ) {
        var game = new Game();

        game.start();
        game.grid.set( "winner", "x" );
        game.finish();

        test.equal( game.get("state"), "win" );

        test.done();
    },
    'next_move does nothing if not started': function( test ) {
        var game = new Game();
        game.human = new PlayerStub();
        game.computer = new PlayerStub();

        game.next_move();

        test.equal( game.grid.get("current_player"), null );

        test.done();
    },
    'next_move switches grid current_player': function( test ) {
        var game = new Game();
        game.human = new PlayerStub({symbol: "x"});
        game.computer = new PlayerStub({symbol: "o"});

        game.start();

        test.equal( game.grid.get("current_player"), "x" );

        game.next_move();

        test.equal( game.grid.get("current_player"), "o" );

        game.next_move();

        test.equal( game.grid.get("current_player"), "x" );

        test.done();
    },
    'next_move triggers your_move on the right player': function( test ) {
        var game = new Game();
        game.human = new PlayerStub({symbol: "x"});
        game.computer = new PlayerStub({symbol: "o"});

        game.start();

        var human_moves = 0, computer_moves = 0;

        game.human.on( "your_move", function() { human_moves += 1; } );
        game.computer.on( "your_move", function() { computer_moves += 1; } );

        game.start();

        test.equal( human_moves, 1 );
        test.equal( computer_moves, 0 );

        game.next_move();

        test.equal( human_moves, 1 );
        test.equal( computer_moves, 1 );

        game.next_move();

        test.equal( human_moves, 2 );
        test.equal( computer_moves, 1 );

        game.next_move();

        test.equal( human_moves, 2 );
        test.equal( computer_moves, 2 );

        test.done();
    },
    'setting grid winner triggers finish()': function( test ) {
        var game = new Game();

        game.start();

        game.grid.set( "winner", "x" );

        test.equal( game.get("state"), "win" );

        test.done();
    },
    'grid move_made triggers next_move()': function( test ) {
        var next_move_called = false;
        var StubbedGame = Game.extend({
            next_move: function() { next_move_called = true; }
        });

        var game = new StubbedGame();

        game.start();

        test.equal( next_move_called, false );

        game.grid.trigger( "move_made" );

        test.equal( next_move_called, true );

        test.done();
    }
};
