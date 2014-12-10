"use strict";

module.exports = function(sequelize, DataTypes) {
  var commentz = sequelize.define("comment", {
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return commentz;
};
