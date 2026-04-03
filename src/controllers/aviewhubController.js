const { isValidBranchName } = require("../utils/validator");
const filePath = require("../utils/filepath");

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

async function SwitchAndPull(req, res) {
    const branch = (req.body.branch || "").trim();

    if (!branch) {
        return res.status(400).json({
            ok: false,
            message: "Branch is required.",
        });
    }

    if (!isValidBranchName(branch)) {
        return res.status(400).json({
            ok: false,
            message: "Invalid branch name.",
        });
    }

    try {
        const result = await gitService.SwitchAndPullBranch(
            branch,
            filePath.GetHubRootPath(),
        );

        if (!result.ok) {
            return res.status(500).json(result);
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Unexpected server error.",
            error: error.message,
        });
    }
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
