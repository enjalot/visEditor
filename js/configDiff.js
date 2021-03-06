// This module computes the difference ("diff") between two configurations.
// The diff is returned as an array of Action objects.
//
// Based on pervious work found at
// https://github.com/curran/overseer/blob/master/src/configDiff.js
//
// Created by Curran Kelleher Feb 2015
define(["lodash", "action"], function (_, Action) {

  return function configDiff(oldConfig, newConfig){
    var actions = [],
        newAliases = _.keys(newConfig),
        oldAliases = _.keys(oldConfig);

    // Handle removed aliases.
    _.difference(oldAliases, newAliases).forEach(function (alias) {
      actions.push(Action.destroy(alias));
    });

    // Handle updated aliases.
    newAliases.forEach(function (alias) {
      var oldModel = alias in oldConfig ? oldConfig[alias].state || {} : null,
          newModel = newConfig[alias].state || {},
          oldProperties = _.keys(oldModel),
          newProperties = _.keys(newModel);

      // Handle added aliases.
      if(!oldModel){
        actions.push(Action.create(alias, newConfig[alias].plugin));
        newProperties.forEach(function (property) {
          actions.push(Action.set(alias, property, newModel[property]));
        });
      } else {

        // Handle added properties.
        _.difference(newProperties, oldProperties).forEach(function (property) {
          actions.push(Action.set(alias, property, newModel[property]));
        });

        // Handle removed properties.
        _.difference(oldProperties, newProperties).forEach(function (property) {
          actions.push(Action.unset(alias, property));
        });

        // Handle updated properties.
        _.intersection(newProperties, oldProperties).forEach(function (property) {
          if(!_.isEqual(oldModel[property], newModel[property])){
            actions.push(Action.set(alias, property, newModel[property]));
          }
        });
      }
    });
    return actions;
  };
});
