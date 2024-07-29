const mongoose = require("mongoose");
const guardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date_of_testdrive: {
      type: Date,
      default: Date.now,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_DL: {
      type: String,
      required: true,
    },
    customer_contact: {
      type: Number,
      required: true,
    },
    demo_no: {
      type: String,
      required: true,
    },
    vehicle_model: {
      type: String,
      required: true,
    },
    chassis_number: {
      type: String,
      required: true,
    },
    location_testdrive: {
      type: String,
      required: true,
    },
    km_out: {
      type: Number,
      required: true,
    },
    km_in: {
      type: Number,
      default: 0,
      required: true,
    },
    time_out: {
      type: String,
      default: () => {
        const currentTime = new Date();
        return currentTime.toLocaleTimeString();
      },
    },
    time_in: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);
//guardSchema.plugin(uniqueValidator);
const guardModel = mongoose.model("guard", guardSchema);
module.exports = guardModel;
