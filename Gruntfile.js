"use strict";

module.exports = function(grunt) {

  grunt.initConfig({
    jshint : {
      options : {
        "evil" : true,
        "expr" : true,
        "undef" : true,
        "curly": true,
        "indent": 2,
        "white" : false,
        "devel" : true,
        "node" : true
      },
      source : {
        files : {
          src : "lib/*.js"
        }
      },
      specs : {
        files : {
          src : "test/*.js"
        },
        options : {
          globals : {
            it : false,
            describe : false
          }
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.registerTask("spec", function() {
    var done = this.async(), mocha;

    mocha = require('child_process').spawn('mocha', ["--colors"]);

    mocha.stdout.pipe(process.stdout, { end : false });
    mocha.stderr.pipe(process.stdout, { end : false });

    mocha.on('exit', function (code) {
      done(code === 0);
    });
  });
  grunt.registerTask("default", "spec");

}