function GetStatus(req, res) {
    return res.json({
        ok: true,
        currentBranch: "dummy-branch",
        buildStatus: "idle",
        appUrl: "http://localhost",
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

function StartHub(req, res) {
    return res.json({
        ok: true,
        message: "aviewhub start dummy",
    });
}

function StopHub(req, res) {
    return res.json({
        ok: true,
        message: "aviewhub stop dummy",
    });
}

function StartDeepC(req, res) {
    const { inputDir, outputDir } = req.body;

    if (!inputDir || !outputDir) {
        return res.status(400).json({
            ok: false,
            message: "inputDir and outputDir are required.",
        });
    }

    return res.json({
        ok: true,
        message: "deepc start dummy",
        inputDir,
        outputDir,
    });
}

function StartFloy(req, res) {
    const { inputDir, outputDir } = req.body;

    if (!inputDir || !outputDir) {
        return res.status(400).json({
            ok: false,
            message: "inputDir and outputDir are required.",
        });
    }

    return res.json({
        ok: true,
        message: "floy start dummy",
        inputDir,
        outputDir,
    });
}

module.exports = {
    GetStatus,
    SwitchAndPull,
    StartBuild,
    GetBuildLogs,
    StartHub,
    StopHub,
    StartDeepC,
    StartFloy,
};
