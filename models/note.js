"use strict";

module.exports = function(sequelize, DataTypes) {
  var note = sequelize.define("note", {
    content: DataTypes.STRING,
    watch_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return note;
};
