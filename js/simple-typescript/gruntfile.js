module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
  };

  grunt.initConfig({
    config: config,
    ts: {
      default : {
        src: ["<%= config.app %>/ts/**/*.ts"],
      },
    },
    copy: {
      main: {
        files: [{
          expand: true,
          src: ['<%= config.app %>/index.html'],
          dest: '<%= config.dist %>/',
          flatten: true,
        }, {
          expand: true,
          src: ['<%= config.app %>/js/lib/*.js'],
          dest: '<%= config.dist %>/js/',
          flatten: true,
        }],
      },
    },
    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '<%= config.app %>/**/*.js',
        ],
        tasks: ['build-serve'],
      },
    },
    connect: {
      options: {
        port: 9000,
        base: '<%= config.dist %>',
        debug: true,
        livereload: 35729,
        // Change this to 'localhost' to prevent access to the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static(config.dist),
            ];
          },
        },
      },
    },
    clean: {
      serve: '<%= config.dist %>',
      dist: '<%= config.dist %>',
    },
  });

  // Generate obfuscated javascript for production
  grunt.registerTask('build', function (target) {
    grunt.task.run([
      'clean:dist',
      'ts',
      'copy',
    ]);
  });

  // Generate non-obfuscated javascript with mapping for testing purposes
  grunt.registerTask('build-serve', function (target) {
    grunt.task.run([
      'clean:serve',
      'ts',
      'copy',
    ]);
  });

  // Launch a webserver for testing purposes
  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'build-serve',
      'connect:livereload',
      'watch',
    ]);
  });
};
