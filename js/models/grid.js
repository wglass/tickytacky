define(
    ["backbone"],
    function( Backbone ) {
        var Grid = Backbone.Model.extend({
            defaults: {
                "winner": null,
                "current_player": null,
                "move_count": 0,
                "last_move": null
            },
            initialize: function() {
                this.values = [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ];
            },
            place_symbol: function( x, y, symbol ) {
                if ( symbol !== this.get("current_player") ) {
                    return;
                }
                if ( this.values[y][x] !== null ) {
                    return;
                }

                this.values[y][x] = symbol;

                this.analyze_values();

                this.set( "move_count", this.get("move_count") + 1 );
                this.set( "last_move", {x: x, y: y} );

                this.trigger( "move_made", x, y, symbol );
            },
            corners: function() {
                return [
                    {x: 0, y: 0},
                    {x: 0, y: 2},
                    {x: 2, y: 0},
                    {x: 2, y: 2}
                ];
            },
            sides: function() {
                return [
                    {x: 0, y: 1},
                    {x: 1, y: 0},
                    {x: 1, y: 2},
                    {x: 2, y: 1}
                ];
            },
            last_move_was_center: function() {
                var last_move = this.get("last_move");
                return last_move.x === 1 && last_move.y === 1;
            },
            last_move_was_corner: function() {
                return this.is_corner_move( this.get("last_move") );
            },
            last_move_was_side: function() {
                return this.is_side_move( this.get("last_move") );
            },
            is_side_move: function( move ) {
                return this.sides().some( function( side ) {
                    return side.x == move.x && side.y == move.y;
                });
            },
            is_corner_move: function( move ) {
                return this.corners().some( function( corner ) {
                    return corner.x == move.x && corner.y == move.y;
                });
            },
            analyze_values: function() {
                var winning_path = null;
                var paths_in_play = 0;

                this.paths().forEach( function( path ) {
                    if (
                        path[0] &&
                        path[0] === path[1] &&
                        path[1] === path[2]
                    ) {
                        winning_path = path;
                    }
                    if (
                        path.indexOf("x") === -1 ||
                        path.indexOf("o") === -1
                    ) {
                        paths_in_play += 1;
                    }
                });

                if ( winning_path ) {
                    this.set( "winner", winning_path[0] );
                    return;
                }

                if ( paths_in_play === 0 ) {
                    this.set( "winner", "tie" );
                }
            },
            paths: function() {
                var self = this;
                return this.path_coordinates().map(function( coordinates ) {
                    return coordinates.map(function ( coordinate ) {
                        return self.values[coordinate.y][coordinate.x];
                    });
                });
            },
            path_coordinates: function() {
                return [
                    /* rows */
                    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
                    [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
                    [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}],
                    /* columns */
                    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
                    [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
                    [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}],
                    /* diagonals */
                    [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
                    [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}]
                ];
            }
        });

        return Grid;
    }
);
