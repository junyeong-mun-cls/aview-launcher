const { getLauncherStatus } = require("../services/statusService");

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

module.exports = {
    getStatus,
};
