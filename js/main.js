// This program loads the configuration file called "visConfig.json".
// Created by Curran Kelleher Feb 2015
requirejs(["d3", "runtime", "/racer"], function (d3, Runtime, racer) {
  console.log("arguments", arguments)
  var runtime = Runtime(document.getElementById("container"));
  d3.json("/visConfig.json", function (err, config) {
    runtime.config = config;
    racer.load("/racer/configs", function(err, model) {
      window.MODEL = model;
    });
  });
});
