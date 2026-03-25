const express = require("express");
const controller = require("../controllers/aviewhubController");

const router = express.Router();

router.get("/status", controller.GetStatus);

router.post("/switch-pull", controller.SwitchAndPull);

router.post("/build/start", controller.StartBuild);
router.get("/build/logs", controller.GetBuildLogs);

router.post("/hub/start", controller.StartHub);
router.post("/hub/stop", controller.StopHub);

router.post("/deepc/start", controller.StartDeepC);
router.post("/floy/start", controller.StartFloy);

module.exports = router;
