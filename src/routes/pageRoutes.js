const express = require("express");
const statusService = require("../services/statusService");

const router = express.Router();

router.get("/aview", (req, res) => {
    const status = statusService.GetLauncherStatus();

    res.render("aview/index", {
        title: "Aview Launcher",
        currentBranch: status.currentBranch,
        buildStatus: status.buildStatus,
        appStatus: status.appStatus,
        appUrl: status.appUrl,
    });
});

router.get("/aviewhub", (req, res) => {
    const status = statusService.GetLauncherStatus();

    res.render("aviewhub/index", {
        title: "Aviewhub Launcher",
        currentBranch: status.currentBranch,
        buildStatus: status.buildStatus,
        appStatus: status.appStatus,
        appUrl: status.appUrl,
    });
});

module.exports = router;
