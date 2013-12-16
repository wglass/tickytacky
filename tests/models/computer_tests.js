var amdrequire = require("../amd.js");

var Backbone = require("backbone");

var Computer = amdrequire("models/computer");
var Grid = amdrequire("models/grid");


var StubbedComputer = Computer.extend({
    initialize: function() {
        this.moves_made = [];
    },
    win: function() { this.moves_made.push("win"); return null; },
    block_win: function() { this.moves_made.push("block_win"); return null; },
    fork: function() { this.moves_made.push("fork"); return null; },
    block_fork: function() { this.moves_made.push("block_fork"); return null; },
    center: function() { this.moves_made.push("center"); return null; },
    opposite_corner: function() {
        this.moves_made.push("opposite"); return null;
    },
    empty_corner: function() {
        this.moves_made.push("corner"); return null;
    },
    empty_side: function() {
        this.moves_made.push("side"); return null;
    }
});


module.exports = {
    'first move: center taken if not already': function( test ) {
        var computer = new StubbedComputer({"symbol": "o"});
        var grid = new Grid();

        grid.set( "last_move", {x: 0, y: 2} );
        grid.set( "move_count", 1 );

        computer.make_move( grid );

        test.deepEqual( computer.moves_made, ["center"] );

        test.done();
    },
    'first move: corner taken if center taken': function( test ) {
        var computer = new StubbedComputer({"symbol": "o"});
        var grid = new Grid();

        grid.set( "last_move", {x: 1, y: 1} );
        grid.set( "move_count", 1 );

        computer.make_move( grid );

        test.deepEqual( computer.moves_made, ["corner"] );

        test.done();
    },
    'second move: blocks win or takes corner if no center': function( test ) {
        var computer = new StubbedComputer({"symbol": "o"});
        var grid = new Grid();

        grid.place_symbol( 1, 1, "x" );
        grid.set( "last_move", {x: 2, y: 1} );
        grid.set( "move_count", 3 );

        computer.make_move( grid );

        test.deepEqual( computer.moves_made, ["block_win", "corner"] );

        test.done();
    },
    'second move: blocks win or takes side if center': function( test ) {
        var computer = new StubbedComputer({"symbol": "o"});
        var grid = new Grid();

        grid.values[1][1] = computer.get("symbol");
        grid.set( "last_move", {x: 2, y: 0} );
        grid.set( "move_count", 3 );

        computer.make_move( grid );

        test.deepEqual( computer.moves_made, ["block_win", "side"] );

        test.done();
    },
    'highest priority move is made': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        var place_symbol_call = null;
        grid.place_symbol = function() { place_symbol_call = arguments; };

        var moves_made = [];
        computer.block_fork = function() { moves_made.push( "block_fork" ); };
        computer.block_win = function() { moves_made.push( "block_win" ); };

        computer.center = function() { return {x: 1, y: 1}; };

        computer.empty_corner = function() { moves_made.push( "corner" ); };
        computer.empty_side = function() { return {x: 0, y: 1}; };
        computer.fork = function() { moves_made.push( "fork" ); };
        computer.opposite_corner = function() { moves_made.push( "opposite" ); };
        computer.win = function() { moves_made.push( "win" ); };

        computer.make_move( grid );

        test.equal( place_symbol_call[0], 1 );
        test.equal( place_symbol_call[1], 1 );
        test.equal( place_symbol_call[2], "o" );

        test.done();
    },
    'win() finds winning move': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            ["x", null, null],
            [null, "o", "x"],
            ["o", "x", null]
        ];

        test.deepEqual(
            computer.win( grid ),
            {x: 2, y: 0}
        );

        test.done();
    },
    'win() returns null if no winning move': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            ["x", null, "x"],
            [null, "o", "x"],
            ["o", null, null]
        ];

        test.equal( computer.win( grid ), null );

        test.done();
    },
    'block_win() blocks opponent win': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            ["x", "o", null],
            [null, "x", "o"],
            ["o", null, null]
        ];

        test.deepEqual(
            computer.block_win( grid ),
            {x: 2, y: 2}
        );

        test.done();
    },
    'block_win() returns null if no move': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            ["x", null, "x"],
            [null, "o", "x"],
            ["o", null, null]
        ];

        test.equal( computer.block_win( grid ), null );

        test.done();
    },
    'fork() returns null if no fork move': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            ["x", null, "x"],
            [null, "o", "x"],
            ["o", null, null]
        ];

        test.equal( computer.fork( grid ), null );

        test.done();
    },
    'fork() finds forking moves with center': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            [null, null, "x"],
            [null, "o", "x"],
            ["o", null, null]
        ];

        test.deepEqual( computer.fork( grid ), {x: 2, y: 2} );

        test.done();
    },
    'fork() finds forking moves in corners': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            [null, null, "x"],
            [null, null, "x"],
            ["o", null, "o"]
        ];

        test.deepEqual( computer.fork( grid ), {x: 0, y: 0} );

        test.done();
    },
    'block_fork() returns null if no fork move': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            ["x", null, "x"],
            [null, "o", "x"],
            ["o", null, null]
        ];

        test.equal( computer.block_fork( grid ), null );

        test.done();
    },
    'block_fork() blocks forking moves': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            [null, null, "x"],
            [null, "o", "x"],
            ["o", null, null]
        ];

        test.deepEqual( computer.block_fork( grid ), {x: 2, y: 2} );

        test.done();
    },
    'center() just returns center if available': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            [null, null, "x"],
            [null, null, "x"],
            [null, null, "o"]
        ];

        test.deepEqual( computer.center( grid ), {x: 1, y: 1} );

        test.done();
    },
    'center() returns null if center not available': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            [null, null, "x"],
            [null, "o", "x"],
            [null, null, "o"]
        ];

        test.equal( computer.center( grid ), null );

        test.done();
    },
    'opposite_corner() finds opposite corner moves': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            [null, null, "x"],
            [null, null, "x"],
            [null, null, "o"]
        ];

        test.deepEqual( computer.opposite_corner( grid ), {x: 0, y: 2} );

        test.done();
    },
    'opposite_corner() returns null if not available': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            ["x", null, null],
            [null, "o", "x"],
            [null, null, "o"]
        ];

        test.equal( computer.opposite_corner( grid ), null );

        test.done();
    },
    'empty_corner() finds empty corner moves': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            ["o", null, "x"],
            [null, null, "x"],
            [null, null, "o"]
        ];

        test.deepEqual( computer.empty_corner( grid ), {x: 0, y: 2} );

        test.done();
    },
    'empty_corner() returns null if not available': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            ["x", null, "o"],
            [null, "o", "x"],
            ["x", null, "o"]
        ];

        test.equal( computer.empty_corner( grid ), null );

        test.done();
    },
    'empty_side() finds empty side moves': function( test ) {
        var computer = new Computer({"symbol": "o"});
        var grid = new Grid();

        grid.values = [
            [null, "o", "x"],
            ["o", null, "x"],
            [null, null, "o"]
        ];

        test.deepEqual( computer.empty_side( grid ), {x: 1, y: 2} );

        test.done();
    },
    'empty_side() returns null if not available': function( test ) {
        var computer = new Computer({"symbol": "x"});
        var grid = new Grid();

        grid.values = [
            ["x", "o", null],
            ["o", "o", "x"],
            [null, "x", "o"]
        ];

        test.equal( computer.empty_side( grid ), null );

        test.done();
    }
};
