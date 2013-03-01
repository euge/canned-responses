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
    var path  = require('path'),
        mocha = new (require('mocha'))({});

    grunt.file.expand("test/*.js")
      .map(path.resolve)
      .map(mocha.addFile.bind(mocha));

    mocha.run(this.async());
  });

  grunt.registerTask("default", [ "jshint", "spec" ]);

}