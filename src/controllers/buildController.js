const { startBuild, readBuildLogs } = require("../services/buildService");

function startBuildController(req, res) {
    try {
        const result = startBuild();

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

function getBuildLogsController(req, res) {
    try {
        const logs = readBuildLogs();

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

module.exports = {
    startBuildController,
    getBuildLogsController,
};
