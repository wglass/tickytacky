module.exports = function( grunt ) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            dist: {
                src: ["lib/*.js", "models/**/*.js"],
                dest: "dist/ttt.js"
            }
        },
        uglify: {
            options: {
            },
            dist: {
                files: {
                    "dist/ttt.min.js": ["<%= concat.dist.dest %>"]
                }
            }
        },
        nodeunit: {
            options: {
                reporter: "minimal"
            },
            all: ["tests/**/*_tests.js"]
        },
        jshint: {
            files: ['Gruntfile.js', 'models/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    console: true,
                    module: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'nodeunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jshint', 'nodeunit']);

    grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);

};