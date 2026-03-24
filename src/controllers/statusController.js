const { isValidBranchName } = require("../utils/validator");

const { getLauncherStatus } = require("../services/statusService");
const { switchAndPullBranch } = require("../services/gitService");
const {
    startApp,
    stopApp,
    getAppStatus,
    readAppLogs,
} = require("../services/appService");

function getStatus(req, res) {
    try {
        const status = getLauncherStatus();

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

async function switchAndPull(req, res) {
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
        const result = await switchAndPullBranch(branch);

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

function startAppController(req, res) {
    try {
        const result = startApp();

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

function stopAppController(req, res) {
    try {
        const result = stopApp();

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

function getAppStatusController(req, res) {
    try {
        return res.json({
            ok: true,
            appStatus: getAppStatus(),
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to get app status.",
            error: error.message,
        });
    }
}

function getAppLogsController(req, res) {
    try {
        return res.json({
            ok: true,
            logs: readAppLogs(),
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Failed to read app logs.",
            error: error.message,
        });
    }
}

module.exports = {
    getStatus,
    switchAndPull,
    startAppController,
    stopAppController,
    getAppStatusController,
    getAppLogsController,
};
