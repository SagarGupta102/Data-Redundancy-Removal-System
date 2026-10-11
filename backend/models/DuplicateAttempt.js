
const mongoose = require("mongoose");

const duplicateAttemptSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      enum: ["IT", "HR", "Finance", "Operations", "Other"],
    },
    existingRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DuplicateAttempt",
  duplicateAttemptSchema
);