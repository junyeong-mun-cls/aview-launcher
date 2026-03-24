const express = require("express");
const {
    startBuildController,
    getBuildLogsController,
} = require("../controllers/buildController");

const router = express.Router();

router.post("/build/start", startBuildController);
router.get("/build/logs", getBuildLogsController);

module.exports = router;
