define(
    ["backbone"],
    function( Backbone ) {
        // This is a simple view that shows a message whenever the
        // game ends.  Once a message is displayed and the user clicks
        // on it the game is restarted.
        var StatusView = Backbone.View.extend({
            el: "#status",
            events: {
                "click": "restart_game"
            },
            render: function() {
                var message = "";

                if ( this.model.get("state") === "tie" ) {
                    message = "It's a tie!";
                } else if ( this.model.get("state") === "win" ) {
                    if (
                        this.model.grid.get("winner") ===
                            this.model.human.get("symbol")
                    ) {
                        message = "You won!";
                    } else {
                        message = "You lost!";
                    }
                }

                this.$el.html( message );
            },
            restart_game: function() {
                this.model.restart();
            }
        });

        return StatusView;
    }
);
