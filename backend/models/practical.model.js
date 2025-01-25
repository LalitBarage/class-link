const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const practicalSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  labid: {
    type: String,
    ref: "Lab",
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("practical", practicalSchema);
