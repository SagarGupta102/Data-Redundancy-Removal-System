
const mongoose = require("mongoose");

const possibleDuplicateSchema = new mongoose.Schema(
  {
    newRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
      required: true,
    },
    existingRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
      required: true,
    },
    matchedFields: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Not Duplicate"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PossibleDuplicate",
  possibleDuplicateSchema
);