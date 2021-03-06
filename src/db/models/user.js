var mongoose = require("mongoose");

var schema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  about: { type: String, required: true },
});

module.exports = mongoose.model("User", schema);
