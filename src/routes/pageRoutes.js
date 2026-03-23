const express = require("express");
const { getLauncherStatus } = require("../services/statusService");

const router = express.Router();

router.get("/", (req, res) => {
    const status = getLauncherStatus();

    res.render("index", {
        title: "AVIEW Launcher",
        currentBranch: status.currentBranch,
        buildStatus: status.buildStatus,
        appStatus: status.appStatus,
        appUrl: status.appUrl,
    });
});

module.exports = router;
