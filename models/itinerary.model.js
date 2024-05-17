const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  startPoint: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  endPoint: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  stopovers: [
    {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  ],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
});

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
