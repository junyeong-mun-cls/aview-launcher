const express = require("express");
const hubController = require("../controllers/aviewhubController");

const router = express.Router();

router.get("/status", hubController.GetStatus);
router.get("/action-logs", hubController.GetActionLogs);
router.get("/app/logs", hubController.GetAppLogs);

router.post("/switch-pull", hubController.SwitchAndPull);
router.post("/build/start", hubController.StartBuild);
router.get("/build/logs", hubController.GetBuildLogs);

router.post("/hub/start", hubController.StartHub);
router.post("/hub/stop", hubController.StopHub);

module.exports = router;
