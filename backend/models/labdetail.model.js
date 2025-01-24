const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const labdetailSchema = new Schema({
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
    type: String,
    default: "false",
  },
});

module.exports = mongoose.model("labdetail", labdetailSchema);
