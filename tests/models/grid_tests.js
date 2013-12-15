var amdrequire = require("../amd.js");

var Grid = amdrequire("models/grid");

module.exports = {
    'initialization defaults': function( test ) {
        var grid = new Grid();

        test.equal( grid.get("winner"), null );
        test.equal( grid.get("current_player"), null );

        test.done();
    },
    'values is a nested array of nulls': function( test ) {
        var grid = new Grid();

        test.deepEqual(
            grid.values,
            [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]
        );

        test.done();
    },
    'place_symbol does nothing if not correct player': function( test ) {
        var grid = new Grid();

        var move_made_triggered = false;
        grid.on( "move_made", function() { move_made_triggered = true; });

        grid.set( "current_player", "o" );

        grid.place_symbol( 0, 1, "x" );

        test.equal( move_made_triggered, false );
        test.deepEqual(
            grid.values,
            [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]
        );

        test.done();
    },
    'place_symbol updates grid values': function( test ) {
        var grid = new Grid();

        grid.set( "current_player", "x" );

        grid.place_symbol( 0, 1, "x" );

        test.deepEqual(
            grid.values,
            [
                [null, null, null],
                ["x", null, null],
                [null, null, null]
            ]
        );

        test.done();
    },
    'place_symbol triggers move_made event': function( test ) {
        var grid = new Grid();

        var move_made_triggered = false;
        grid.on( "move_made", function() { move_made_triggered = true; });

        grid.set( "current_player", "o" );

        grid.place_symbol( 0, 1, "o" );

        test.equal( move_made_triggered, true );

        test.done();
    },
    'paths() include all eight possible paths': function( test ) {
        var grid = new Grid();

        /*
         Important note: the visual representation of the grid in the
         code here is flipped on the y axis.  That is, the bottom row of
         the grid shows up above others here because it's the first row
         */
        grid.values = [
            ["a", "b", "c"],
            ["d", "e", "f"],
            ["g", "h", "i"]
        ];

        test.deepEqual(
            grid.paths(),
            [
                [ 'a', 'b', 'c' ],
                [ 'd', 'e', 'f' ],
                [ 'g', 'h', 'i' ],
                [ 'a', 'd', 'g' ],
                [ 'b', 'e', 'h' ],
                [ 'c', 'f', 'i' ],
                [ 'a', 'e', 'i' ],
                [ 'g', 'e', 'c' ]
            ]
        );

        test.done();
    },
    'analyze_values() finds winner in row': function( test ) {
        var grid = new Grid();

        grid.values = [
            [null, "x", "o"],
            ["x", "x", "x"],
            [null, "o", "o"]
        ];

        grid.analyze_values();

        test.equal( grid.get("winner"), "x" );

        test.done();
    },
    'analyze_values() finds winner in diagonal': function( test ) {
        var grid = new Grid();

        grid.values = [
            [null, "x", "o"],
            ["x", "o", "x"],
            ["o", "o", null]
        ];

        grid.analyze_values();

        test.equal( grid.get("winner"), "o" );

        test.done();
    },
    'analyze_values() finds winner in column': function( test ) {
        var grid = new Grid();

        grid.values = [
            [null, "o", "o"],
            ["x", "o", "x"],
            ["x", "o", null]
        ];

        grid.analyze_values();

        test.equal( grid.get("winner"), "o" );

        test.done();
    },
    'analyze_values() does nothing if no winner or tie': function( test ) {
        var grid = new Grid();

        grid.values = [
            [null, "o", "o"],
            ["x", null, "x"],
            ["x", "o", null]
        ];

        grid.analyze_values();

        test.equal( grid.get("winner"), null );

        test.done();
    },
    'analyze_values() finds ties': function( test ) {
        var grid = new Grid();

        grid.values = [
            ["x", "o", "x"],
            ["x", "x", "o"],
            ["o", "x", "o"]
        ];

        grid.analyze_values();

        test.equal( grid.get("winner"), "tie" );

        test.done();
    }
};
