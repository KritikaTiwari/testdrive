const mongoose = require("mongoose");

const testdriveSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date_of_testdrive: {
      type: Date,
      default: Date.now,
    },
    customer_DL: {
      type: String,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_contact: {
      type: Number,
      required: true,
    },
    vehicle_no: {
      type: String,
      required: true,
    },
    vehicle_model: {
      type: String,
      required: true,
    },
    location_testdrive: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      default: "Pratap Cars Pvt. Ltd.",
    },
    brand_name: {
      type: String,
      default: "Renault",
    },
    location: {
      type: String,
      default: "Vaishali Nagar",
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const testdriveModel = mongoose.model("testdrive", testdriveSchema);

module.exports = testdriveModel;
