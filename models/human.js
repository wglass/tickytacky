define(
    ["models/player"],
    function( Player ) {
        var Human = Player.extend({
            make_move: function( grid ) {
            }
        });

        return Human;
    }
);
