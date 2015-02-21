// This program loads the configuration file called "visConfig.json".
// Created by Curran Kelleher Feb 2015
requirejs(["d3", "runtime", "/racer"], function (d3, Runtime, racer) {
  console.log("arguments", arguments)
  var runtime = Runtime(document.getElementById("container"));
  d3.json("/visConfig.json", function (err, config) {
    //runtime.config = config;

    racer.load("/racer/configs", function(err, model) {
      window.MODEL = model;

      var filter = model.filter("configs", function(config) { return true })
        .sort(function(a,b) {
          return b.createdAt - a.createdAt;
        })
      filter.ref("_page.configs")
      // initial update

      var latestConfigPath = "_page.configs.0.config"
      var latestConfig = model.get(latestConfigPath);
      console.log("LATEST", latestConfig)
      if(!latestConfig) {
        latestConfig = config;
        model.add("configs", { config: config, createdAt: new Date() })
      }

      runtime.config = latestConfig

      // if any changes made by other clients we update the view
      model.on("change", "_page.configs.0.config**", function(path, newVal, oldVal, passed){ 
        //console.log("CHANGED", arguments)
        if(!passed.$remote) return;
        var config = model.get(latestConfigPath)
        runtime.config = config;
      })

      runtime.when("config", function(config) {
        var modelConfig = model.get(latestConfigPath);
        if(JSON.stringify(modelConfig) === JSON.stringify(config)) return;
        model.setDiffDeep(latestConfigPath, config);
      })
    });
  });
});
