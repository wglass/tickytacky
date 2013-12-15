define(
    ["backbone", "models/human", "models/computer", "models/grid"],
    function( Backbone, Human, Computer, Grid ) {
        var Game = Backbone.Model.extend({
            defaults: {
                "state": null
            },
            initialize: function() {
                this.player_x = new Human({"symbol": "x"});
                this.player_o = new Computer({"symbol": "o"});
                this.grid = new Grid();

                this.listenTo( this.grid, "move_made", this.next_move );
                this.listenTo( this.grid, "change:winner", this.finish );
            },
            start: function() {
                this.grid.set("current_player", "x");
                this.set("state", "started");

                this.player_x.trigger( "your_move", this.grid );
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
            next_move: function() {
                if ( this.get("state") !== "started" ) {
                    return;
                }

                if ( this.grid.get("current_player") === "x" ) {
                    this.grid.set( "current_player", "o" );
                    this.player_o.trigger( "your_move", this.grid );
                } else {
                    this.grid.set( "current_player", "x" );
                    this.player_x.trigger( "your_move", this.grid );
                }
            }
        });

        return Game;
    }
);
