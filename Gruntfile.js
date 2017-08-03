module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/built.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/ServerSpec.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dev: {
        options:{
          mangle: {
            reserved: ['jQuery', 'Backbone']
          }
        },
        files: [{
          expand: true,
          src: ['public/dist/built.js', 'public/lib/*.js'],
          dest: 'public/dist',
          cwd: '.',
        }]
      }
    },

    eslint: {
      target: [
        'app/**/*.js', 'public/**/*.js', 'lib/**/*.js', 'views/**/*.js', 'server.js', 'server-config.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '.',
          src: ['public/style.css'],
          dest: 'public/dist',
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify',
          'eslint',
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin', 'eslint']
      }
    },

    shell: {
      target: {
        command: 'git push live master'
      },
      // prodServer: {
      // }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'watch', 'nodemon' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [ 'test', 'shell'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'build' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'concat', 'uglify', 'eslint', 'upload'
  ]);

  grunt.registerTask('default', [
    'deploy'
  ]);


};
