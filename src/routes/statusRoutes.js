const express = require("express");
const {
    getStatus,
    switchAndPull,
    startAppController,
    stopAppController,
    getAppStatusController,
    getAppLogsController,
    forceStopAppController,
} = require("../controllers/statusController");

const router = express.Router();

router.get("/status", getStatus);

router.post("/switch-pull", switchAndPull);

router.post("/app/start", startAppController);
router.post("/app/stop", stopAppController);
router.get("/app/status", getAppStatusController);
router.get("/app/logs", getAppLogsController);
router.post("/app/force-stop", forceStopAppController);

module.exports = router;
