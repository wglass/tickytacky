define(
    ["backbone"],
    function( Backbone ) {
        var Game = Backbone.Model.extend({
            defaults: {
                "state": "started"
            }
        });

        return Game;
    }
);
