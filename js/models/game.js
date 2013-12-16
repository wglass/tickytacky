define(
    ["backbone", "models/player", "models/computer", "models/grid"],
    function( Backbone, Player, Computer, Grid ) {
        var Game = Backbone.Model.extend({
            defaults: {
                "state": null
            },
            initialize: function() {
                this.human = new Player({"symbol": "x"});
                this.computer = new Computer({"symbol": "o"});
                this.grid = new Grid();

                this.listenTo( this.grid, "move_made", this.next_move );
                this.listenTo( this.grid, "change:winner", this.finish );
            },
            start: function() {
                this.grid.set("current_player", "x");
                this.set("state", "started");

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
