var fs = require("fs");

var config_content = fs.readFileSync(
    __dirname + "/../js/config.js", "utf8"
);

// For the require.js config to work in the browser it has to set a global
// variable named "require", which is already a thing in node!  So we
// set the node.js function to a placeholder while we evaluate the config.
var require_placeholder = require;

eval ( config_content );

var config = require;

delete config.paths;
delete config.shim;

require = require_placeholder;

var requirejs = require("requirejs");
requirejs.config( config );

global.define = require("amdefine")( module, requirejs );

module.exports = requirejs;
