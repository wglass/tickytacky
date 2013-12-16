define(
    ["underscore", "models/player"],
    function( _, Player ) {

        var Computer = Player.extend({
            initialize: function() {
                this.on( "your_move", this.make_move, this );
            },
            make_move: function( grid ) {
                var self = this;

                var moves_by_priority = [];

                // The first move is a special case.  If the opposing player
                // chose the center move, we choose a corner.  If the other
                // player chose a side or corner, we take the center.
                if ( grid.get("move_count") === 1 ) {
                    if ( grid.last_move_was_center() ) {
                        moves_by_priority = [
                            this.empty_corner
                        ];
                    } else {
                        moves_by_priority = [
                            this.center
                        ];
                    }
                } else {
                    // After the first move, we go through a priority list of moves,
                    // as enumerated here:
                    //
                    //  http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
                    moves_by_priority = [
                        this.win,
                        this.block_win,
                        this.fork,
                        this.block_fork,
                        this.center,
                        this.opposite_corner,
                        this.empty_corner,
                        this.empty_side
                    ];
                }

                // Go through each move by priority, making the first
                // available move.
                moves_by_priority.some( function( potential_move ) {
                    var move = _.bind(potential_move, self, grid )();
                    if ( move ) {
                        grid.place_symbol( move.x, move.y, self.get("symbol") );
                        return true;
                    }

                    return false;
                });
            },
            win_for: function( grid, symbol ) {
                var winning_move = null;

                var path_coordinates = grid.path_coordinates();

                // To find a winning move for a given symbol, we iterate over
                // each of the eight possible paths in a grid and check if there's
                // two of the symbol and one blank cell.
                grid.paths().forEach( function( path, index ) {
                    if ( _.isEqual( path, [symbol, symbol, null] ) ) {
                        winning_move = path_coordinates[index][2];
                    } else if ( _.isEqual( path, [symbol, null, symbol] ) ) {
                        winning_move = path_coordinates[index][1];
                    } else if ( _.isEqual( path, [null, symbol, symbol] ) ) {
                        winning_move = path_coordinates[index][0];
                    }
                });

                return winning_move;
            },
            fork_for: function( grid, symbol ) {
                // Fork moves are the most complicated.  A fork move is any move
                // that creates two possible winning *next* moves.
                var path_coordinates = grid.path_coordinates();

                // To keep track of possible fork moves we'll use a nested mapping
                // object so we can keep coordinates unique.
                var potential_moves = {};

                var add_potential_move = function( move ) {
                    if ( potential_moves[move.x] === undefined ) {
                        potential_moves[move.x] = {};
                    }
                    if ( potential_moves[move.x][move.y] === undefined ) {
                        potential_moves[move.x][move.y] = 0;
                    }

                    potential_moves[move.x][move.y] += 1;
                };

                // To find *potential* fork moves we iterate over all the paths and
                // add any move that would create a win move on the next go-around
                grid.paths().forEach( function( path, index ) {
                    if ( _.isEqual( path, [symbol, null, null] ) ) {
                        add_potential_move( path_coordinates[index][1] );
                        add_potential_move( path_coordinates[index][2] );
                    } else if ( _.isEqual( path, [null, symbol, null] ) ) {
                        add_potential_move( path_coordinates[index][0] );
                        add_potential_move( path_coordinates[index][2] );
                    } else if ( _.isEqual( path, [null, null, symbol] ) ) {
                        add_potential_move( path_coordinates[index][0] );
                        add_potential_move( path_coordinates[index][1] );
                    }
                });

                var move = null;
                var corner_moves = 0;
                var side_moves = 0;

                // An actual fork move is any of the potential moves collected that
                // showed up *twice*, i.e. they provide two win moves.
                for ( var x in potential_moves ) {
                    if ( ! potential_moves.hasOwnProperty(x) ) {
                        continue;
                    }
                    for ( var y in potential_moves[x] ) {
                        if ( ! potential_moves[x].hasOwnProperty(y) ) {
                            continue;
                        }

                        if ( potential_moves[x][y] > 1 ) {
                            move = {x: x, y: y};
                            if ( grid.is_corner_move( move ) ) {
                                corner_moves += 1;
                            } else if ( grid.is_side_move( move ) ) {
                                side_moves += 1;
                            }
                        }
                    }
                }

                // Special case: If the board ends up with us in the
                // center and the player with two opposite corners,
                // then we should pick a side to force them on the
                // defensive rather than blocking a fork in a corner
                // and opening up the other corner's fork.
                if ( side_moves === 0 && corner_moves === 2 ) {
                    move = this.empty_side( grid );
                }

                return move;
            },
            win: function( grid ) {
                return this.win_for( grid, this.get("symbol") );
            },
            block_win: function( grid ) {
                return this.win_for( grid, this.opponent() );
            },
            fork: function( grid ) {
                return this.fork_for( grid, this.get("symbol") );
            },
            block_fork: function( grid ) {
                return this.fork_for( grid, this.opponent() );
            },
            center: function( grid ) {
                return grid.values[1][1] === null ? {"x": 1, "y": 1} : null;
            },
            opposite_corner: function( grid ) {
                var move = null;
                var opponent = this.get("symbol") === "x" ? "o" : "x";

                grid.corners().forEach( function( corner ) {
                    if ( grid.values[corner.y][corner.x] === opponent ) {
                        var opposite = {
                            x: corner.x === 0 ? 2 : 0,
                            y: corner.y === 0 ? 2 : 0
                        };
                        if ( ! grid.values[opposite.y][opposite.x] ) {
                            move = opposite;
                        }
                    }
                });

                return move;
            },
            empty_corner: function( grid ) {
                var move = null;

                grid.corners().forEach( function( corner ) {
                    if ( ! grid.values[corner.y][corner.x] ) {
                        move = corner;
                    }
                });

                return move;
            },
            empty_side: function( grid ) {
                var self = this;

                var move = null;

                // Finding the proper empty side move is a *bit* more complicated
                // than just iterating over sides.  We want to choose a side move
                // that is adjacent to an opponent's corner if possible.  This way
                // we make the desired move but also possibly block potential forks.
                grid.sides().forEach( function( side ) {
                    if ( ! grid.values[side.y][side.x] ) {
                        if (
                            (side.x === 0 || side.x === 2 ) &&
                            (
                                grid.values[0][side.x] === self.opponent() ||
                                grid.values[2][side.x] === self.opponent()
                            )
                        ) {
                            move = side;
                        } else if (
                            side.x === 1 &&
                            (
                                grid.values[side.y][0] === self.opponent() ||
                                grid.values[side.y][2] === self.opponent()
                            )
                        ) {
                            move = side;
                        } else if ( move === null ) {
                            move = side;
                        }
                    }
                });

                return move;
            }
        });

        return Computer;
    }
);
