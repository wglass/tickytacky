define(
    ["underscore", "zepto", "backbone"],
    function( _, $, Backbone ) {
        // The GridView owes its simplicity to underscore's templating
        // feature.  The dynamic markup template is located in index.html
        // itself, we merely pass the grid model as context when rendering.
        var GridView = Backbone.View.extend({
            el: "#grid",
            template: _.template($("#grid-template").html()),
            events: {
                "click td": "handle_human_move"
            },
            render: function() {
                this.$el.html(this.template(this.model.grid));
                return this;
            },
            handle_human_move: function( event ) {
                // Whenever a cell in the grid is clicked on, we merely
                // tell the grid model to place the human player's symbol
                // at the clicked spot.
                var cell = this.$(event.currentTarget);

                this.model.grid.place_symbol(
                    parseInt(cell.data("x"), 0), parseInt(cell.data("y"), 0),
                    this.model.human.get("symbol")
                );
            }
        });

        return GridView;
    }
);
