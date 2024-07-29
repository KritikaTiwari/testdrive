const express = require("express");
const router = express.Router();
const Guard = require("../models/guardModel");

const authMiddleware = require("../middlewares/authMiddleware");
//fetch all data from Guard model
router.get("/get-car-data", authMiddleware, async (req, res) => {
  try {
    const car = await Guard.find({});
    res.status(200).send({
      success: true,
      message: "guard fetched successfully",
      data: car,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "error in getting guard info", success: false, error });
  }
});

//fill the form
router.post("/car-detail", authMiddleware, async (req, res) => {
  try {
    const existingCar = await Guard.findOne({
      userId: req.body.userId,
      time_in: "pending",
    });
    if (existingCar) {
      return res.status(400).send({
        success: false,
        message: "You already have a test drive in progress",
      });
    }
    const car = new Guard(req.body);
    await car.save();
    res.status(200).send({
      success: true,
      message: "Car successfully sent for test drive",
    });
  } catch (error) {
    res.status(501).send({
      message: "Error in applying for test drive",
      success: false,
      error: error.message, // Send the error message back to the client
    });
  }
});
//update the form
router.post("/update-car", authMiddleware, async (req, res) => {
  try {
    const carId = req.body.id;
    const { km_in, time_in } = req.body;
    const car = await Guard.findByIdAndUpdate(carId, {
      km_in,
      time_in,
    });
    res.status(200).send({
      success: true,
      message: "Car details updated successfully",
    });
  } catch (error) {
    res.status(500).send("Error updating car details");
  }
});
module.exports = router;
