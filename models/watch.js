"use strict";

module.exports = function(sequelize, DataTypes) {
  var watch = sequelize.define("watch", {
    imdb_code: DataTypes.STRING,
    title: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.watch.hasMany(models.final)
      }
    }
  });

  return watch;
};
