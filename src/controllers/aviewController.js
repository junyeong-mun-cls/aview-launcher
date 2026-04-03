const { isValidBranchName } = require("../utils/validator");
const filePath = require("../utils/filepath");

const gitService = require("../services/gitService");
const buildService = require("../services/buildService");
const appService = require("../services/appService");
const statusService = require("../services/statusService");

function StartBuild(req, res) {
    try {
        const result = buildService.StartBuild();

        if (!result.ok) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to start build.",
            error: error.message,
        });
    }
}

function GetBuildLogs(req, res) {
    try {
        const logs = buildService.ReadBuildLogs();

        return res.json({
            ok: true,
            logs,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to read build logs.",
            error: error.message,
        });
    }
}

function GetStatus(req, res) {
    try {
        const status = statusService.GetLauncherStatus();

        return res.json({
            ok: true,
            ...status,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to load status.",
            error: error.message,
        });
    }
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
            filePath.GetRootPath(),
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

function StartApp(req, res) {
    try {
        const result = appService.StartApp();

        if (!result.ok) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to start app.",
            error: error.message,
        });
    }
}

function StopApp(req, res) {
    try {
        const result = appService.StopApp();

        if (!result.ok) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to stop app.",
            error: error.message,
        });
    }
}

function GetAppStatus(req, res) {
    try {
        return res.json({
            ok: true,
            appStatus: appService.GetAppStatus(),
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to get app status.",
            error: error.message,
        });
    }
}

function GetAppLogs(req, res) {
    try {
        return res.json({
            ok: true,
            logs: appService.ReadAppLogs(),
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to read app logs.",
            error: error.message,
        });
    }
}

function ForceStopApp(req, res) {
    try {
        const result = appService.ForceStopApp();

        if (!result.ok) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to force stop app.",
            error: error.message,
        });
    }
}

module.exports = {
    GetStatus,
    SwitchAndPull,
    StartApp,
    StopApp,
    GetAppStatus,
    GetAppLogs,
    ForceStopApp,
    StartBuild,
    GetBuildLogs,
};
