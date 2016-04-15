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
      dist: {
        options: {
          baseUrl: '<%= config.app %>/js/',
          include: 'main', // Main script to load
          name: '../../node_modules/almond/almond', // Using almond for production
          out: '<%= config.dist %>/js/app.js',
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
    },
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'clean:serve',
      'requirejs',
      'copy',
      'connect:livereload',
      'watch',
    ]);
  });
};
