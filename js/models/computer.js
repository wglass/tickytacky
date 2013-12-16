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
                } else if ( grid.get("move_count") === 3 ) {
                    if ( grid.values[1][1] === self.get("symbol") ) {
                        moves_by_priority = [
                            this.block_win,
                            this.empty_side
                        ];
                    } else {
                        moves_by_priority = [
                            this.block_win,
                            this.empty_corner
                        ];
                    }
                } else {
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
                var path_coordinates = grid.path_coordinates();

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
                        }
                    }
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
