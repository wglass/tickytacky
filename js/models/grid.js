define(
    ["backbone"],
    function( Backbone ) {
        var Grid = Backbone.Model.extend({
            defaults: {
                "winner": null,
                "current_player": null,
                "move_count": 0
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

                this.trigger( "move_made", x, y, symbol );
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
