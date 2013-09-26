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

    watch: {
      karma: {
        files: ['src/*.js', 'test/**/*.js'],
        tasks: ['karma:unit:run']
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['karma:continuous', 'uglify:dist']);
};