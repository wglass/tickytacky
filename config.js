var require = {
    baseUrl: "js/",
    paths: {
        "underscore": "lib/underscore.min",
        "backbone": "lib/backbone.min",
        "zepto": "lib/zepto.min"
    },
    shim: {
        "underscore": {exports: "_"},
        "zepto": {exports: "$"},
        "backbone": {
            exports: "Backbone",
            deps: ["underscore", "zepto"]
        }
    }
};
