define(
    ["underscore", "zepto", "backbone"],
    function( _, $, Backbone ) {
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
