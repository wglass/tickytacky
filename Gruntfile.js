module.exports = function( grunt ) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        nodeunit: {
            options: {
                reporter: "minimal"
            },
            all: ["tests/**/*_tests.js"]
        },
        jshint: {
            files: [
                'Gruntfile.js', 'config.js',
                'js/models/**/*.js',
                'js/views/**/*.js',
                'tests/**/*_tests.js'
            ],
            options: {
                globals: {
                    console: true,
                    module: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js/",
                    mainConfigFile: "js/config.js",
                    name: "app",
                    out: "tickytacky.min.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('test', ['jshint', 'nodeunit']);

    grunt.registerTask('default', ['jshint', 'nodeunit', 'requirejs']);

};
