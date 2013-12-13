var require = {
    baseUrl: "js/",
    paths: {
        "underscore": "lib/underscore-1.4.4.min",
        "backbone": "lib/backbone-1.0.0.min"
    },
    shim: {
        "underscore": {exports: "_"},
        "backbone": {
            exports: "Backbone",
            deps: ["underscore"]
        }
    }
};
