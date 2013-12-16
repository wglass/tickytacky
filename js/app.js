require(
    ["models/game", "views/grid", "views/status"],
    function( Game, GridView, StatusView ) {
        var game = new Game();

        var grid_view = new GridView( {model: game} );
        var status_view = new StatusView( {model: game} );

        var render_grid = function() {
            grid_view.render();
        };
        var render_status = function() {
            status_view.render();
        };

        game.grid.on( "move_made", render_grid );
        game.on( "change:state", render_status );
        game.on( "start", render_grid );

        game.start();
    }
);
