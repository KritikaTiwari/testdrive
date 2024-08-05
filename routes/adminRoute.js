const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const testdriveModel = require("../models/testdriveModel");
const router = express.Router();
const userModel = require("../models/userModel");

// GET all test drive for admin approval
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await testdriveModel
      .find({})
      .populate("userId", "name email");

    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching users",
      success: false,
      error,
    });
  }
});
//getting approval and rejection for the permission
router.post("/change-testdrive-status", authMiddleware, async (req, res) => {
  try {
    const { testdriveId, status } = req.body;
    const testdrive = await testdriveModel.findByIdAndUpdate(testdriveId, {
      status,
    });
    const user = await userModel.findOne({ _id: testdrive.userId });
    // send notification to it's respected sales executive
    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      type: "new-testdrive-request-changed",
      message: `${testdrive.customer_name}  test drive status is ${status}`,
      onClickPath: "/notifications",
    });
    await userModel.findByIdAndUpdate(user._id, { unseenNotification });

    // Get the guard

    const guards = await userModel.find({ isGuard: true, isAdmin: false });
    guards.forEach(async (guard) => {
      const guardUnseenNotification = guard.unseenNotification;
      guardUnseenNotification.push({
        type: "new-testdrive-request-changed",
        message: `${testdrive.customer_name} test drive status is ${status}`,
        onClickPath: "/notifications",
      });
      await userModel.findByIdAndUpdate(guard._id, {
        unseenNotification: guardUnseenNotification,
      });
    });

    res.status(200).send({
      message: "status updated successfully",
      success: true,
      data: testdrive,
    });
  } catch (error) {
    res.status(500).send({
      message: "Status updation failed",
      success: false,
      error,
    });
  }
});

//verify test drive
router.post("/verify-test-drive", authMiddleware, async (req, res) => {
  try {
    const { testdriveId } = req.body;
    const testdrive = await testdriveModel.findByIdAndUpdate(
      testdriveId,
      {
        verification: "verified",
      },
      { new: true }
    );
    if (!testdrive) {
      return res.status(404).send({
        success: false,
        message: "Test drive not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Test drive verification updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating test drive verification: " + error.message,
    });
  }
});
// Update test drive verification
router.post(
  "/update-testdrive-verification",
  authMiddleware,
  async (req, res) => {
    try {
      const { testdriveId, verification } = req.body;
      const testdrive = await testdriveModel.findByIdAndUpdate(
        testdriveId,
        { verification },
        { new: true }
      );
      if (!testdrive) {
        return res.status(404).send({
          success: false,
          message: "Test drive not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Test drive verification updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Error updating test drive verification: " + error.message,
      });
    }
  }
);

module.exports = router;
