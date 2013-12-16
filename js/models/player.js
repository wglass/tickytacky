define(
    ["backbone"],
    function( Backbone ) {
        // Player is just a simple model to represent either a
        // human or computer player.  Since the human player's
        // actions are up to the UI layer and the computer's
        // are defiend in a subclass there isn't much to
        // do here.
        var Player = Backbone.Model.extend({
            defaults: {
                "symbol": null
            },
            opponent: function() {
                return this.get("symbol") === "x" ? "o" : "x";
            },
            make_move: function() {
                throw "Must be implemented by a subclass!";
            }
        });

        return Player;
    }
);
