define(
    ["backbone"],
    function( Backbone ) {
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
