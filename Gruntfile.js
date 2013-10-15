module.exports = function(grunt) {
  var karmaConfig = 'karma.conf.js';

  grunt.initConfig({
    karma: {
      unit: {
        configFile: karmaConfig,
        background: true
      },

      continuous: {
        configFile: karmaConfig,
        singleRun: true
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/yahweh.min.js': ['src/yahweh.js'],
          'dist/page-manager.min.js': ['src/page-manager.js']
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['src/*'],
            dest: process.env.HOME + '/CustomMade/static/js/yahweh',
            flatten: true
          }
        ]
      }
    },

    watch: {
      karma: {
        files: ['src/*.js', 'test/**/*.js'],
        tasks: ['karma:unit:run']
      },
      copy: {
        files: ['src/*'],
        tasks: ['copy:main']
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['karma:continuous', 'uglify:dist']);
};