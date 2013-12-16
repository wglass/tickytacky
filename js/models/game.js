define(
    ["backbone", "models/player", "models/computer", "models/grid"],
    function( Backbone, Player, Computer, Grid ) {
        var Game = Backbone.Model.extend({
            defaults: {
                "state": null
            },
            initialize: function() {
                // Each game starts with two players, a human player with
                // symbol 'x' and a computer player with symbol 'o'
                this.human = new Player({"symbol": "x"});
                this.computer = new Computer({"symbol": "o"});
                this.grid = new Grid();

                this.listenTo( this.grid, "move_made", this.next_move );
                this.listenTo( this.grid, "change:winner", this.finish );
            },
            start: function() {
                this.grid.set("current_player", "x");
                this.set("state", "started");

                // We'll let the human go first.  Lure 'em into a sense
                // of ease.
                this.human.trigger( "your_move", this.grid );

                this.trigger( "start" );
            },
            finish: function() {
                var winner = this.grid.get("winner");

                if ( winner === "x" || winner === "o" ) {
                    this.set( "state", "win" );
                }
                if ( winner === "tie" ) {
                    this.set( "state", "tie" );
                }
            },
            restart: function() {
                // Restarting a game involves resetting the grid to an
                // initial state, but *not* using new Grid(), since that
                // would render existing references to this.grid borked.

                // Since this mostly mucks with the inner state of the grid
                // it should probably be factored into the grid itself as a
                // reset() method.
                this.grid.values = [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ];
                this.grid.set( "winner", null );
                this.grid.set( "move_count", 0 );
                this.start();
            },
            next_move: function() {
                // Coordinating the next move merely involves
                // 1) making sure we're in the 'started' state
                // 2) setting the grid's current_player to the opposite of
                //    its current value and triggering "your_move" on the
                //    proper player.
                if ( this.get("state") !== "started" ) {
                    return;
                }

                if (
                    this.grid.get("current_player") === this.human.get("symbol")
                ) {
                    this.grid.set(
                        "current_player", this.computer.get("symbol")
                    );
                    this.computer.trigger( "your_move", this.grid );
                } else {
                    this.grid.set(
                        "current_player", this.human.get("symbol")
                    );
                    this.human.trigger( "your_move", this.grid );
                }
            }
        });

        return Game;
    }
);
