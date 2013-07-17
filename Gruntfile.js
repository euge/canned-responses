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
        "node" : true,
        "es5": true,
        "multistr" : true
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
            describe : false,
            beforeEach : false,
            before : false
          }
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("spec", function() {
    require("coffee-script");
    
    var path  = require('path'),
        mocha = new (require('mocha'))({ reporter : "spec" });

    grunt.file.expand([ "test/*.js", "test/*.coffee"])
      .map(path.resolve)
      .map(mocha.addFile.bind(mocha));

    mocha.run(this.async());
  });

  grunt.registerTask("default", [ "jshint", "spec" ]);

}