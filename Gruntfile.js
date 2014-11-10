module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: [
      'js/app.js',
      'js/viewModel.js'
      ]
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: [
      'js/app.js',
      'js/viewModel.js'
        ],
        // the location of the resulting JS file
        dest: 'build/concated_files.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['build/concated_files.js'],
        dest: 'build/app.min.js'
      }
    },
    /*
    jasmine : {
      files: ['js/formValidatorTest.js']
    },
    */
    cssmin: {
      css: {
        src: 'css/app.css',
        dest:'build/app.min.css'
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options https://github.com/kangax/html-minifier#options-quick-reference
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          processScripts : ['text/html']
        },
        files: {                                   // Dictionary of files
          'build/index.html': 'index.html',        // 'destination': 'source'
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: '.',
          cache: [
            'bower_components/building-blocks/style/action_menu.css',
            'bower_components/building-blocks/style/buttons.css',
            'bower_components/building-blocks/style/headers.css',
            'bower_components/building-blocks/style/input_areas.css',
            'bower_components/building-blocks/style_unstable/drawer.css',
            'bower_components/building-blocks/style_unstable/lists.css',
            'bower_components/building-blocks/icons/styles/action_icons.css',
            'bower_components/building-blocks/icons/styles/settings_icons.css',
            'bower_components/building-blocks/transitions.css',
            'bower_components/building-blocks/util.css',
            'bower_components/building-blocks/fonts.css',
            'bower_components/building-blocks/cross_browser.css',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/moment/min/moment-with-locales.min.js',
            'js/basil.min.js',
            'build/app.min.css',
            'build/app.min.js',
            'index.html'
            ],
          network: ['*'],
          exclude: [],
          preferOnline: false,
          verbose: true,
          timestamp: true,
          hash: false,
          master: ['index.html']
        },
        src: ['images/*'],
        dest: 'manifest.appcache'
      }
    },
    watch: {

      options: {
        livereload: true,
        spawn: false
      },

      scss: {
        files: ['css/*.css','index.html','js/*.js'],
        tasks: ['jshint','concat','uglify','cssmin','manifest']
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-manifest');
  //grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','cssmin','htmlmin','manifest']);

};