const express = require("express");
const aviewController = require("../controllers/aviewController");

const router = express.Router();

router.get("/status", aviewController.GetStatus);
router.post("/switch-pull", aviewController.SwitchAndPull);

router.post("/app/start", aviewController.StartApp);
router.post("/app/stop", aviewController.StopApp);
router.get("/app/logs", aviewController.GetAppLogs);
router.get("/app/status", aviewController.GetAppStatus);
router.post("/app/force-stop", aviewController.ForceStopApp);

router.post("/build/start", aviewController.StartBuild);
router.get("/build/logs", aviewController.GetBuildLogs);

module.exports = router;
