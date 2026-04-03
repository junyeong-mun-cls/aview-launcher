const hubService = require("../services/avewhubService");
const statusService = require("../services/statusService");
const gitService = require("../services/gitService");
const buildService = require("../services/buildService");

function GetStatus(req, res) {
    const status = statusService.GetHubStatus();

    return res.json({
        ok: true,
        currentBranch: status.currentBranch,
        buildStatus: status.buildStatus,
        appUrl: status.appUrl,
        runningTarget: status.runningTarget,
    });
}

function SwitchAndPull(req, res) {
    const branch = (req.body.branch || "").trim();

    if (!branch) {
        return res.status(400).json({
            ok: false,
            message: "Branch is required.",
        });
    }

    return res.json({
        ok: true,
        message: "aviewhub switch & pull dummy success",
        branch,
    });
}

function StartBuild(req, res) {
    return res.json({
        ok: true,
        message: "aviewhub build dummy started",
    });
}

function GetBuildLogs(req, res) {
    return res.json({
        ok: true,
        logs: "[dummy] build log",
    });
}

function GetActionLogs(req, res) {
    const result = hubService.GetActionLogs();

    return res.json({
        ok: true,
        runningTarget: result.runningTarget,
        logs: result.logs,
    });
}

function StartHub(req, res) {
    const result = hubService.StartTarget("hub");

    if (result.ok) {
        hubService.clearAppLogs();
        hubService.appendAppLog("hub process started");
    }

    return res.status(result.ok ? 200 : 400).json(result);
}

function StopHub(req, res) {
    const result = hubService.StopTarget("hub");

    return res.status(result.ok ? 200 : 400).json(result);
}

function GetAppLogs(req, res) {
    return res.json({
        ok: true,
        logs: hubService.ReadAppLogs(),
    });
}

module.exports = {
    SwitchAndPull,
    StartBuild,
    GetBuildLogs,
    GetStatus,
    GetActionLogs,
    StartHub,
    StopHub,
    GetAppLogs,
};
