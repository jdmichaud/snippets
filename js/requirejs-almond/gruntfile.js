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

    requirejs: {
      options: {
        baseUrl: '<%= config.app %>/js/',
        include: 'main', // Main script to load
        name: '../../node_modules/almond/almond', // Using almond for production
        out: '<%= config.dist %>/js/app.js',
      },
      serve: {
        options: {
          optimize: 'none', // disable uglify for debugging purposes
          generateSourceMaps: true,
        },
      },
      dist: {
        options: {
          optimize: 'uglify', // this is the default value
        },
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
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall'],
      },
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
      'requirejs:dist',
      'copy',
    ]);
  });

  // Generate non-obfuscated javascript with mapping for testing purposes
  grunt.registerTask('build-serve', function (target) {
    grunt.task.run([
      'clean:serve',
      'requirejs:serve',
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
