const hubService = require("../services/avewhubService");
const statusService = require("../services/statusService");

function GetStatus(req, res) {
    const status = statusService.GetLauncherStatus();

    return res.json({
        ok: true,
        currentBranch: "dummy-branch",
        buildStatus: "idle",
        appUrl: "http://localhost",
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

    return res.status(result.ok ? 200 : 400).json(result);
}

function StopHub(req, res) {
    const result = hubService.StopTarget("hub");

    return res.status(result.ok ? 200 : 400).json(result);
}

function StartDeepC(req, res) {
    const { inputDir, outputDir } = req.body;

    if (!inputDir || !outputDir) {
        return res.status(400).json({
            ok: false,
            message: "inputDir and outputDir are required.",
        });
    }

    const result = hubService.StartTarget(
        "deepc",
        `(input=${inputDir}, output=${outputDir})`,
    );

    return res.status(result.ok ? 200 : 400).json(result);
}

function StartFloy(req, res) {
    const { inputDir, outputDir } = req.body;

    if (!inputDir || !outputDir) {
        return res.status(400).json({
            ok: false,
            message: "inputDir and outputDir are required.",
        });
    }

    const result = hubService.StartTarget(
        "floy",
        `(input=${inputDir}, output=${outputDir})`,
    );

    return res.status(result.ok ? 200 : 400).json(result);
}

module.exports = {
    SwitchAndPull,
    StartBuild,
    GetBuildLogs,
    GetStatus,
    GetActionLogs,
    StartHub,
    StopHub,
    StartDeepC,
    StartFloy,
    SwitchAndPull,
    StartBuild,
    GetBuildLogs,
};
